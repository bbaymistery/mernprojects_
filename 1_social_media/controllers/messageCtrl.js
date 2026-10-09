const Conversations = require('../models/conversationModel');
const Messages = require('../models/messageModel');

/**
 * API Features Utility for pagination
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
 * Message Controller
 * Handles direct messaging, conversation upserts, message pagination, and deletions.
 */
const messageCtrl = {
    /**
     * Send a direct message or log a call record
     */
    createMessage: async (req, res) => {
        try {
            const sender = req.body.sender || req.user._id;
            const { recipient, text = '', media = [], call } = req.body;

            if (!recipient || (!text.trim() && media.length === 0 && !call)) {
                return res.status(400).json({ msg: "Message content or media required, along with recipient ID." });
            }

            const newConversation = await Conversations.findOneAndUpdate(
                {
                    $or: [
                        { recipients: [sender, recipient] },
                        { recipients: [recipient, sender] }
                    ]
                },
                {
                    recipients: [sender, recipient],
                    text,
                    media,
                    call
                },
                { new: true, upsert: true }
            );

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender,
                recipient,
                text,
                media,
                call
            });

            await newMessage.save();

            res.json({ msg: 'Message sent successfully!', newConversation, newMessage });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get list of conversations for logged-in user
     */
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).paginating();

            const conversations = await features.query.sort('-updatedAt')
                .populate('recipients', 'avatar username fullname');

            res.json({ conversations, result: conversations.length });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Get paginated message history with a specific recipient
     */
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id }
                ]
            }), req.query).paginating();

            const messages = await features.query.sort('-createdAt');

            res.json({ messages, result: messages.length });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Delete a specific message by ID
     */
    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id });
            res.json({ msg: 'Message deleted successfully!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    /**
     * Delete an entire conversation thread and associated messages
     */
    deleteConversation: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            });

            if (newConver) {
                await Messages.deleteMany({ conversation: newConver._id });
            }

            res.json({ msg: 'Conversation deleted successfully!' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = messageCtrl;