const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const { generateMessage, generateLocationMessage } = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '/..', 'public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('new user connected');


  socket.on('disconnect', () => {
    console.log('User was disconnected');
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("updateUsersList", users.getUsersList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} Left the room`));
    }
  });

  socket.on('join', (params, callback) => {


    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name is required. ')
    }else{
      socket.join(params.room)
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit('updateUsersList', users.getUsersList(params.room))
      socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} connected`));
      socket.emit('newMessage', generateMessage('Admin', `Welcom ${params.name}`));

      callback();
    }



  });

  socket.on('createMessage', (message, cb) => {

    var user =  users.getUser(socket.id);
    if (user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    cb();

  });

  socket.on('createLocationMessage', position => {

    var user =  users.getUser(socket.id);

    io.to(user.room).emit(
      'newLocationMessage',
      generateLocationMessage(user.name, position.lat, position.lng)
    );
  });
});

server.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

module.exports = { app };
