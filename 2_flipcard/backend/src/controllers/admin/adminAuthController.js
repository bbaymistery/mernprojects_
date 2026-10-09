const User = require('../../models/user');
const { generateJwtToken } = require('../../utils');
const bcrypt = require("bcrypt");
const shortid = require("shortid");

/**
 * Registers a new admin or super-admin user account.
 * Dynamically assigns 'super-admin' if it's the first user in the system, otherwise 'admin'.
 * @route POST /api/admin/signup
 * @param {Object} req.body - { firstName, lastName, email, password }
 * @returns {Object} JSON response confirming administrative account creation
 */
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if admin user exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Admin already registered" });

        // Determine user role dynamically (first registered account becomes super-admin)
        const userCount = await User.countDocuments();
        let roleOfMe = userCount === 0 ? "super-admin" : "admin";

        // Hash raw password securely using bcrypt
        const hash_password = await bcrypt.hash(password, 10);

        // Instantiate new admin user document
        const newUser = new User({
            firstName,
            lastName,
            email,
            hash_password,
            username: shortid.generate(),
            role: roleOfMe,
        });

        // Persist admin user to database
        const savedUser = await newUser.save();

        if (savedUser) {
            return res.status(201).json({ message: "Admin created successfully" });
        }
        return res.status(400).json({ message: "Something went wrong" });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Authenticates an admin user to access the Admin Control Panel.
 * Verifies role authorization ('admin' or 'super-admin') and generates a JWT token.
 * @route POST /api/admin/signin
 * @param {Object} req.body - { email, password }
 * @returns {Object} JSON response containing token and user profile
 */
exports.signin = async (req, res) => {
    try {
        // Query user record by email address
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password against hash
        const isPasswordValid = await user.authenticate(req.body.password);

        if (user.role === "user") {
            return res.status(400).json({ message: "User access denied. Admin access required." });
        }
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        // Generate authorization JWT token
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;

        return res.status(200).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName },
            message: "Admin Logged In Successfully"
        });
    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Clears authentication session cookies for the admin user.
 * @route POST /api/admin/signout
 * @returns {Object} JSON response confirming signout status
 */
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "Signout successfully",
    });
};