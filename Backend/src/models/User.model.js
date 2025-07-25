const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim : true,
        index : true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim : true,
        
    },
    fullname:{
        type: String,
        required: true,
        index : true
    },
    avatar:
    {
        type: String //url
        
    },
    coverImage:{
        type: String //url
    },
    watchHistory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"video"
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        trim : true
    },
    refresh_token:{
        type: String
    },
    // Email verification OTP fields
    emailVerificationOTP: {
        type: String
    },
    emailVerificationOTPExpiry: {
        type: Date
    },
    emailVerificationOTPLastSent: {
        type: Date
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // Signin OTP fields
    signinOTP: {
        type: String
    },
    signinOTPExpiry: {
        type: Date
    },
    signinOTPLastSent: {
        type: Date
    }
}, {timestamps: true});

UserSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

UserSchema.methods.isPasswordMatch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};  

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        id: this._id,
        username: this.username,
        fullname: this.fullname

    }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        id: this._id
    }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
}


module.exports = mongoose.model('User', UserSchema);
