const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // 20MB per file
});

const multiFieldUpload = upload.fields([
  { name: 'reference', maxCount: 1 },
  { name: 'projectLogo', maxCount: 1 },
  {name :'Profileimg', maxCount: 1},
]);

// Wrap upload to catch size errors
const handleUpload = (req, res, next) => {
  multiFieldUpload(req, res, function (err) {
    if (err?.code === 'LIMIT_FILE_SIZE') {
      return res.status(200).json({ msg: 'Files is too large. Max 20MB allowed.' });
    }
    if (err) {
      return res.status(500).json({ msg: 'Upload error', error: err.message });
    }
    next();
  });
};

module.exports = handleUpload;
