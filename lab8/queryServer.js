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
		console.log(data);

		// build query string
		var queryString = "PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> ";
		queryString += "PREFIX dbpedia: <http://dbpedia.org/resource/> ";
		queryString += "PREFIX dct: <http://purl.org/dc/terms/> ";
		queryString += "SELECT DISTINCT ";
		queryString += data.subject;
		queryString += " WHERE{";
		queryString += " { " + data.var1 + " } ";
		queryString += " { " + data.var2 + " } ";
		queryString += " { " + data.var3 + " } ";
		queryString += "} LIMIT 10";


		// format string as a URI
		var q = encodeURI(queryString);
		console.log(q);

		// fetch data from dbpedia
		http.get({
			host: 'dbpedia.org',
			path: '/sparql?query=' + q,
		}, function(response){
			var body = "";
			response.on('data', function(data){
				body += data;
			});
			response.on('end', function(){
				// change xml to JSON
				parseString(body, function(err, result){
					console.log(result);
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





