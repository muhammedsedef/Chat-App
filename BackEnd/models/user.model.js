const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: true
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin : {
        type : Boolean, 
        default : false
    },
    code: {
        type: String
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Users', UserSchema);