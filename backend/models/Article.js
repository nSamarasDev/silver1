const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  citations: {
    type: [String],
    required: true,
  },
  documents: [
    { type: Schema.Types.ObjectId, 
      ref: 'Document' }
    ], // Modified field to accept an array of ObjectIds
  author: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("article", ArticleSchema);
