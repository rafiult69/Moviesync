const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let usersCount = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
    usersCount++;
    io.emit('users-count', usersCount);

    socket.on('disconnect', () => {
        usersCount--;
        io.emit('users-count', usersCount);
    });

    socket.on('chat', (msg) => {
        io.emit('chat', msg);
    });

    socket.on('video-change', (url) => {
        io.emit('video-change', url);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));