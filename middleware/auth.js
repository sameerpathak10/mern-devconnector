const jwt = require('jsonwebtoken');
const config = require('config');


module.exports =(req,res,next)=>{
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if token present
    if(!token){
        return res
            .status(401)
            .json( { msg : 'No Token, authorization denied'});
    }

    //verify token
    try{
        jwt.verify(token,config.get('jwtSecret'), (error, decoded) => {
        if (error) {
            return res.status(401).json({ msg: 'Token is not valid' });
          } else {
            req.user = decoded.user;
            next();
          }
        });
    }
    catch(error){
        console.error('something wrong with auth middleware');
        return res.status(500).json(`Server error: ${error.message}`);
    }
};