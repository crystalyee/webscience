Please run tweetServer.js

The hardest part about the lab was dealing with asyncronus behavior while interacting with mongo. It was difficult making sure that my functions didn't launch before they had access to the tweets they needed. If mongo responded syncronously it'd be a lot easier to work with, but the asyncronus behavior did lead me to parallelize things more than I wanted to which was probably the point.
