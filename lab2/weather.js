function getLocation() {
    if (navigator.geolocation != null) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } 
}

function toFarenheit(kelvin){
    return Math.round( (kelvin - 273) * 9 / 5 + 32);
}

function convertDate(timestamp)
{
    var date = new Date(timestamp * 1000);
    return date.toDateString();
}

function changeValues(weatherjson, dateId, temperatureId, iconId, i)
{
    var url = "http://openweathermap.org/img/w/" + weatherjson.list[i].weather[0].icon + ".png";
    document.getElementById(iconId).src = url;
    document.getElementById(dateId).innerHTML = convertDate(weatherjson.list[i].dt); 
    document.getElementById(temperatureId).innerHTML = toFarenheit(weatherjson.list[i].temp.day) + " °F";
    
}

function resetAnimation(id){
    var panel = document.getElementById(id);
    panel.classList.remove("panel-body");
    panel.offsetWidth = panel.offsetWidth; // I have no idea why this makes the animation reset but it does
    panel.classList.add("panel-body");
}

function moveValues(dateIdOld, temperatureIdOld, iconIdOld, dateIdNew, temperatureIdNew, iconIdNew)
{
    document.getElementById(dateIdNew).innerHTML = document.getElementById(dateIdOld).innerHTML;
    document.getElementById(temperatureIdNew).innerHTML = document.getElementById(temperatureIdOld).innerHTML;
    document.getElementById(iconIdNew).src = document.getElementById(iconIdOld).src; 
}

function display(weatherjson, i)
{
    
    moveValues("date3", "temperature3", "icon3", "date4", "temperature4", "icon4");
    moveValues("date2", "temperature2", "icon2", "date3", "temperature3", "icon3");
    moveValues("date1", "temperature1", "icon1", "date2", "temperature2", "icon2");
    changeValues(weatherjson, "date1", "temperature1", "icon1", i);
    resetAnimation("4");
    resetAnimation("3");
    resetAnimation("2");
    resetAnimation("1");

    if(i+1 < weatherjson.list.length)
    {
        setTimeout(display, 3000, weatherjson, i+1);
    }
    else
    {
        setTimeout(display, 3000, weatherjson, 1);
    }
}



function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var key = "f57fdb7f3621c20f8a94cefb38347c9a";
    
    var url = "http://api.openweathermap.org/data/2.5/forecast/daily?APPID=" + key + "&lat=" + latitude + "&lon=" + longitude;

    
    $.ajax({
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        type: "GET",
        async: false,
        url: url,
        dataType: "jsonp",
    }).done(function(msg){
        console.log(msg);
        
       
    });

   

}


var init = function() {
    getLocation();

}();
