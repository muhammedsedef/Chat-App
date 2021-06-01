const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
    ] 

}, { timestamps: true });

module.exports = mongoose.model('Conversations', ConversationSchema);


