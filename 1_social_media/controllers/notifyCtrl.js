const Notifies = require('../models/notifyModel');

/**
 * Notification Controller
 * Manages creation, deletion, retrieval, read status, and mass clear of user notifications.
 */
const notifyCtrl = {
    /**
     * Create a notification record for recipient users
     */
    createNotify: async (req, res) => {
        try {
            const { id, recipients, url, text, content, image } = req.body;
            if (recipients.includes(req.user._id.toString())) return res.status(200).json({ msg: "Self notification skipped." });

            const notify = new Notifies({ id, recipients, url, text, content, image, user: req.user._id });
            await notify.save();
            return res.json({ notify });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Remove a specific notification by ID and URL
     */
    removeNotify: async (req, res) => {
        try {
            const notify = await Notifies.findOneAndDelete({ id: req.params.id, url: req.query.url });
            return res.json({ notify });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Retrieve all active notifications for logged-in user
     */
    getNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.find({ recipients: req.user._id })
                .sort('-createdAt')
                .populate('user', 'avatar username');

            return res.json({ notifies });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Mark a notification as read
     */
    isReadNotify: async (req, res) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({ _id: req.params.id }, { isRead: true });
            return res.json({ notifies });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Delete all notifications for logged-in user
     */
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.deleteMany({ recipients: req.user._id });
            return res.json({ notifies });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = notifyCtrl;