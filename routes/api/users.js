const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/register');

router.get("/test", (req, res) => res.json({msg: "This is a users route"}));

router.post('/register', (req, res) => {

    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                //throw 400 error if user exists
                return res.status(400).json({email:"A user has already been registered"})
            } else {
                newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email, 
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err,hash) => { 
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => { 
            if (!user) {
                return res.status(404).json({email: 'This user does not exist'});
            }
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch){ 
                    //create payload to send back
                    const payload = {
                        id: user.id,
                        handle: user.handle,
                        email: user.email
                    }
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {expiresIn: 3600}, // set expiration timer
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        }
                    )
                } else {
                    return res.status(400).json({password: 'Incorrect password'});
                }
            })
        })
});

module.exports = router;