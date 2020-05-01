// Base configuration for upload files

const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    const date = moment().format('YYYYMMDD-HHmmss_SSS');
    const fileName = `${date}-${file.originalname}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')) {
    cb(null, true);
  } else {
    cb(null, false)
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5
};


module.exports = multer({ storage, fileFilter, limits });
