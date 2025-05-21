/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink() {	
	var script = document.getElementById("script");
	var e = window.location.href;
		e = e.split('?source=');
		e = e[1];
		alert(e);

var streams = ['e','/error.m3u8']	
function isIOS() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var script = document.createElement('script');
script.src = isIOS() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);
streams.load();
streams.play();
	
	//var bradmaxPlayerConfig = {dataProvider:{source:[{url:e}]},autoplay:true};
	//var element = document.getElementById("script");
	//var player = window.bradmax.player.create(element, bradmaxPlayerConfig);

	if(!window.player) {
		window.player = player;
		}
	}

	//if(window.bradmax && window.bradmax.player) {
		//setLink();
	//} else {
		//window.addEventListener('load', setLink);
		//}



