/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/
function Carregar(){
	document.getElementById("input").value = localStorage.getItem("input");
	}
function setLink(){
var input = document.form.input;
var inputText = input.value;
	if (input.value == ""){
		window.alert("Url do vídeo ou áudio é obrigatório!");
		input.focus();
		return false;
	}else {

		window.alert('Canal ' + inputText + ' inserido com sucesso!');
		localStorage.setItem("input",document.getElementById("input").value);
		
		window.location.reload();

		}
}


function setLin() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}

var inputText = input.value;
    u = input.value;
   // u = u[1];
    alert(u);

//var e = '/error.m3u8';
var script = document.createElement('script');
script.src = setLin() ? 'settings/js/ios.js' : 'settings/js/hls.js';
document.head.appendChild(script);
var streams = [u];
//var streams = [url,"/error.m3u8"];

//function Link() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
//var t = '/error.m3u8';
//var script = document.createElement('script');
//script.src = Link() ? 'settings/js/ios.js' : 'settings/js/hls.js';
//document.head.appendChild(script);
//var streams = [url];
//var video = document.getElementById("video");
//var input = document.getElementById("input");
//var inputText = input.value;
//var e = input.value;
//var streams = [e,"/error.m3u8"];
