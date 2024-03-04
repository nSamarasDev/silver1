const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const Document = require('../../models/Document');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.id;
    const userFolderPath = path.join(__dirname, '..', '..', 'uploads', userId);
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath);
    }
    cb(null, userFolderPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// Init multer upload
const upload = multer({
  storage: storage,
});

// POST route to handle file upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    // Extract file information from request
    const { filename, path: filePath, size } = req.file;

    // Create new document instance
    const newDocument = new Document({
      filename,
      path: filePath,
      size,
      uploadedAt: new Date(),
      article: req.body.articleId,
    });

    // Save document to database
    await newDocument.save();

    res.json({ document: newDocument });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
