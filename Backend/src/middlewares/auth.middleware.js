const asynchandler = require('../utils/asynchandler');
const apiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const verifyJWT = asynchandler(async (req, _, next) => {
 try {
       const token =  req.cookies?.accessToken ||req.headers.authorization?.replace("Bearer","") 
   
       if (!token) {
           throw new apiError(401, 'Unauthorized');
       }
   
       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   
       const user = await User.findById(decoded?.id).select('-password -refresh_token').lean();
   
       if(!user){
           throw new apiError(401, 'invalid token');
       }
   
       req.user = user;
   
       next();
 } catch (error) {
     throw new apiError(401, 'Unauthorized');
    
 }
});

module.exports = verifyJWT; // Export the verifyJWT function