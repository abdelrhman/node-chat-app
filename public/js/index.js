var socket = io();

socket.on('connect', function() {
  console.log('connected to server');

  socket.emit('create_email');

  socket.emit('createMessage', {
    from: 'Ali',
    text: 'This is a new message'
  });
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('new message', message);
});
