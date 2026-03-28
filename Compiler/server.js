const express = require('express');
const cookieParser=require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config({path: '.env'});

const app=express();
app.use(express.json());

app.use(cookieParser(process.env.CookieSecret));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/compiler',require('./routes/compilerRoutes'))
const PORT=process.env.PORT;
app.listen(PORT,()=>console.log(`Server running on port ${PORT} `));