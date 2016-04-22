var express = require('express');
var Twitter = require('twitter');
var fs = require('fs');
var app = express();
var server = app.listen(3000);
var MongoClient = require('mongodb').MongoClient;
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
		if (data.filetype == "XML"){
			if (data.filename == ""){
				data.filename = "ITWS4500-S16-yeec2-tweets";
			}
			var name = data.filename + ".xml";
			fs.writeFile(name, data.text);
			client.emit("export", {message:"Tweets loaded from database exported as XML file"});	
		}
	})

	client.on("buildDatabase", function(data){
		MongoClient.connect('mongodb://localhost:27017/tweets', function(err, db){
			if (err){
				throw err;
			}
			console.log("Connected to database");
			db.createCollection("tweets", {});
			for (t in data.tweetList){
				db.collection("tweets").insertOne(data.tweetList[t]);	
				client.emit("databaseBuilt", {});
			}
		})
		
	})

	client.on("clearDatabase", function(data){
		MongoClient.connect('mongodb://localhost:27017/tweets', function(err, db){
			if (err){
				throw err;
			}
			console.log("Connected to database");
			db.collection("tweets").drop();
			client.emit("databaseCleared", {});
		})
		
	})

	client.on("getDatabase", function(data){
	
		MongoClient.connect('mongodb://localhost:27017/tweets', function(err, db){
			if (err){
				throw err;
			}
			console.log("Connected to database");	
			
			var cursor = db.collection("tweets").find();
			cursor.each(function(err, doc){
				if (doc != null){
					if (data.user == "display"){
						client.emit("displayTweets", doc);
					}
					if (data.user == "XML"){
						client.emit("XMLTweets", doc);
					}
				}
			});
			
			client.emit("databaseEmpty", {});

			
		})
		
		
	})


});


app.use("/", express.static(__dirname));


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/tweets.html');
});





