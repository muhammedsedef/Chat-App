const express = require('express');
const router = express.Router();
const MessagesCtrl = require('../controllers/messages.controller');

const checkAuth = require('../middlewares/check-auth');


//CREATE MESSAGES
router.post('/newMessage', MessagesCtrl.newMessage);
//GET ALL MESSAGES ACCORDING TO CONVERSATION
router.get('/getMessages/:conversationId', MessagesCtrl.getMessages)


module.exports = router;
