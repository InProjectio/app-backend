const path = require('path');
const multer = require('multer');

module.exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.STORAGE_DIR);
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
