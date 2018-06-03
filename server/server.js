const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/..', 'public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('new user connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('createMessage', message => {
    console.log('Create message', message);
  });

  socket.emit('newMessage', {
    from: 'Podo',
    text: 'Hello World',
    createdAt: 123456
  });
});

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

module.exports = { app };
