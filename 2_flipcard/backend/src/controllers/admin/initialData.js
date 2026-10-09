const Category = require("../../models/category");
const Product = require("../../models/product");
const Order = require("../../models/order");

/**
 * Helper function to structure flat categories into a nested hierarchical tree.
 * @param {Array} categories - Array of category documents from MongoDB
 * @param {String|null} parentId - Parent category ID for filtering subcategories
 * @returns {Array} Structured category tree array
 */
function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

/**
 * Fetches all initial dashboard data required by the Admin App on application boot.
 * Retrieves category trees, admin products, and customer orders in a single payload.
 * @route POST /api/admin/initialdata
 * @param {Object} req.user - Authenticated admin user object
 * @returns {Object} JSON response containing categories, products, and orders arrays
 */
exports.initialData = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();

    const products = await Product.find({ createdBy: req.user._id })
      .select("_id name price quantity slug description productPictures category")
      .populate({ path: "category", select: "_id name" })
      .exec();

    const orders = await Order.find({})
      .populate("items.productId", "name")
      .exec();

    res.status(200).json({
      categories: createCategories(categories),
      products,
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch initial data" });
  }
};

