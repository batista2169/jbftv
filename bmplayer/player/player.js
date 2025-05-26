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
var p = '/error.m3u8';
	alert(p);

var script = document.createElement('script');
script.src = setLink() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);
//var streams = [e,"/error.m3u8"];
var streams = [e,p];
	

