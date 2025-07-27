const asynchandler = require("../utils/asynchandler");
const User = require("../models/User.model");
const apiError = require("../utils/apiError");
const uploadOnCloudinary = require("../utils/cloudinary");
const ApiResponse = require("../utils/apiResponse");
const {
  generateOTP,
  generateOTPExpiry,
  verifyOTP,
  canResendOTP,
} = require("../utils/otpGenerator");
const { sendSignupOTP, sendSigninOTPEmail } = require("../utils/emailService");

const registerUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Registration request:", {
    username,
    email,
    password: password ? "PROVIDED" : "MISSING",
  });

  // Simple validation - only require username, email, and password
  if (!username || !email || !password) {
    throw new apiError(400, "Please provide username, email, and password");
  }

  try {
    // Check if user already exists with this email
    const existedUser = await User.findOne({ email });
    console.log(
      "Found existing user:",
      existedUser
        ? {
            email: existedUser.email,
            username: existedUser.username,
            isEmailVerified: existedUser.isEmailVerified,
          }
        : "NO_USER_FOUND"
    );

    if (existedUser) {
      // User already exists
      throw new apiError(409, "User with this email already exists");
    }

    // Check if username is already taken
    const usernameExists = await User.findOne({
      username: username.toLowerCase(),
    });

    if (usernameExists) {
      throw new apiError(409, "Username is already taken");
    }

    // Set default address values (will be completed in profile later)
    const userAddress = {
      street: "To be updated",
      city: "To be updated",
      state: "To be updated",
      pincode: "000000",
      geolocation: {
        lat: 0.0,
        lng: 0.0,
      },
    };

    // Create new user with provided information
    const newUser = await User.create({
      username: username.toLowerCase(),
      email,
      password, // Will be hashed by pre-save middleware
      name: name || username, // Use provided name or username as default
      fullname: fullname || username, // Use provided fullname or username as default
      phone: phone || `temp_${Date.now()}`, // Use provided phone or temporary
      address: userAddress,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=ffffff&size=200`,
      isEmailVerified: false, // Will be verified separately if needed
    });

    // Return user without password
    const createdUser = await User.findById(newUser._id).select(
      "-password -refresh_token"
    );

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(201, "User registered successfully", {
          user: createdUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    console.error("Registration error:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      throw new apiError(
        409,
        `A user with this ${field} (${value}) already exists. Please choose a different ${field}.`
      );
    }

    // Re-throw other errors
    throw error;
  }
});

// Send OTP for email verification during signup
const sendEmailVerificationOTP = asynchandler(async (req, res) => {
  const { email, username } = req.body;
  console.log("Email verification request:", { email, username });

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  // Check if user already exists with this email
  const existingUser = await User.findOne({ email });

  // If user exists and is already fully registered, they can't request new verification
  if (existingUser) {
    const isFullyRegistered =
      existingUser.isEmailVerified &&
      existingUser.password &&
      !existingUser.password.startsWith("temp_password_") &&
      !existingUser.username.startsWith("temp_");

    if (isFullyRegistered) {
      throw new apiError(
        409,
        "Email is already registered and verified. Please use login instead."
      );
    }
  }

  // Check if someone else is trying to use this username (but different email)
  if (username) {
    const usernameExists = await User.findOne({
      username: username.toLowerCase(),
      email: { $ne: email },
      isEmailVerified: true,
      password: { $not: /^temp_password_/ },
    });

    if (usernameExists) {
      throw new apiError(409, "Username is already taken by another user");
    }
  }

  // If user exists but not verified, allow OTP resend (don't throw error)
  console.log(
    "Existing user found:",
    existingUser ? "Yes (not fully registered)" : "No"
  );

  // Check if we can send OTP (rate limiting)
  if (
    existingUser &&
    !canResendOTP(existingUser.emailVerificationOTPLastSent)
  ) {
    throw new apiError(
      429,
      "Please wait 30 seconds before requesting a new OTP"
    );
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = generateOTPExpiry();

  try {
    // Send email
    console.log("Attempting to send OTP email to:", email);
    console.log("Email credentials check:", {
      EMAIL_USER: process.env.EMAIL_USER ? "SET" : "NOT SET",
      EMAIL_PASS: process.env.EMAIL_PASS ? "SET" : "NOT SET",
    });

    await sendSignupOTP(email, otp, username);
    console.log("Email sent successfully");

    // Save or update OTP in database
    if (existingUser) {
      console.log("Updating existing user with new OTP");
      existingUser.emailVerificationOTP = otp;
      existingUser.emailVerificationOTPExpiry = otpExpiry;
      existingUser.emailVerificationOTPLastSent = new Date();
      // Update username if provided
      if (username && username !== existingUser.username) {
        existingUser.username = username;
        existingUser.fullname = username;
      }
      await existingUser.save();
    } else {
      // Create temporary user record with guaranteed unique username
      console.log("Creating temporary user record");
      // Generate a unique temporary username to avoid conflicts
      const baseUsername = username || "user";
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substr(2, 5);
      const tempUsername =
        `temp_${baseUsername}_${timestamp}_${randomSuffix}`.toLowerCase();

      await User.create({
        name: username || "Temp User",
        email,
        username: tempUsername,
        fullname: username || "Temp User",
        phone: `temp_${timestamp}`, // Temporary phone number
        password: `temp_password_${timestamp}`, // Will be updated during actual registration
        address: {
          street: "Temporary Street",
          city: "Temporary City",
          state: "Temporary State",
          pincode: "000000",
          geolocation: {
            lat: 0.0,
            lng: 0.0,
          },
        },
        emailVerificationOTP: otp,
        emailVerificationOTPExpiry: otpExpiry,
        emailVerificationOTPLastSent: new Date(),
        isEmailVerified: false,
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "OTP sent successfully to your email", { email })
      );
  } catch (error) {
    console.error("Error in sendEmailVerificationOTP:", error);
    throw new apiError(
      500,
      `Failed to send verification email: ${error.message}`
    );
  }
});

// Verify email OTP during signup
const verifyEmailOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new apiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found. Please request OTP first");
  }

  // Verify OTP
  const isValid = verifyOTP(
    otp,
    user.emailVerificationOTP,
    user.emailVerificationOTPExpiry
  );

  if (!isValid) {
    throw new apiError(400, "Invalid or expired OTP");
  }

  // Mark email as verified but DON'T fully register user yet
  // User will be fully registered when they submit the complete signup form
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpiry = undefined;
  user.emailVerificationOTPLastSent = undefined;
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Email verified successfully. Please complete your registration.",
      {
        email,
        isEmailVerified: true,
      }
    )
  );
});

// Resend email verification OTP
const resendEmailVerificationOTP = asynchandler(async (req, res) => {
  const { email, username } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new apiError(400, "Email is already verified");
  }

  // Check rate limiting
  if (!canResendOTP(user.emailVerificationOTPLastSent)) {
    throw new apiError(
      429,
      "Please wait 30 seconds before requesting a new OTP"
    );
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = generateOTPExpiry();

  try {
    // Send email
    await sendSignupOTP(email, otp, username || user.username);

    // Update OTP in database
    user.emailVerificationOTP = otp;
    user.emailVerificationOTPExpiry = otpExpiry;
    user.emailVerificationOTPLastSent = new Date();
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "New OTP sent successfully", { email }));
  } catch (error) {
    throw new apiError(500, "Failed to resend verification email");
  }
});

module.exports = {
  registerUser,
  sendEmailVerificationOTP,
  verifyEmailOTP,
  resendEmailVerificationOTP,
};
