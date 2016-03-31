var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require("socket.io").listen(server);


app.get('/', function (req, res) {
	res.sendFile("index.html", {root :__dirname});
});

