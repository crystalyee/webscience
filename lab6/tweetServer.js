var express = require('express');
var Twitter = require('twitter');
var fs = require('fs');
var app = express();
var server = app.listen(3000);
var io = require("socket.io").listen(server);


console.log("app listening on port 3000");

var twitStream = new Twitter({
  consumer_key: 'fhulNPA0RwVxpjHbEUIyuUEb9',
  consumer_secret: 'KgXESeGvHPC8xHp8XJL5iuhqeQ5ivcqE24XM3WKUUR5gsH8ynH',
  access_token_key: '704820662293164032-cJ6X0YPvAjzstdQrahYNaAXDvuIZ7Ip',
  access_token_secret: 'cacTiszVJiUuLGPYmYZyFSdwTztv44GNw0Yn6w8ksg5oT'
});


io.sockets.on("connection", function(client){
	client.on("message", function(data){

		
		var searchTerm = data.search;
		var locations = [];

		// If there's no query default to rpi
		if (searchTerm == undefined){
			searchTerm = "";
			locations = [-73.68,42.72,-73.67,42.73];
		}
		
		twitStream.stream("statuses/filter", {track: searchTerm, locations:locations}, function(stream){
				stream.on("data", function(tweet){

					// sends tweet to client
					client.emit("tweet", tweet);		
				});
				stream.on('error', function(error) {
					client.emit("tweeterror", {message:error});	
			  	});

				// destorys stream with input from client
			  	client.on("stop", function(data){
					stream.destroy();
				});
			});
		console.log("search term:", searchTerm);
	})

	client.on("export", function(data){
		console.log("Exporting tweets as a ", data.filetype, " file");
		if (data.filetype == "JSON"){
			fs.writeFile("ITWS4500-S16-yeec2-tweets.json", data.text);
			client.emit("export", {message:"Tweets exported as JSON file"});	
		}
		if (data.filetype == "CSV"){
			fs.writeFile("ITWS4500-S16-yeec2-tweets.csv", data.text);
			client.emit("export", {message:"Tweets exported as CSV file"});	
		}
	})


});


app.use("/", express.static(__dirname));


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/tweets.html');
});





