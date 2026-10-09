const Cart = require("../models/cart");

/**
 * Updates the cart in the database based on the given condition.
 * Uses Mongoose's `findOneAndUpdate` with `upsert: true` to insert if not found.
 * @param {Object} condition - The query condition to find the document.
 * @param {Object} updateData - The update operation to apply.
 * @returns {Promise} - Resolves with the updated document if successful.
 */
const runUpdate = async (condition, updateData) => {
  try {
    const result = await Cart.findOneAndUpdate(condition, updateData, { upsert: true, new: true });
    return result;
  } catch (err) {
    throw err;
  }
};

/**
 * Adds an item to the user's cart.
 * If the cart exists, it updates the cart items (either updating quantity or adding a new product).
 * If the cart does not exist, it creates a new cart.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.addItemToCart = async (req, res) => {
  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ user: req.user._id }).exec();

    if (cart) {
      // If cart exists, update or add items
      let promiseArray = req.body.cartItems.map(async (cartItem) => {
        const product = cartItem.product;
        const existingItem = cart.cartItems.find((c) => c.product.toString() === product);

        let condition, update;

        if (existingItem) {
          // If product exists in cart, update its quantity
          // Update the product quantity in the cart based on client input
          condition = { user: req.user._id, "cartItems.product": product };
          update = { $set: { "cartItems.$.quantity": cartItem.quantity } };

        } else {
          // If product does not exist in cart, push new product
          condition = { user: req.user._id };
          update = { $push: { cartItems: cartItem } };
        }

        return runUpdate(condition, update);
      });

      // Execute all updates in parallel
      await Promise.all(promiseArray);
      res.status(201).json({ message: "Cart updated successfully", });
    } else {
      // If cart does not exist, create a new one
      const newCart = new Cart({ user: req.user._id, cartItems: req.body.cartItems, });
      await newCart.save();
      res.status(201).json({ cart: newCart });
    }
  } catch (error) {
    console.log({ error });

    res.status(400).json({ error: error.message });
  }
};
/**
 * Fetches the user's active shopping cart items.
 * Formats cart items as a dictionary keyed by product ID for quick client lookup.
 * @route POST /api/user/getCartItems
 * @param {Object} req.user - Authenticated user object from JWT middleware
 * @returns {Object} JSON response containing dictionary of cart items
 */
exports.getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("cartItems.product", "_id name price productPictures")
      .exec();

    if (!cart) {
      return res.status(200).json({ cartItems: {} });
    }

    const cartItems = cart.cartItems.reduce((acc, item) => {
      if (item.product) {
        acc[item.product._id.toString()] = {
          _id: item.product._id.toString(),
          name: item.product.name,
          img: item.product.productPictures?.length > 0 ? item.product.productPictures[0].img : null,
          price: item.product.price,
          qty: item.quantity,
        };
      }
      return acc;
    }, {});

    return res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Removes a specific item from the user's shopping cart by product ID.
 * @route POST /api/user/cart/removeItem
 * @param {Object} req.body.payload - { productId }
 * @returns {Object} JSON response indicating success or failure
 */
exports.removeCartItems = async (req, res) => {
  try {
    const { productId } = req.body.payload;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Update the cart document to pull the specified product item
    const result = await Cart.updateOne(
      { user: req.user._id },
      {
        $pull: {
          cartItems: { product: productId },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    return res.status(202).json({ message: "Item removed successfully", result });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

