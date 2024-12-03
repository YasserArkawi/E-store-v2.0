const multer = require("multer");
const path = require("path");
function multerUpload(destenation) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destenation);
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      let allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "video/mp4",
        "video/m4a",
      ];
      console.log(req.url);
      if (req.originalUrl.includes("/store/ad")) {
        allowedTypes.push("video/mp4");
        allowedTypes.push("video/m4a");
      }
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Not allowed file type."));
      }
      cb(null, true);
      allowedTypes.filter((element) => {
        return !element === "video/mp4" || !element === "video/m4a"
          ? element
          : null;
      });
    },
  });
  return upload;
}

module.exports = multerUpload;
