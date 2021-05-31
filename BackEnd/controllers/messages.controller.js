const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const CryptoJS = require('crypto-js')

exports.newMessage = async (req, res) => {

    const { conversationId, senderId, text } = req.body

    try {
        //Encrypt message with AES algorith
        let ciphertext = CryptoJS.AES.encrypt(text, process.env.AES_KEY).toString();

        const message = new Message({
            conversationId,
            senderId,
            text: ciphertext
        })

        await message.save()
        res.status(200).json({
            status: 200,
            message: 'Success',
            data: message
        })
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message })
    }
}

exports.getMessages = async (req, res) => {
    try {
        let messages = await Message.find({ conversationId: req.params.conversationId })
        
        //Decrypt for messages
        messages.map(message =>{
            var bytes  = CryptoJS.AES.decrypt(message.text, process.env.AES_KEY);
            message.text = bytes.toString(CryptoJS.enc.Utf8);
        })
        
        res.status(200).json({
            status: 200,
            message: 'Success',
            data: messages
        })
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message })
    }
}