const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    uploadedAt: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }
})

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;