const Page = require("../../models/page");

/**
 * Creates or updates a dynamic category landing page document with banners and product showcases.
 * Handles multipart banner image and product thumbnail file uploads.
 * @route POST /api/page/create
 * @param {Object} req.body - { title, description, category, type }
 * @param {Object} req.files - { banners: [], products: [] } uploaded files
 * @returns {Object} JSON response containing updated or created page document
 */
exports.createPage = async (req, res) => {
  try {
    const { banners, products } = req.files;

    // Attach banner image metadata and click-through navigation routes
    if (banners?.length > 0) {
      req.body.banners = banners.map(banner => ({
        img: `/${banner.filename}`,
        navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
      }));
    }

    // Attach product thumbnail image metadata and click-through navigation routes
    if (products?.length > 0) {
      req.body.products = products.map(product => ({
        img: `/${product.filename}`,
        navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
      }));
    }

    req.body.createdBy = req.user._id;

    // Query existing page configuration for the target category
    const existingPage = await Page.findOne({ category: req.body.category });

    if (existingPage) {
      // Update existing category page configuration
      const updatedPage = await Page.findOneAndUpdate(
        { category: req.body.category },
        req.body,
        { new: true }
      );
      return res.status(201).json({ message: "Page updated successfully", page: updatedPage });
    }

    // Persist new category page configuration
    const newPage = new Page(req.body);
    await newPage.save();

    return res.status(201).json({ message: "Page created successfully", page: newPage });

  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

/**
 * Retrieves dynamic category page layout details by category ID and page type.
 * @route GET /api/page/:category/:type
 * @param {String} req.params.category - MongoDB Category ID
 * @param {String} req.params.type - Page type identifier ('page')
 * @returns {Object} JSON response containing page banner and product layout config
 */
exports.getPage = async (req, res) => {
  try {
    const { category, type } = req.params;

    if (type !== "page") {
      return res.status(400).json({ error: "Invalid page type" });
    }

    const page = await Page.findOne({ category });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.status(200).json({ page });

  } catch (error) {
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

