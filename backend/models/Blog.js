// backend/models/Blog.js
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  authorHandle: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  likes: {
    type: [String],   // array of userhandles
    default: [],
  },
  dislikes: {
    type: [String],   // array of userhandles
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for fast queries
BlogSchema.index({ authorHandle: 1, createdAt: -1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', BlogSchema);