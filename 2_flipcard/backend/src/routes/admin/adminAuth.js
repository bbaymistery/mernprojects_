const express = require('express');
const { signup, signin } = require('../../controllers/admin/adminAuthController');
const { validateSignupRequest, validateSigninRequest, isRequestValidated } = require('../../validators/auth');
const { signout } = require('../../controllers/admin/adminAuthController');
const router = express.Router();

router.post('/admin/signup',validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signin',validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', signout)


module.exports = router;