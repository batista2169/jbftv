/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink() {	
	var jb_player = document.getElementById("jb_player");
	var e = window.location.href;
		e = e.split('?source=');
		e = e[1];
		alert(e);

	//var bradmaxPlayerConfig = {dataProvider:{source:[{url:e}]},autoplay:true};
	//var element = document.getElementById("jb_player");
	//var player = window.bradmax.player.create(element, bradmaxPlayerConfig);

	//if(!window.player) {
		//window.player = player;
		//}
	//}

	//if(window.bradmax && window.bradmax.player) {
	//setLink();
	//} else {
		//window.addEventListener('load', setLink);
		//}

var streams = [e,'/error.m3u8'];
var videoContainer=document.getElementById("video-container"),video=document.getElementById("video"),firstStreamAttempted=!1,initialLoad=!0;function loadStream(t){var e;t>=streams.length?console.error("All streams are unavailable"):(e=streams[t],video.src=e,video.load(),video.play(),video.addEventListener("error",function e(){video.removeEventListener("error",e),initialLoad&&!firstStreamAttempted&&(firstStreamAttempted=!0,loadStream(t+1))}),video.addEventListener("loadedmetadata",function e(){video.removeEventListener("loadedmetadata",e),initialLoad=!1}),video.addEventListener("stalled",function e(){video.removeEventListener("stalled",e),loadCurrentStream(t)}))}video.setAttribute("playsinline",""),loadStream(0),video.controls=!0;
	
function isIOS() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var script = document.createElement('script');
script.src = isIOS() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);

	
video.load();
video.play();
}
