var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

// To use the current user info on the message event.
var clientInfo = {};

io.on('connection', function(socket) {
	console.log('User connected using socket.io!');

	socket.on('joinRoom', function(req) {
		console.log('Joined the room: ', req.name + ' - ' + req.room);
		clientInfo[socket.id] = req;
		// Builtin method to add this socket to the room
		socket.join(req.room);
		// To send the message to everyone in the room that the new person has joined the room.		
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined !!!',
			timeStamp: moment().valueOf()
		});
	});

	socket.on('message', function(Message) {
		console.log('Message Received: ', Message);

		// Broadcast message to all connected user including the sender.
		Message.timeStamp = moment().valueOf();
		//io.emit('message', Message);
		// to broadcast message to all in the room.
		io.to(clientInfo[socket.id].room).emit('message', Message);

		// Brodcast message to all connected user excluding the sender.
		//socket.broadcast.emit('message', Message);
	});

	socket.emit('Welcomemessage', {
		name: 'System',
		text: 'Welcome to Chat application !!!',
		timeStamp: moment().valueOf()
	})
});

http.listen(PORT, function() {
	console.log('Server Started!');
});