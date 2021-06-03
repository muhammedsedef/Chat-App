const express = require('express');
const router = express.Router();
const ConversationCtrl = require('../controllers/conversation.controller');

const checkAuth = require('../middlewares/check-auth');


//CREATE CONVERSATION
router.post('/newConversation', ConversationCtrl.newConversation);
//GET CONVERSATIONS
router.get('/getConversation/:userId', ConversationCtrl.getConversation);

router.get('/getAllConversations', ConversationCtrl.getAllConversations)

router.get("/getConversationById/:convId",ConversationCtrl.getConversationById )


module.exports = router;
