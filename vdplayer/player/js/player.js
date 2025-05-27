/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

function setLink() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var url = window.location.href;
	url = url.split('?source=');
	url = url[1];
	//alert(url);
var e = '/error.m3u8';
	//alert(e);

var script = document.createElement('script');
script.src = setLink() ? '/ios.js' : '/hls.js';
document.head.appendChild(script);
//var streams = [url,"/error.m3u8"];
var streams = [url,e];
	

