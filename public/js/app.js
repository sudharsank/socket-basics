var username = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

//console.log(username + ' wants to join the room ' + room);

$(".room-title").html(room);

socket.on('connect', function() {
	console.log('Connected to the server !!!');

	// Once the User joined the room, it emits the following event
	socket.emit('joinRoom', {
		name: username,
		room: room
	});
});

socket.on('Welcomemessage', function(message) {
	var momentTimeStamp = moment.utc(message.timeStamp);
	var finalTimeStamp = momentTimeStamp.local().format('MMM Do YYYY, h:mm a');
	//console.log('Welcome message: ', message.text);
	var $welcomemessage = $(".welcomeMessage");
	$welcomemessage.append('<p><strong>' + message.name + ' ' + finalTimeStamp + '</strong></p>');
	$welcomemessage.append('<p>' + message.text + '</p>');
	//$(".welcomeMessage").html('<strong>' + finalTimeStamp + ': </strong>' + message.text);
});

socket.on('message', function(message) {
	var momentTimeStamp = moment.utc(message.timeStamp);
	var finalTimeStamp = momentTimeStamp.local().format('h:mm a');
	var $message = $(".messages");

	//console.log('message: ', message.text);

	$message.append('<p><strong>' + message.name + ' ' + finalTimeStamp + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');
	//$(".messages").append('<p><strong>' + finalTimeStamp + ': </strong>' + message.text + '</p>');
});

var $form = jQuery("#frmMessage");

$form.on('submit', function(event) {
	event.preventDefault();
	var $message = $form.find("input[name=inpMessage]")
	socket.emit('message', {
		name: username,
		text: $message.val()
	})
	$message.val('').focus();
});