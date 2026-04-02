const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userhandle:     { type: String,  default: null },
  socketId:       { type: String,  default: null },
  isReady:        { type: Boolean, default: false },
  hasSubmitted:   { type: Boolean, default: false },
  submissionTime: { type: Number,  default: null  },
  status:         { type: String,  default: null  },
}, { _id: false });

const ratingChangeSchema = new mongoose.Schema({
  oldRating: { type: Number },
  newRating: { type: Number },
  delta:     { type: Number },
  badge:     { type: String },
}, { _id: false });

const battleSchema = new mongoose.Schema({
  roomId:     { type: String, required: true, unique: true },
  password:   { type: String, default: null  },
  difficulty: { type: String, default: 'Random' },
  duration:   { type: Number, default: 30 },

  // ✅ Added 'finishing' as atomic lock state
  status: {
    type: String,
    enum: ['waiting', 'ready', 'ongoing', 'finishing', 'finished'],
    default: 'waiting',
  },

  creator:    { type: playerSchema, default: () => ({}) },
  opponent:   { type: playerSchema, default: () => ({}) },
  problemPID: { type: String,  default: null },
  winner:     { type: String,  default: null },
  startTime:  { type: Date,    default: null },
  endTime:    { type: Date,    default: null },

  ratingChanges: {
    creator:  { type: ratingChangeSchema, default: null },
    opponent: { type: ratingChangeSchema, default: null },
  },
}, { timestamps: true });

module.exports = mongoose.model('Battle', battleSchema);