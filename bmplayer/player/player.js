/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var e = window.location.href;
		e = e.split('?source=');
		e = e[1];
		alert(e);
var n = '?","/error.m3u8';
alert(e);
var p = e + n;
alert(p);
var script = document.createElement('script');
script.src = setLink() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);
var streams = [e];
	//var streams = ["teste.m3u8","/error.m3u8"];

