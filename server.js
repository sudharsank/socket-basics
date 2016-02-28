var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('User connected using socket.io!');

	socket.on('message', function(Message){
		console.log('Message Received: ', Message.text);

		// Broadcast message to all connected user including the sender.
		//io.emit('message', Message);

		// Brodcast message to all connected user excluding the sender.
		socket.broadcast.emit('message', Message);
	});

	socket.emit('message', {
		text: 'Welcome to Chat application !!!'
	})
});

http.listen(PORT, function() {
	console.log('Server Started!');
});