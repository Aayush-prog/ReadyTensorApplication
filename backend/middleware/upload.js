const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder =
      file.fieldname === "image" ? "public/profile-pictures" : "public/resumes";
    cb(null, folder); // Ensure these directories exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create multer instance with storage
const upload = multer({ storage: storage });

// Middleware for handling profile picture and CV uploads
const uploadMiddleware = (req, res, next) => {
  const uploadFields = upload.fields([
    { name: "image", maxCount: 1 }, // Single profile picture
    { name: "resume", maxCount: 1 }, // Single CV
  ]);

  uploadFields(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res
        .status(400)
        .json({ status: "failed", msg: "File upload error: " + err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({
        status: "failed",
        msg: "Unknown error occurred: " + err.message,
      });
    }

    // Proceed to the next middleware even if one file is missing
    next();
  });
};

module.exports = uploadMiddleware;
