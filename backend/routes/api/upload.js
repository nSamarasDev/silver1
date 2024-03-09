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
    const userDocumentsFolderPath = path.join(__dirname, '..', '..', 'uploads', 'documents', userId);
    try {
      fs.mkdirSync(userDocumentsFolderPath, { recursive: true });
      cb(null, userDocumentsFolderPath);
    } catch (err) {
      console.error('Error creating directory:', err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
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
    console.log(req.file)
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
    //   console.log(req.user.id)

      const count = document.length
  
      if (!document) {
        return res.status(400).json({ msg: "There are no documents for this user" });
      }
  
  
      res.json({ count, document });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

// @route  GET api/uploads
// @desc   Get all documents from all users
//@access  Private
router.get("/", auth, async (req, res) => {
    try {
      
      const documents = await Document.find().sort({ date: -1 }); // -1 is most recent date first
      const count = documents.length
      
      res.json({ count, documents });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

// @route    GET api/uploads/:userId/user-documents
// @desc     Get documents created by a specific user
// @access   Private
router.get("/:user_id/user-documents", auth, async (req, res) => {
    try {
      const documents = await Document.find({ user: req.params.user_id });
      const count = documents.length
      if (!documents) {
        return res.status(404).json({ message: "No documents found" });
      }
      res.json({ count,  documents });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// @route    GET api/uploads/:id
// @desc     Get documents by document :_id
// @access   Private
router.get("/:id", auth, async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
  
      if (!document) {
        return res.status(404).json({ msg: "Document not found" });
      }
  
      res.json(document);
    } catch (error) {
      console.error(error.message);
  
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Document not found" });
      }
  
      res.status(500).send("Server Error");
    }
  });

// @route    DELETE api/uploads/:id
// @desc     Delete Document by document :_id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
  
      console.log(document); // add this line to log the post variable
  
      if (!document) {
        return res.status(404).json({ msg: "Document not found" });
      }
  
      // Check if logged in user matches user of the post
      if (document.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }
  
      await document.deleteOne();
  
      res.json({ msg: "Document removed" });
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Article not found" });
      }
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
