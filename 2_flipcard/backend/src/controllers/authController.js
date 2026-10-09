const User = require('../models/user');
const { generateJwtToken } = require('../utils');
const bcrypt = require("bcrypt");
const shortid = require("shortid");

/**
 * Registers a new customer user in the database.
 * @route POST /api/signup
 * @param {Object} req.body - { firstName, lastName, email, password }
 * @returns {Object} JSON response with created user object and JWT bearer token
 */
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already registered" });

        // Hash raw password securely using bcrypt salt factor 10
        const hash_password = await bcrypt.hash(password, 10);

        // Instantiate new user document with generated unique username
        const newUser = new User({ firstName, lastName, email, hash_password, username: shortid.generate() });

        // Persist user to database
        const savedUser = await newUser.save();

        // Issue JWT payload token
        const token = generateJwtToken(savedUser._id, savedUser.role);

        // Filter out sensitive data before returning user profile
        const { _id, role, fullName } = savedUser;
        const user = { _id, firstName, lastName, email, role, fullName };

        return res.status(201).json({ message: "Registered!", token, user });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Authenticates an existing customer user and issues a JWT token.
 * @route POST /api/signin
 * @param {Object} req.body - { email, password }
 * @returns {Object} JSON response with token and user profile details
 */
exports.signin = async (req, res) => {
    try {
        // Query user record by email address
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password against hashed password and verify user role
        const isPasswordValid = await user.authenticate(req.body.password);
        if (!isPasswordValid || user.role !== "user") {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate authorization JWT token
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;

        return res.status(200).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName },
            message: "Login successful"
        });
    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};