const multer = require("multer");
const path = require("path");

const allowedFileTypes = {
  images: /jpeg|jpg|png|gif/,
  audio: /mp3|wav|ogg|mpeg/,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";
    if (allowedFileTypes.images.test(file.mimetype)) {
      folder = "images";
    } else if (allowedFileTypes.audio.test(file.mimetype)) {
      folder = "voice_notes";
    } else {
      return cb(new Error("Invalid file type."));
    }

    const uploadPath = path.join(__dirname, "../../uploads", folder);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    allowedFileTypes.images.test(file.mimetype) ||
    allowedFileTypes.audio.test(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and audio are allowed."),
      false
    );
  }
};
module.exports = {
  storage,
  fileFilter,
};
