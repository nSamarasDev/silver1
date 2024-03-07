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

// @route  POST api/uploads/me
// @desc   Create a new document 
//@access  Private
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");
    console.log
    // Extract file information from request
    const { filename, path: filePath, size } = req.file;

    // Create new document instance
    const newDocument = new Document({
      user,  
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

// @route  GET api/uploads/me
// @desc   Get all of the logged in users documents
//@access  Private
router.get("/me", auth, async (req, res) => {

    try {
      const document = await Document.find({ user: req.user.id }).populate(
        "user",
        ["name", "avatar"]
      );
      console.log(req.user.id)
  
      if (!document) {
        return res.status(400).json({ msg: "There are no documents for this user" });
      }
  
  
      res.json(document);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
