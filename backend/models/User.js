// const mongoose=require('mongoose');
// const userSchema=new mongoose.Schema({
//     firstName:{
//         type:String,
//         default:null
//     },
//     lastName:{
//         type:String,
//         default:null
//     },
//     userhandle:{
//         type:String,
//         default:null,
//         required:true,
//         unique:true,
//     },
//     email:{
//         type:String,
//         default:null,
//         required:true,
//         unique:true,
//     },
//     password:{
//         type:String,
//         required:true,
//     },
//     role:{
//         type: String, 
//         enum: ['user', 'admin'], 
//         default: 'user' 
//     },
//     DateTime:{
//         type:Date,
//         default:Date.now,
//         required:true,
//     },
//     TotalSubmissions:{
//         type:Number,
//         default:0,
//     },
//     TotalAccepted:{
//         type:Number,
//         default:0,
//     },
//     imgPath:{
//         type:String,
//         default:"",
//     },
//     Friends:{
//         type:[String],
//         default:[],
//     }
    
// });
// module.exports=mongoose.model("user",userSchema);






// backend/models/User.js
const mongoose = require('mongoose');

const ratingHistorySchema = new mongoose.Schema({
  rating:   { type: Number },
  delta:    { type: Number },
  opponent: { type: String },
  result:   { type: String, enum: ['win', 'loss', 'draw'] },
  roomId:   { type: String },
  date:     { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName:        { type: String,   default: null },
  lastName:         { type: String,   default: null },
  userhandle:       { type: String,   default: null, required: true, unique: true },
  email:            { type: String,   default: null, required: true, unique: true },
  password:         { type: String,   required: true },
  role:             { type: String,   enum: ['user', 'admin'], default: 'user' },
  DateTime:         { type: Date,     default: Date.now, required: true },
  TotalSubmissions: { type: Number,   default: 0 },
  TotalAccepted:    { type: Number,   default: 0 },
  imgPath:          { type: String,   default: '' },
  Friends:          { type: [String], default: [] },

  // ── Rating (starts at 0 = Bronze) ──
  rating: { type: Number, default: 0 },
// Only change the badge default section:

badge: {
  name:    { type: String, default: 'Bronze' },
  emoji:   { type: String, default: '🪨' },      // ← changed
  color:   { type: String, default: '#cd7f32' },
  imgPath: { type: String, default: '/badges/bronze.jpg' }, // ← NEW
},

  // ── Battle stats ──
  battleStats: {
    wins:         { type: Number, default: 0 },
    losses:       { type: Number, default: 0 },
    draws:        { type: Number, default: 0 },
    totalBattles: { type: Number, default: 0 },
  },

  // ── Rating history (last 50) ──
  ratingHistory: { type: [ratingHistorySchema], default: [] },
});

module.exports = mongoose.model('user', userSchema);