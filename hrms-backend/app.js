const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authRoutes');



const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin',require('./routes/adminRoutes'));
app.use('/api/user',require('./routes/userRoutes'))
app.use('/api',require('./routes/commonRoutes'))
module.exports = app;