// backend/models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  authorHandle: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast lookup by blog
CommentSchema.index({ blogId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);