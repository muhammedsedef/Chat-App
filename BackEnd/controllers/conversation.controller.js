const Conversation = require('../models/conversation.model');

exports.newConversation = async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save()
        res.status(200).json({ status: 200, message: 'Success', data: savedConversation })
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message })
    }
}

exports.getConversation = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        }).populate('members', 'firstName lastName')
        res.status(200).json({
            status: 200, 
            message: 'Success',
            data: conversations
        })
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message })
    }
}