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
function setLink() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var script = document.createElement('script');
script.src = setLink() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);
	
	
	
	
	//if (n == "m3u8"){
	//var streams = {
		//src: e,
		//type: 'application/x-mpegURL'
	//};
	//video.src();
	//video.load();
	//video.play();
	}

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
