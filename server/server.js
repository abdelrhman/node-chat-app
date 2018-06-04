const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '/..', 'public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('new user connected');

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user connected')
  );

  socket.emit('newMessage', generateMessage('Admin', 'Welcom New user'));

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('createMessage', (message, cb) => {
    console.log('Create message', message);
    cb();
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('createLocationMessage', position => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', position.lat, position.lng)
    );
  });
});

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

module.exports = { app };
