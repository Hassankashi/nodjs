var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var port = process.env.port || 1337;

var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    
    switch (path) {
        case '/':
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write('hello world');
            response.end();
            break;
        case '/Index.html':
            fs.readFile(__dirname + path, function (error, data) {
                if (error) {
                    response.writeHead(404);
                    response.write("page doesn't exist - 404");
                    response.end();
                }
                else {
                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("page this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(port);



var listener = io.listen(server);
listener.sockets.on('connection', function (socket) {
    //Send Data From Server To Client
    socket.emit('message', { 'message': 'Hello this message is from Server' });
    
    //Receive Data From Client
    socket.on('client_data', function (data) {
        
        socket.emit('message', { 'message': data.letter });
        socket.broadcast.emit('message', { 'message': data.letter });
        process.stdout.write(data.letter);
        console.log(data.letter);
    });
});

