const fs = require("fs/promises");
const { cloudinary_js_config } = require("../config/cloudniary");

exports.uploadSingleFile = async (filePath, folder = "") => {
  try {
    const result = await cloudinary_js_config.uploader.upload(filePath, { folder });
    await fs.unlink(filePath);
    return result.secure_url;
  } catch (error) {
    throw new Error(`Single File Upload Error: ${error.message}`);
  }
};

exports.uploadMultipleFiles = async (files, folder = "") => {
  try {
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary_js_config.uploader.upload(file.path, { folder });
      uploadedUrls.push(result.secure_url);
      await fs.unlink(file.path);
    }
    return uploadedUrls;
  } catch (error) {
    throw new Error(`Multiple File Upload Error: ${error.message}`);
  }
};
