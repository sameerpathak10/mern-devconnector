const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/UserModel');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config =require('config');


// @route   GET api/auth
// @desc    Test route
// @access  Private

router.get('/',auth,async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(error){
        console.log(error)
        return res.status(400).json(`Server Error : ${error.message}`);
    }
});



// @route   POST api/auth
// @desc    Authenitcate user and get token
// @access  Public

router.post('/', [
    check('email','Please include a valid email.').isEmail(),
    check('password','Please enter a password with 6 or more characters.').exists()
],async (req,res)=> {

    try{
        //Validate request
        const err =validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({ errors : err.array()});
        }

        const{ email, password } =req.body;

        //Check if user already exists
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ errors: 'Invalid User Credentials'});
        }

        //Encrypt Password

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ errors: 'Invalid User Credentials'});
        }

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