// backend/server.js — CORRECT ORDER

const express      = require('express');
const mongoose     = require('mongoose');
const dotenv       = require('dotenv');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const path         = require('path');

dotenv.config({ path: '.env' });

// ── app MUST be created first ──
const app = express();

// ── Middleware ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser(process.env.CookieSecret));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ── MongoDB ──
mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// ── All Routes (AFTER app is defined) ──
app.use('/api/example',     require('./routes/auth_routes'));
app.use('/api/problems',    require('./routes/problemRoutes'));
app.use('/api/tests',       require('./routes/testCaseRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/compiler',    require('./routes/compilerRoutes'));
app.use('/api/savedcode',   require('./routes/savedcode'));

// ── Blog Routes (ADD HERE — after app is defined) ──
app.use('/api/blogs',    require('./routes/blogRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// ── Start Server ──
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));