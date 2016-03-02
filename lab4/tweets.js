
var app = angular.module("myapp", []);

app.controller("mainController", ['$scope', '$http', function($scope, $http)]){


function loadJSON(callback) {
    var url = 'get_tweets.php';

    var q = "";


    $http({
        method: 'GET',
        url: url,
    }).then(function successCallback(response) {
        var tweetsjson = JSON.parse(response);
        console.log(tweetsjson);
        display(tweetsjson["statuses"], 4);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
    /*

    $.ajax({
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        type: "GET",
        async: false,
        url: url,
        dataType: "html",
    }).done(function(msg){
        
        var tweetsjson = JSON.parse(msg);
        console.log(tweetsjson);
        display(tweetsjson["statuses"], 4);

       
    });
*/

}

function buildHashtagString(hashtags){
    var string = "";
    for(i = 0; i < hashtags.length; i++)
    {
        string = string + "#" + hashtags[i]["text"] + " ";
    }
    return string;
}


function changeValues(tweetsjson, outputId, hashtagId, imageId, i){
    document.getElementById(outputId).innerText = tweetsjson[i]["text"]
    document.getElementById(hashtagId).innerText = buildHashtagString(tweetsjson[i]["entities"].hashtags);
    document.getElementById(imageId).src = tweetsjson[i]["user"]["profile_image_url"];
}

function resetAnimation(row){
    row.classList.remove("row");
    row.offsetWidth = row.offsetWidth; // I have no idea why this makes the animation reset but it does
    row.classList.add("row");
}


function display(tweetsjson, i){

    changeValues(tweetsjson, "output5", "hashtag5", "image5", i-4);
    resetAnimation(document.getElementById("row5"));

    changeValues(tweetsjson, "output4", "hashtag4", "image4", i-3);
    resetAnimation(document.getElementById("row4"));

    changeValues(tweetsjson, "output3", "hashtag3", "image3", i-2);
    resetAnimation(document.getElementById("row3"));

    changeValues(tweetsjson, "output2", "hashtag2", "image2", i-1);
    resetAnimation(document.getElementById("row2"));
    
    changeValues(tweetsjson, "output1", "hashtag1", "image1", i);
    resetAnimation(document.getElementById("row1"));
    
    if (i < tweetsjson.length - 1)
    {
        setTimeout(display, 3000, tweetsjson, i+1);
    }
    else
    {
        setTimeout(loadJSON, 3000);
    }


};



var init = function() {
    loadJSON();
    
}();
}



















