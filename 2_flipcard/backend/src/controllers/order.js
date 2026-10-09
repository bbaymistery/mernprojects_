const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");

/**
 * Creates a new customer order from their shopping cart.
 * Clears the user's current shopping cart and initializes step-by-step order tracking status.
 * @route POST /api/addOrder
 * @param {Object} req.body - Order details (items, addressId, totalAmount, paymentType)
 * @returns {Object} JSON response containing the newly created order
 */
exports.addOrder = async (req, res) => {
  try {
    // Delete the active shopping cart for the user upon checkout
    const result = await Cart.deleteOne({ user: req.user._id });

    if (!result.deletedCount) {
      return res.status(400).json({ error: "Failed to delete cart or cart not found" });
    }

    // Assign authenticated user ID to the order document
    req.body.user = req.user._id;

    // Initialize multi-step order lifecycle tracking timeline
    req.body.orderStatus = [
      { type: "ordered", date: new Date(), isCompleted: true },
      { type: "packed", isCompleted: false },
      { type: "shipped", isCompleted: false },
      { type: "delivered", isCompleted: false },
    ];

    // Instantiate and persist new order document
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({ order });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches all orders placed by the authenticated customer.
 * Populates product details (name, pictures) for each item in the order.
 * @route GET /api/getOrders
 * @returns {Object} JSON response containing list of customer orders
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select("_id paymentStatus paymentType orderStatus items")
      .populate("items.productId", "_id name productPictures")
      .lean();

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetches single order details including populated product info and shipping address.
 * @route POST /api/getOrder
 * @param {Object} req.body - { orderId }
 * @returns {Object} JSON response containing single order document merged with delivery address details
 */
exports.getOrder = async (req, res) => {
  try {
    // Query order and populate product references
    const order = await Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id name productPictures")
      .lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Query user address collection to locate matching delivery address
    const addressData = await Address.findOne({ user: req.user._id }).lean();

    let matchingAddress = null;
    if (addressData && Array.isArray(addressData.address)) {
      matchingAddress = addressData.address.find(
        (adr) => adr._id.toString() === order.addressId?.toString()
      );
    }

    // Attach resolved delivery address object to response
    const updatedOrderWithAddress = {
      ...order,
      address: matchingAddress || null,
    };

    res.status(200).json({ order: updatedOrderWithAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

