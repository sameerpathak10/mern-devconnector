const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../../models/UserModel');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config =require('config');

// @route   POST api/users
// @desc    Register user
// @access  Public

router.post('/', [
    check('name','Name is required.').not().isEmpty(),
    check('email','Please include a valid email.').isEmail(),
    check('password','Please enter a password with 6 or more characters.').isLength({min:6})
],async (req,res)=> {

    try{
        //Validate request
        const err =validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({ errors : err.array()});
        }

        const{ name, email, password } =req.body;

        //Check if user already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ errors: 'User already exists!'});
        }

        //Get gravatar of email
        const avatar = gravatar.url(email,{
            s:'200', r:'pg',d:'mm'
        });

        //Crete user instance
        user = new User({ name, email, avatar, password });

        //Encrypt Password

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        //JWT token
        const payload = { user:{ id: user.id } };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token)=>{
                if(err)
                    throw err;
                res.json({token});
            }
        );

        //send("User Registerd!!");

    }catch(error){
        console.log(error.message);
        return res.status(500).json({errors :'Server Error'});
    }
});

module.exports = router;