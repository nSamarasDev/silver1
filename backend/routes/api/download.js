const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const fs = require('fs');
const Document = require('../../models/Document');

// @route  GET api/downloads/:id
// @desc   Download a document 
//@access  Private (or Private depending on your requirements)
router.get('/:id', auth, async (req, res) => {
  try {
    // Find the document by ID
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Check if the file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ msg: 'File not found' });
    }

    // Serve the file
    res.download(document.path, document.filename);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
