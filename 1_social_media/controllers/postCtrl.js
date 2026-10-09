const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const Users = require('../models/userModel');

/**
 * API Features Utility Class for MongoDB pagination
 */
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

/**
 * Post Controller
 * Manages post creation, feed retrieval, updating, deleting, liking/unliking, and bookmarking.
 */
const postCtrl = {
    /**
     * Create a new post
     */
    createPost: async (req, res) => {
        try {
            const { content, images } = req.body;
            if (images.length === 0) return res.status(400).json({ msg: "Please attach at least one photo." });

            const newPost = new Posts({ content, images, user: req.user._id });
            await newPost.save();

            res.json({ msg: 'Post created successfully!', newPost: { ...newPost._doc, user: req.user } });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get feed posts for current user (posts from followed accounts + own posts)
     */
    getPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                user: [...req.user.following, req.user._id]
            }), req.query).paginating();

            const posts = await features.query.sort('-createdAt')
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            res.json({ msg: 'Success!', result: posts.length, posts });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Update existing post content and media
     */
    updatePost: async (req, res) => {
        try {
            const { content, images } = req.body;
            const post = await Posts.findOneAndUpdate({ _id: req.params.id }, { content, images })
                .populate("user likes", "avatar username fullname");

            res.json({ msg: "Post updated successfully!", newPost: { ...post._doc, content, images } });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Like a post
     */
    likePost: async (req, res) => {
        try {
            const post = await Posts.find({ _id: req.params.id, likes: req.user._id });
            if (post.length > 0) return res.status(400).json({ msg: "You have already liked this post." });

            const like = await Posts.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { likes: req.user._id } },
                { new: true }
            );

            if (!like) return res.status(400).json({ msg: 'Post not found.' });

            res.json({ msg: 'Post liked!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Unlike a post
     */
    unLikePost: async (req, res) => {
        try {
            const like = await Posts.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { likes: req.user._id } },
                { new: true }
            );

            if (!like) return res.status(400).json({ msg: 'Post not found.' });

            res.json({ msg: 'Post unliked!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get posts created by a specific user ID
     */
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query).paginating();
            const posts = await features.query.sort("-createdAt");
            res.json({ posts, result: posts.length });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get single post detail by ID
     */
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username fullname followers")
                .populate({ path: "comments", populate: { path: "user likes", select: "-password" } });

            if (!post) return res.status(400).json({ msg: 'Post not found.' });
            res.json({ post });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Discover feed: Retrieve posts from accounts not currently followed
     */
    getPostsDicover: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id];

            const features = new APIfeatures(Posts.find({
                user: { $nin: newArr }
            }), req.query).paginating();

            const posts = await features.query.sort('-createdAt')
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Delete post and associated comments
     */
    deletePost: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id });
            if (post) {
                await Comments.deleteMany({ _id: { $in: post.comments } });
            }

            res.json({ msg: 'Post deleted successfully!', newPost: { ...post?._doc, user: req.user } });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Save/Bookmark a post
     */
    savePost: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id });
            if (user.length > 0) return res.status(400).json({ msg: "Post is already saved." });

            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { saved: req.params.id }
            }, { new: true });

            if (!save) return res.status(400).json({ msg: 'User account not found.' });

            res.json({ msg: 'Post bookmarked!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Remove post from saved/bookmarked list
     */
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { saved: req.params.id }
            }, { new: true });

            if (!save) return res.status(400).json({ msg: 'User account not found.' });

            res.json({ msg: 'Post removed from saved list!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get all saved/bookmarked posts for logged-in user
     */
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ _id: { $in: req.user.saved } }), req.query).paginating();
            const savePosts = await features.query.sort("-createdAt");
            res.json({ savePosts, result: savePosts.length });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = postCtrl;