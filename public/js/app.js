var socket = io();

socket.on('connect', function() {
	console.log('Connected to the server !!!');
});

socket.on('Welcomemessage', function(message) {
	var momentTimeStamp = moment.utc(message.timeStamp);
	var finalTimeStamp = momentTimeStamp.local().format('MMM Do YYYY, h:mm a');
	console.log('Welcome message: ', message.text);
	$(".welcomeMessage").html('<strong>'+finalTimeStamp+': </strong>' + message.text);
});

socket.on('message', function(message) {
	var momentTimeStamp = moment.utc(message.timeStamp);
	var finalTimeStamp = momentTimeStamp.local().format('h:mm a');
	console.log('message: ', message.text);
	$(".messages").append('<p><strong>' + finalTimeStamp + ': </strong>' + message.text + '</p>');
});

var $form = jQuery("#frmMessage");

$form.on('submit', function(event){
	event.preventDefault();
	var $message = $form.find("input[name=inpMessage]")
	socket.emit('message', {
		text: $message.val()		
	})
	$message.val('').focus();
});