var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser');

io.on('connection', function() {
	io.sockets.emit('register');
});

// Accept URL-encoded body in POST request.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

// Forward task results to the clients.
app.post('/notify', function(request, response) {
    io.sockets.emit('notify', request.body.result);
	response.type('application/json');
    response.send('Result broadcast to client.');
});

server.listen(3000);