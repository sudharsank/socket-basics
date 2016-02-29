var socket = io();

socket.on('connect', function() {
	console.log('Connected to the server !!!');
});

socket.on('Welcomemessage', function(message) {
	console.log('Welcome message: ', message.text);
	$(".welcomeMessage").html(message.text);
});

socket.on('message', function(message) {
	console.log('message: ', message.text);
	$(".messages").append('<p>' + message.text + '</p>');
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