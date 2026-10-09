const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");

/**
 * Creates a new product category or subcategory in the system.
 * Handles optional file upload for category banner image and optional parentId for subcategories.
 * @route POST /api/category/create
 * @param {Object} req.body - { name, parentId }
 * @returns {Object} JSON response containing the newly created category
 */
exports.createCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        const categoryObj = {
            name,
            slug: `${slugify(name)}`,
            createdBy: req.user._id,
        };

        if (req.file) {
            categoryObj.categoryImage = "/public/" + req.file.filename;
        }

        if (parentId) {
            categoryObj.parentId = parentId;
        }

        const category = new Category(categoryObj);
        await category.save();

        return res.status(201).json({ category });

    } catch (error) {
        console.error("Error adding category:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

/**
 * Helper function to recursively construct a nested category tree structure.
 * Parent categories have parentId = null; subcategories are nested inside `children` arrays.
 * @param {Array} categories - Flat list of category documents from MongoDB
 * @param {String|null} parentId - Parent category ID to filter by
 * @returns {Array} Nested tree structure of category objects
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
 * Retrieves the complete category tree structure for display in navigation menus.
 * @route GET /api/category/getcategory
 * @returns {Object} JSON response containing categoryList tree array
 */
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        if (!categories) {
            return res.status(404).json({ message: "No categories found" });
        }

        const categoryList = createCategories(categories);

        return res.status(200).json({ categoryList });

    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};

/**
 * Bulk updates single or multiple categories in the database (name, parentId, type).
 * Supports both single object payload and array payload.
 * @route POST /api/category/update
 * @param {Object} req.body - { _id, name, parentId, type }
 * @returns {Object} JSON response containing updated categories
 */
exports.updateCategories = async (req, res) => {
    const { _id, name, parentId, type } = req.body;

    const updatedCategories = [];
    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                type: type[i],
            };
            if (parentId[i] !== "") {
                category.parentId = parentId[i];
            }

            const updatedCategory = await Category.findOneAndUpdate(
                { _id: _id[i] },
                category,
                { new: true }
            );
            updatedCategories.push(updatedCategory);
        }
        return res.status(201).json({ updateCategories: updatedCategories });
    } else {
        const category = {
            name,
            type,
        };
        if (parentId !== "") {
            category.parentId = parentId;
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
            new: true,
        });
        return res.status(201).json({ updatedCategory });
    }
};

/**
 * Deletes selected categories from the database by an array of category IDs.
 * @route POST /api/category/delete
 * @param {Object} req.body.payload - { ids: [{ _id }] }
 * @returns {Object} JSON response acknowledging deletion status
 */
exports.deleteCategories = async (req, res) => {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for (let i = 0; i < ids.length; i++) {
      const deleteCategory = await Category.findOneAndDelete({
        _id: ids[i]._id,
        createdBy: req.user._id,
      });
      deletedCategories.push(deleteCategory);
    }
  
    if (deletedCategories.length == ids.length) {
      res.status(201).json({ message: "Categories removed" });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
};