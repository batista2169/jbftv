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
		//localStorage.setItem("input",document.getElementById("input").value);
  const input = document.querySelector("#input").value;
  localStorage.setItem("link", input);
  console.log(input);
		alert("O valor guardado e: " + localStorage.getItem("link"))

		var u = window.localStorage.getItem('link'); 
		//window.location.reload();
		//setTimeout(function (setLin) {
       // location.reload()
    //}, 1000); .split(",")
alert(u);
		location.reload()

video.src=u
video.load()
video.play()
		}
}
const input = document.querySelector("#input").value;
  localStorage.setItem("link", input);
  console.log(input);
  alert("O valor guardado e: " + localStorage.getItem("link"))
  var u = window.localStorage.getItem('link');
var streams = [u];
function setLin() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
//var e = '/error.m3u8';
var script = document.createElement('script');
script.src = setLin() ? 'settings/js/ios.js' : 'settings/js/hls.js';
document.head.appendChild(script);
//var streams = [url,"/error.m3u8"];

function play() {    
    setTimeout(function () {	   
	    alert("O valor guardado e: " + localStorage.getItem("link"))
    }, 100);
}
