const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    text: {
        type: String
    }
},{timestamps: true});

module.exports = mongoose.model('Messages', MessageSchema);