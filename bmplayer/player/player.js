/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var n = window.location.href;
		n = n.split('?source=');
		n = n[1];
		alert(n);
var script = document.createElement('script');
script.src = setLink() ? 'https://televisao.tv/js/ios.js' : 'https://televisao.tv/js/hls.js';
document.head.appendChild(script);
var streams = [n];
	//var streams = ["teste.m3u8","/error.m3u8"];
