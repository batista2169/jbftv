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
}
var streams = ['https://tv03.zas.media:1936/rftv/rftv/playlist.m3u8','/error.m3u8']	
function isIOS() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var settingsMenu = document.createElement('script');
script.src = isIOS() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);

//video.src=e;
//video.load();
//video.play();

	
	//var bradmaxPlayerConfig = {dataProvider:{source:[{url:e}]},autoplay:true};
	//var element = document.getElementById("settingsMenu");
	//var player = window.bradmax.player.create(element, bradmaxPlayerConfig);

	if(!window.player) {
		window.player = player;
		}
	

	if(window.player && window.bradmax.player) {
		setLink();
	} else {
		window.addEventListener('load', setLink);
		}



