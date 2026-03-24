// backend/models/SavedCode.js
const mongoose = require('mongoose');

const SavedCodeSchema = new mongoose.Schema({
  userhandle: { 
    type: String, 
    required: true 
  },
  PID: { 
    type: String, 
    required: true 
  },
  language: { 
    type: String, 
    required: true, 
    enum: ['cpp', 'c', 'py'] 
  },
  code: { 
    type: String, 
    default: '' 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Compound index — fast lookup + enforces one save per user+problem+language
SavedCodeSchema.index(
  { userhandle: 1, PID: 1, language: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('SavedCode', SavedCodeSchema);