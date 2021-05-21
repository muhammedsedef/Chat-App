const User = require('../models/User.model');

const bcrypt = require('bcrypt');
const saltRounds = 12;

const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

//CREATE NEW USER
exports.signup = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) { //If we have some validation errors 
        return res.status(422).json({ // Status : 422 Unprocessable Entity
            status: 422,
            message: validationErrors.array()
        });
    }

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => { // hashing password
        if (err) {
            return res.status(500).json({ // Internal Server Error, status: 500
                status: 500,
                message: err.message
            });
        }
        const user = new User({ //Insert user information to database
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            email: req.body.email,
            password: hash,
        });
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
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({ // Resource requested does not exist, Status : 404
            status: 404,
            message: "Email does not exist"
        });
    }
    let comparedPassword = await bcrypt.compare(req.body.password, user.password) // Comparing whether the user's password matches or not
    if (!comparedPassword) { //If result is false
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
};
