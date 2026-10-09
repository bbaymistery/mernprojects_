const express = require("express");
const { requireSignin, adminMiddleware, uploadS3, upload, } = require("../common-middleware");
const { createProduct, getProductsBySlug, getProductDetailsById, deleteProductById, getProducts, } = require("../controllers/productController");
// const multer = require("multer");

//destionaion is the path where the file will be stored

const router = express.Router();
// const shortid = require("shortid");
// const path = require("path");

//for uploading the file in the server we use multer
//multer is a middleware for handling multipart/form-data, which is primarily 
//__used for uploading files.
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.dirname(__dirname), "uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, shortid.generate() + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage });

/*
 upload.single("productPicture"),
 in this the input field name productPicture we 'll send from the postman
 we will choice form-data in the body section of postman
*/
router.post(
    "/product/create",
    requireSignin,
    adminMiddleware,
    upload.array("productPicture"),
    createProduct
);

//!localhost:3000/Samsung > front terefde meselen Samsung >slug 
router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);
router.delete("/product/deleteProductById", requireSignin, adminMiddleware, deleteProductById);
router.post("/product/getProducts", requireSignin, adminMiddleware, getProducts);

module.exports = router;
