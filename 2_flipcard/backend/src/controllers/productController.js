const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");

/**
 * Creates a new product with images, price, quantity, and category reference.
 * @route POST /api/product/create
 * @param {Object} req.body - { name, price, description, category, quantity }
 * @param {Array} req.files - Array of uploaded image files via multer
 * @returns {Object} JSON response containing the created product document
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity } = req.body;

    let productPictures = [];
    if (req.files && req.files.length > 0) {
      productPictures = req.files.map((file) => ({ img: file.filename }));
    }

    const product = new Product({
      name,
      slug: slugify(name, { lower: true }),
      price,
      quantity,
      description,
      productPictures,
      category,
      createdBy: req.user._id,
    });

    const savedProduct = await product.save();

    return res.status(201).json({ file: savedProduct, files: req.files });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Fetches products associated with a specific category slug and groups them into price tiers.
 * @route GET /api/products/:slug
 * @param {String} req.params.slug - Category URL slug
 * @returns {Object} JSON response containing products, price ranges, and categorized price breakdown
 */
exports.getProductsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      slug: { $regex: new RegExp(`^${slug}$`, "i") }
    }).select("_id type");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: category._id });

    const priceRange = {
      under1k: 1000,
      under3k: 3000,
      under4k: 4000,
      under5k: 5000,
      under7k: 7000,
    };

    const productsByPrice = {
      under1k: products.filter((product) => product.price <= priceRange.under1k),
      under3k: products.filter(
        (product) => product.price > priceRange.under1k && product.price <= priceRange.under3k
      ),
      under4k: products.filter(
        (product) => product.price > priceRange.under3k && product.price <= priceRange.under4k
      ),
      under5k: products.filter(
        (product) => product.price > priceRange.under4k && product.price <= priceRange.under5k
      ),
      under7k: products.filter(
        (product) => product.price > priceRange.under5k && product.price <= priceRange.under7k
      ),
    };

    return res.status(200).json({ products, priceRange, productsByPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Fetches single product details by product ID.
 * @route GET /api/product/:productId
 * @param {String} req.params.productId - MongoDB ObjectId of target product
 * @returns {Object} JSON response containing product details
 */
exports.getProductDetailsById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Params required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a product from the database by ID.
 * @route DELETE /api/product/deleteProductById
 * @param {Object} req.body.payload - { productId }
 * @returns {Object} JSON response acknowledging deletion result
 */
exports.deleteProductById = async (req, res) => {
  try {
    const { productId } = req.body.payload;

    if (!productId) {
      return res.status(400).json({ error: "Params required" });
    }

    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(202).json({ message: "Product deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves all products created by the authenticated admin user.
 * @route POST /api/product/getProducts
 * @returns {Object} JSON response containing list of products with populated category names
 */
exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};

