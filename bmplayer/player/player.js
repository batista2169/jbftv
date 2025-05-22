/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink(e) {	
	var settingsMenu = document.getElementById("settingsMenu");
	var e = window.location.href;
		e = e.split('?source=');
		e = e[1];
		alert(e);
	var url = '["'+ e +'","/error.m3u8"]';
	//url = url[1];
	alert(url);
	var video = document.getElementById('settingsMenu');

 if(Hls.isSupported()) {
      video.volume = 0.3;
      var hls = new Hls();
      var streams = decodeURIComponent(e)
      hls.loadSource(streams);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
      });
      document.title = e
    }
	else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = e;
		video.addEventListener('canplay',function() {
		  video.play();
		});
		video.volume = 0.3;
		document.title = e;
  	}

function isIOS() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var script = document.createElement('script');
script.src = isIOS() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);
	}


	var streams = ["https://tv03.zas.media:1936/rftv/rftv/playlist.m3u8","/error.m3u8"];


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



