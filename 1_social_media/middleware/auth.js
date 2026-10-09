const Users = require("../models/userModel");
const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Validates JWT access token sent in Authorization header
 * Attaches authenticated user document to req.user
 */
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ msg: "Authentication token missing." });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ msg: "Invalid or expired token." });
        }

        const user = await Users.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(404).json({ msg: "User account not found." });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = auth;