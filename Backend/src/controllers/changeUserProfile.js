const UserSchema = require("../models/User.model");
const asynchandler = require("../utils/asynchandler");
const apiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadOnCloudinary = require("../utils/cloudinary");

const changePassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new apiError(400, "Please provide all the required details");
  }

  const user = await UserSchema.findById(req.user._id);
  // const user = await UserSchema.findOne({ password: req.body.oldPassword });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  const isPasswordMatch = await user.isPasswordMatch(oldPassword);

  if (!isPasswordMatch) {
    throw new apiError(400, "Invalid credentials");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  const user = await UserSchema.findById(req.user._id)
    .select("-password -refresh_token")
    .lean();
  return res.status(200).json(new ApiResponse(200, user, "User details"));
});

const updateAccountDetails = asynchandler(async (req, res) => {
  const { username, fullname, name, phone } = req.body;

  if (!username && !fullname && !name && !phone) {
    throw new apiError(400, "Please provide at least one field to update");
  }

  // Build update object with only provided fields
  const updateFields = {};
  if (username) updateFields.username = username;
  if (fullname) updateFields.fullname = fullname;
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;

  const user = await UserSchema.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
  }).select("-password -refresh_token");

  if (!user) {
    throw new apiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const changeAvatar = asynchandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar
    ? req.files.avatar.tempFilePath
    : null;

  if (!avatarLocalPath) {
    throw new apiError(400, "Please provide an avatar");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new apiError(500, "Failed to upload avatar");
  }

  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar.url },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const changeCoverImages = asynchandler(async (req, res) => {
  const coverImagesLocalPaths = req.files["cover images"]?.map(
    (file) => file.tempFilePath
  );

  if (!coverImagesLocalPaths) {
    throw new apiError(400, "Please provide cover images");
  }

  const coverImages = await Promise.all(
    coverImagesLocalPaths.map(async (coverImageLocalPath) => {
      return await uploadOnCloudinary(coverImageLocalPath);
    })
  );

  if (!coverImages) {
    throw new apiError(500, "Failed to upload cover images");
  }

  const user = await UserSchema.findByIdAndUpdate(
    req.user._id,
    { cover_images: coverImages.map((coverImage) => coverImage.url) },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover images updated successfully"));
});

module.exports = {
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  changeAvatar,
  changeCoverImages,
};
