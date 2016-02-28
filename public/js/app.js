var socket = io();

socket.on('connect', function() {
	console.log('Connected to the server !!!');
});

socket.on('message', function(message) {
	console.log('New message: ', message.text);
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