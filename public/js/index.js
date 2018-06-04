var socket = io();

socket.on('connect', function() {
  console.log('connected to server');
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('new message', message);

  var formattedTime = moment(message.createdAt).format('h: mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

});

socket.on('newLocationMessage', function(message) {

  var formattedTime = moment(message.createdAt).format('h: mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    createdAt: formattedTime,
    from: message.from,
    url: message.url
  });
  jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextBox.val()
    },
    function() {
      messageTextBox.val('');
    }
  );
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported in your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location ...');

  navigator.geolocation.getCurrentPosition(
    function(position) {
      console.log(position);
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    },
    function() {
      alert('unable to fetech your location ');
      locationButton.removeAttr('disabled').text('Send location');
    }
  );
});
