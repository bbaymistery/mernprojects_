const Users = require('../models/userModel');

/**
 * User Controller
 * Manages user search, profile fetch/update, follow/unfollow, and user recommendations.
 */
const userCtrl = {
    /**
     * Search users by username regex pattern
     */
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({ username: { $regex: req.query.username, $options: 'i' } })
                .limit(10)
                .select("fullname username avatar");

            res.json({ users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get user profile details by User ID
     */
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id)
                .select('-password')
                .populate("followers following", "-password");

            if (!user) return res.status(400).json({ msg: "User does not exist." });

            res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Update current user profile information
     */
    updateUser: async (req, res) => {
        try {
            const { avatar, fullname, mobile, address, story, website, gender } = req.body;
            if (!fullname) return res.status(400).json({ msg: "Full name is required." });

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                avatar, fullname, mobile, address, story, website, gender
            });

            res.json({ msg: "Profile updated successfully!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Follow another user
     */
    follow: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.params.id, followers: req.user._id });
            if (user.length > 0) return res.status(400).json({ msg: "You are already following this user." });

            const newUser = await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { followers: req.user._id } },
                { new: true }
            ).populate("followers following", "-password");

            await Users.findOneAndUpdate(
                { _id: req.user._id },
                { $push: { following: req.params.id } },
                { new: true }
            );

            res.json({ newUser });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Unfollow a user
     */
    unfollow: async (req, res) => {
        try {
            const newUser = await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { followers: req.user._id } },
                { new: true }
            ).populate("followers following", "-password");

            await Users.findOneAndUpdate(
                { _id: req.user._id },
                { $pull: { following: req.params.id } },
                { new: true }
            );

            res.json({ newUser });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get suggested users to follow (random sample excluding currently followed users)
     */
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id];
            const num = req.query.num || 10;

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password");

            return res.json({ users, result: users.length });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = userCtrl;