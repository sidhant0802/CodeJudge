const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const cors = require('cors');
const path = require('path');
// Load environment variables
dotenv.config({path: '.env'});
// Initialize Express
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser(process.env.CookieSecret));
app.use(cors({
  // origin: `${process.env.INSTANCE_IP}:5173`,
  origin: "http://localhost:5173",
  // origin: `http://localhost:5173`,

  // origin: 'https://online-judge-project-one.vercel.app',
  credentials: true,
}));
