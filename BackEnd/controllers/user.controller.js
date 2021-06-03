const User = require('../models/User.model');

const bcrypt = require('bcrypt');
const saltRounds = 12;

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

//CREATE NEW USER
exports.signup = async (req, res) => {

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) { //If we have some validation errors 
        return res.status(422).json({ // Status : 422 Unprocessable Entity
            status: 422,
            message: validationErrors.array()
        });
    }

    let user = await User.findOne({code: req.body.code})
    if (!user) return res.status(404).json({ status: 404, message: "No user matching the code entered was found" });

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => { // hashing password
        if (err) {
            return res.status(500).json({ // Internal Server Error, status: 500
                status: 500,
                message: err.message
            });
        }
        
        user.username = req.body.username
        user.email = req.body.email
        user.password = hash
        user.registrationDate = Date.now()

        user.save()
            .then((createdUser) => {
                res.status(201).json({
                    status: 201,
                    data: createdUser,
                    message: 'User created successfully'
                });
            }).catch((err) => {
                res.status(500).json({ // Internal Server Error, status: 500
                    status: 500,
                    message: err.message
                });
            });
    });
};

//LOGIN 
exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ // Resource requested does not exist, Status : 404
                status: 404,
                message: "Email does not exist"
            });
        }
        let validPassword = await bcrypt.compare(req.body.password, user.password) // Comparing whether the user's password matches or not
        if (!validPassword) { //If result is false
            return res.status(403).json({ // 403 - Forbidden
                status: 403,
                message: "Wrong Password!"
            });
        }
        // Result is true => passwords are matched!
        const token = jwt.sign({ // Assing token to the user
            userId: user._id,
        },
            process.env.JWT_KEY,
            {
                expiresIn: "3h" //Token valid for 3 hours
            }
        );
        res.status(200).json({
            status: 200,
            data: user,
            message: "Success",
            token: token
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }

};

//GET ALL USERS

exports.getUsers = async (req,res) => {
    try {
        let users = await User.find({}, {password:0})
        res.status(200).json({ 
            status: 200,
            message : 'Success', 
            data: users
        })
    } catch (err) {
        res.status(500).json({ status: 500, message: error.message });
    }
}

exports.getUser = async (req,res) => {
    try {
        let user = await User.findById(req.params.id)
        res.status(200).json({
            status: 200,
            message: 'Success',
            data: user
        })
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}