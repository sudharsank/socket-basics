var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

// To use the current user info on the message event.
var clientInfo = {};

// sends current users to provided socket
function sendCurrentUsers(socket) {
	// Current user info
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	// It takes object and return all the attributes as an array
	Object.keys(clientInfo).forEach(function(socketID){
		var userInfo = clientInfo[socketID];
		if(info.room === userInfo.room)
			users.push(userInfo.name);
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current Users: ' + users.join(', '), // This will join all the arrays with ', '
		timeStamp: moment().valueOf()
	})
}

io.on('connection', function(socket) {
	console.log('User connected using socket.io!');

	// Once the user left the room the message wil be sent to all the users.
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		console.log('Left the room: ', userData.name + ' - ' + userData.room);
		// To remove the user binding from the room
		socket.leave(userData.room);
		io.to(userData.room).emit('message', {
			name: 'System',
			text: userData.name + ' has left !!!',
			timeStamp: moment().valueOf()
		});
		delete clientInfo[socket.id];
	});

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

		if (Message.text === "@currentusers") {
			sendCurrentUsers(socket);
		} else {
			// Broadcast message to all connected user including the sender.
			Message.timeStamp = moment().valueOf();
			//io.emit('message', Message);
			// to broadcast message to all in the room.
			io.to(clientInfo[socket.id].room).emit('message', Message);

			// Brodcast message to all connected user excluding the sender.
			//socket.broadcast.emit('message', Message);	
		}
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