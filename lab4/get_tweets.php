<?php
require_once('TwitterAPIExchange.php');

$settings = array(
	/*
    'oauth_access_token' => '47282406-UyxyVM0rkAwuti3YpgwLGyi84Yh8KXxKOv4mQ6Xhv',
    'oauth_access_token_secret' => 'DLEtDS9DFGpPUVG1SVC5A4J15iTd8VPZ68HmOU3BJmtGx',
    'consumer_key' => 'luI2jnjp3GOuyqKuWsSKIFstD',
    'consumer_secret' => 'HvEmsAiI8M5TE972F081eBgZDLR8pJnTg2UFdqXs7SC3WpzehT'
    */
    
    'oauth_access_token' => '704820662293164032-cJ6X0YPvAjzstdQrahYNaAXDvuIZ7Ip',
    'oauth_access_token_secret' => 'cacTiszVJiUuLGPYmYZyFSdwTztv44GNw0Yn6w8ksg5oT',
    'consumer_key' => 'fhulNPA0RwVxpjHbEUIyuUEb9',
    'consumer_secret' => 'KgXESeGvHPC8xHp8XJL5iuhqeQ5ivcqE24XM3WKUUR5gsH8ynH'
    
);

$url = "https://api.twitter.com/1.1/search/tweets.json";
$requestMethod = "GET";

$query = '?q=';
if(isset($_GET['q']) && $_GET['q']!='' ) {

    $query .= $_GET['q'];

} else {
    $query .= 'something';
}

//echo $query;
$twitter = new TwitterAPIExchange($settings);
$results = $twitter->setGetfield($query)->buildOauth($url, $requestMethod)->performRequest();
echo $results;
?>
