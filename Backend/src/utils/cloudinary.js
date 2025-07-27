const v2 = require("cloudinary").v2;
const fs = require("fs");

const cloudnairyconnect = () => {
  try {
    console.log("Cloudinary config check:");
    console.log(
      "CLOUD_NAME:",
      process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT SET"
    );
    console.log("API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET");
    console.log(
      "API_SECRET:",
      process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
    );

    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("CD connected");
  } catch (error) {
    console.log("error connecting CD" + error);
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("Uploading file to Cloudinary:", localFilePath);
    await cloudnairyconnect();
    if (!localFilePath) {
      throw new Error("File path is required");
    }

    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File does not exist: ${localFilePath}`);
    }

    const response = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
      timeout: 30000, // 30 second timeout for Cloudinary upload
    });
    console.log("file is uploaded on cloudinary", response.url);

    // Clean up the temp file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.error("Error uploading file on cloudinary:", error);
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file:", cleanupError);
    }
    return null;
  }
};

module.exports = uploadOnCloudinary;
