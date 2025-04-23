const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket 
const io = require('socket.io')(http);

const users = {}; // To store user names with their socket IDs

io.on('connection', (socket) => {
    console.log('Connected...');

    socket.on('register', (userName) => {
        users[socket.id] = userName;
        io.emit('updateUsers', users);
        console.log(`User registered: ${userName}`);
    });

    socket.on('message', (msg) => {
        // Include sender's ID with the message
        io.emit('message', { ...msg, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${users[socket.id]}`);
        delete users[socket.id];
        io.emit('updateUsers', users);
    });
});