/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

//function setLink() {	
	//var settingsMenu = document.getElementById("settingsMenu");
	//var e = window.location.href;
		//e = e.split('?source=');
		//e = e[1];
		//alert(e);
//}
//var streams = ['https://tv03.zas.media:1936/rftv/rftv/playlist.m3u8','/error.m3u8'];
function setLink() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var t = window.location.href;
		t = t.split('?source=');
		t = t[1];
		alert(t);


var script = document.createElement('script');
script.src = setLink() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
var videoContainer=document.getElementById("video-container"),video=document.getElementById("video"),firstStreamAttempted=!1,initialLoad=!0;function loadStream(t){var e;t>=streams.length?console.error("All streams are unavailable"):(e=streams[t],video.src=e,video.load(),video.play(),video.addEventListener("error",function e(){video.removeEventListener("error",e),initialLoad&&!firstStreamAttempted&&(firstStreamAttempted=!0,loadStream(t+1))}),video.addEventListener("loadedmetadata",function e(){video.removeEventListener("loadedmetadata",e),initialLoad=!1}),video.addEventListener("stalled",function e(){video.removeEventListener("stalled",e),loadCurrentStream(t)}))}video.setAttribute("playsinline",""),loadStream(0),video.controls=!0;
document.head.appendChild(script);
	var url = '["'+ t +'","/error.m3u8"];';
var streams = url;
alert(url);
	
	//'https://televisao.tv/js/ios.js' : 
	
	//if (n == "m3u8"){
	//var streams = {
		//src: e,
		//type: 'application/x-mpegURL'
	//};
	//video.src();
	//video.load();
	//video.play();
	

//var streams = ['https://tv03.zas.media:1936/rftv/rftv/playlist.m3u8','/error.m3u8'];
//function isIOS() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
//var script = document.createElement('script');
//script.src = isIOS() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
//document.head.appendChild(script);

	
//var exemplo = "Aprendendo JavaScript na DevMedia!"; ,'/error.m3u8'
//var resultado = exemplo.replace("JavaScript", "PHP");
//console.log(resultado);

	//var url = '["'+ e +'","/error.m3u8"]';
	//url = url[1];
	//alert(url);
	//var video = document.getElementById('streams');
   //video.src = e;
   //video.load()
  // video.play();
	//var streams = ["e","/error.m3u8"];
//var oldstreams = "teste.m3u8";
//var streams = ["teste.m3u8","/error.m3u8"];
//var streams = oldstreams.replace(/teste.m3u8/g, "e");
//alert(streams);


	//var bradmaxPlayerConfig = {dataProvider:{source:[{url:n}]},autoplay:true};
	//var element = document.getElementById("settingsMenu");
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
