const express      = require('express');
const http         = require('http');
const { initSocket } = require('./socket');
const mongoose     = require('mongoose');
const dotenv       = require('dotenv');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const path         = require('path');

dotenv.config({ path: '.env' });

// ── Create app & server ──
const app    = express();
const server = http.createServer(app);

// ── Middleware ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser(process.env.CookieSecret));
app.use(cors({
  origin: [
    process.env.INSTANCE_IP  || 'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// ── MongoDB ──
mongoose.connect(process.env.MONGO_URI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// ── Socket.IO ──
initSocket(server);

// ── Routes ──
app.use('/api/example',     require('./routes/auth_routes'));
app.use('/api/problems',    require('./routes/problemRoutes'));
app.use('/api/tests',       require('./routes/testCaseRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/compiler',    require('./routes/compilerRoutes'));
app.use('/api/savedcode',   require('./routes/savedcode'));
app.use('/api/blogs',       require('./routes/blogRoutes'));
app.use('/api/comments',    require('./routes/commentRoutes'));
app.use('/api/battle',      require('./routes/battleRoutes'));

// ── Start Server ──
const PORT = process.env.PORT || 5010;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend allowed: ${process.env.INSTANCE_IP}`);
});