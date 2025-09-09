var player;
let realID;

$(document).ready(function() {
  var channelID = "UCDi4O5YlOnl4E2AFDZLPU_A";
  $.getJSON('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D'+channelID, function(data) {
  var link = data.items[0].link;
  var id = link.substr(link.indexOf("=")+1);
  realID = id;
  $("#youtube_video").attr("src","https://youtube.com/embed/"+id + "?autoplay=1&controls=0&showinfo=0&rel=0");
  });
})
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: realID, // Replace with your YouTube video ID
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'loop': 1,
      'playlist': realID // Crucial: Set playlist to the same video ID for looping
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  // Optional: Handle player state changes if needed
}
