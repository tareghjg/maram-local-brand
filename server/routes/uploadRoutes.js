const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    if (
      file &&
      file.mimetype &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed."
        )
      );
    }
  },
});

const uploadImage = (file) => {
  return new Promise(
    (resolve, reject) => {
      if (!file || !file.buffer) {
        return reject(
          new Error("Invalid image file.")
        );
      }

      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder: "maram/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        );

      stream.on("error", (error) => {
        reject(error);
      });

      stream.end(file.buffer);
    }
  );
};

router.post("/", (req, res) => {
  console.log(
    "UPLOAD REQUEST RECEIVED"
  );

  console.log(
    "Content-Type:",
    req.headers["content-type"]
  );

  console.log(
    "User-Agent:",
    req.headers["user-agent"]
  );

  upload.single("images")(
    req,
    res,
    async (uploadError) => {
      if (uploadError) {
        console.error(
          "Multer upload error:",
          uploadError.message
        );

        return res.status(400).json({
          success: false,
          message:
            uploadError.message ||
            "Image upload failed.",
        });
      }

      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message:
              "Please select an image.",
          });
        }

        console.log(
          "FILE RECEIVED:",
          req.file.originalname
        );

        console.log(
          "FILE TYPE:",
          req.file.mimetype
        );

        console.log(
          "FILE SIZE:",
          req.file.size
        );

        const result =
          await uploadImage(
            req.file
          );

        if (
          !result ||
          !result.secure_url
        ) {
          throw new Error(
            "Cloudinary did not return an image URL."
          );
        }

        console.log(
          "CLOUDINARY UPLOAD SUCCESS"
        );

        res.status(201).json({
          success: true,

          message:
            "Image uploaded successfully.",

          images: [
            result.secure_url,
          ],

          publicIds: [
            result.public_id,
          ],

          imageUrl:
            result.secure_url,
        });
      } catch (error) {
        console.error(
          "Cloudinary upload error:",
          error.message
        );

        res.status(500).json({
          success: false,
          message:
            "Something went wrong while uploading the image.",
        });
      }
    }
  );
});

module.exports = router;