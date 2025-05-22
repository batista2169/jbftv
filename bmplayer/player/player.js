/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink() {	
	var settingsMenu = document.getElementById("settingsMenu");
	var e = window.location.href;
		e = e.split('?source=');
		e = e[1];
		alert(e);

var streams = ['https://tv03.zas.media:1936/rftv/rftv/playlist.m3u8','/error.m3u8'];
	}
function isIOS() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var script = document.createElement('script');
script.src = isIOS() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);

//var video = document.getElementById('settingsMenu');

//function setLink(url){
 // if(Hls.isSupported()) {
   //   video.volume = 0.3;
    //  var hls = new Hls();
     // var m3u8Url = decodeURIComponent(url)
    //  hls.loadSource(m3u8Url);
     // hls.attachMedia(video);
     // hls.on(Hls.Events.MANIFEST_PARSED,function() {
     //   video.play();
     // });
    //  document.title = url
  //  }
	//else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		//video.src = url;
		//video.addEventListener('canplay',function() {
		//  video.play();
		//});
		//video.volume = 0.3;
		//document.title = url;
  	//}
//}

//function playPause() {
 //   video.paused?video.play():video.pause();
//}

//function volumeUp() {
  //  if(video.volume <= 0.9) video.volume+=0.1;
//}

//function volumeDown() {
//    if(video.volume >= 0.1) video.volume-=0.1;
//}

//function seekRight() {
//    video.currentTime+=5;
//}

//function seekLeft() {
//    video.currentTime-=5;
//}

//function vidFullscreen() {
 //   if (video.requestFullscreen) {
  //    video.requestFullscreen();
 // } else if (video.mozRequestFullScreen) {
  //    video.mozRequestFullScreen();
 // } else if (video.webkitRequestFullscreen) {
  //    video.webkitRequestFullscreen();
  //  }
//}

setLink(window.location.href.split("?source=")[1])
$(window).on('load', function () {
    $('#video').on('click', function(){this.paused?this.play():this.pause();});
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('f', vidFullscreen);
});




	
	//var bradmaxPlayerConfig = {dataProvider:{source:[{url:e}]},autoplay:true};
	//var element = document.getElementById("settingsMenu");
	//var player = window.bradmax.player.create(element, bradmaxPlayerConfig);

	//if(!window.player) {
		//window.player = player;
		//}
	

	//if(window.player && window.bradmax.player) {
		//setLink();
	//} else {
		//window.addEventListener('load', setLink);
		//}



