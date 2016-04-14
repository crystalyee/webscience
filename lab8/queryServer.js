var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require("socket.io").listen(server);
var http = require('http');
var parseString = require('xml2js').parseString;


console.log("app listening on port 3000");


io.sockets.on("connection", function(client){
	client.on("query", function(data){
		console.log("A message was sent.");

		http.get({
			host: 'dbpedia.org',
			path: '/sparql?query=SELECT+DISTINCT+?concept+WHERE+{+?s+a+?concept+}+LIMIT+10',
		}, function(response){
			var body = "";
			response.on('data', function(data){
				body += data;
			});
			response.on('end', function(){
				parseString(body, function(err, result){
					client.emit('result', result);
				});
			});
		});
		

	})

	


});


app.use("/", express.static(__dirname));


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/query.html');
});





