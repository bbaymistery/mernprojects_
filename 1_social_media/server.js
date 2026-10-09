require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { PeerServer } = require('peer');
const SocketServer = require('./socketServer');

// Initialize Database Connection
connectDB();

const app = express();

// Middleware Configuration
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());

// HTTP & Socket.io Server Setup
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Socket.io Connection Event Handler
io.on('connection', socket => {
    SocketServer(socket);
});

// Create PeerJS Server for P2P Video/Audio Calling
PeerServer({ port: 3001, path: '/' });

// API Route Registration
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));

// Server Initialization
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
});