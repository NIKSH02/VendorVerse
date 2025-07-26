const UserSchema = require('../models/User.model');
const asynchandler = require('../utils/asynchandler');
const apiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');


const generateAccessTokenAndRefreshToken = async (userId) => {
    try{
        const user =  await UserSchema.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refresh_token = refreshToken;
        await user.save({validateBeforeSave: false}); 
        return {accessToken, refreshToken};
    }catch(err){
        throw new apiError(500, "Something went wrong while assigning access token and refresh token");
    }
}

const loginUser = asynchandler(async (req, res) => {
    const {email,username,password} = req.body;

    if(!email || !username || !password){
        throw new apiError(400, 'Please provide all the required details');
    }

    const user = await UserSchema.findOne({
        $or: [{ email: email }, { username: username }]
    });
    
        if(!user){
            throw new apiError(404, 'User not found');
        } 
       
        const isPasswordMatch = await user.isPasswordMatch(password);
        if (!isPasswordMatch) {
            throw new apiError(400, 'Invalid credentials');
        }

    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser =  await UserSchema.findById(user._id).select('-password -refresh_token');

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).
    cookie('refreshToken', refreshToken, options).
    cookie('accessToken', accessToken, options).
    json(new ApiResponse(200, {accessToken, user: loggedInUser},
        "User logged in successfully"
    ));
    
});

const logoutUser = asynchandler(async (req, res) => {
   await  UserSchema.findByIdAndUpdate(req.user._id, {
     $set : {refresh_token: ''}
    },
     {
        new: true
    }
    
);
const options = {
    httpOnly: true,
    secure: true,
}
return res.status(200).
clearCookie('refreshToken', options).
clearCookie('accessToken', options).
json(new ApiResponse(200, null, "User logged out successfully"));
});

module.exports = {loginUser, logoutUser};
