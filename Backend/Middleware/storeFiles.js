const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setting up multer storage to keep files in memory
const storage = multer.memoryStorage();  // Use memory storage instead of disk storage

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,  // 10MB
  },
});

module.exports = upload;
