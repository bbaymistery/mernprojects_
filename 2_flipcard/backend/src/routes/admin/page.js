const express = require('express');
const { createPage, getPage } = require('../../controllers/admin/page');
const { adminMiddleware, requireSignin, upload } = require('../../common-middleware');
const router = express.Router();
router.post(
    `/page/create`,
    requireSignin,
    adminMiddleware,
    upload.fields([{ name: 'banners' }, { name: 'products' }]),
    createPage)

router.get(`/page/:category/:type`, getPage);

module.exports = router;