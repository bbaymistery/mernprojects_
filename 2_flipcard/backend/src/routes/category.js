const express = require("express");
const { createCategory, getCategories, updateCategories, deleteCategories, } = require("../controllers/categoryController");
const { requireSignin, adminMiddleware, superAdminMiddleware, upload, } = require("../common-middleware");
const router = express.Router();




/*
 upload.single("categoryImage
 in this the input field name categoryImage from the postman
 we will choice form-data in the body section of postman
*/
router.post(
    "/category/create",
    requireSignin,
    superAdminMiddleware,
    upload.single("categoryImage"),
    createCategory
);
router.get("/category/getcategory", getCategories);

router.post(
    "/category/update",
    requireSignin,
    superAdminMiddleware,
    upload.array("categoryImage"),
    updateCategories
);
router.post(
    "/category/delete",
    requireSignin,
    superAdminMiddleware,
    deleteCategories
);

module.exports = router;
