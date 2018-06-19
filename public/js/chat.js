var socket = io();

function scrollToBottom (){
  //Selectors
  var messages = jQuery('#messages')
  var newMessage= messages.children('li:last-child')
  //Heights
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight)
  }

}

socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search)
  socket.emit('join', params, function (err) {
    if (err) {
      window.location.href = '/';
      alert(err);
    }else {
      console.log('no error');
    }
  });

});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('updateUsersList', function (users){
  console.log(users);
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
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
  scrollToBottom();

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
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit(
    'createMessage',
    {
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
