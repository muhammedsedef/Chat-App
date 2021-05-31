const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user.controller');

const checkAuth = require('../middlewares/check-auth');

const { userValidationRules, validate, resetPasswordValidationRules } = require('../middlewares/validator');

//CREATE USER
router.post('/signup', userValidationRules(), validate, UserCtrl.signup);
//LOGIN
router.post('/login', UserCtrl.login);




module.exports = router;