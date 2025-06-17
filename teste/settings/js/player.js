/*
    Copyright (c) 2024 Pierleeb
    SPDX-License-Identifier: MIT
    JBF-TV Player - R.Santana/BA
*/

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

var jb_player = document.getElementById("jb_player");
var input = document.querySelector("#input").value;
	localStorage.setItem("arq", input);
	//alert("O valor guardado e: " + localStorage.getItem("arq"))
//var url = window.localStorage.getItem('arq'); 

window.location.reload();
	}	
}

function Link() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
var url = window.localStorage.getItem('arq'); 
//window.alert(url);
var e = '/error.m3u8';
var script = document.createElement('script');
script.src = Link() ? 'settings/js/ios.js' : 'settings/js/hls.js';
document.head.appendChild(script);
var streams = [url,e];
//var streams = [url,"/error.m3u8"];
localStorage.clear();


//function Carregar(){
//document.getElementById("input").value = localStorage.getItem("input");	
	//}

//function setLink(){
//var input = document.form.input;
//var inputText = input.value;
	//if (input.value == ""){
		//window.alert("Url do vídeo ou áudio é obrigatório!");
		//input.focus();
		//return false;
	//}else {
		//window.alert('Canal ' + inputText + ' inserido com sucesso!');
  		//localStorage.setItem("input",document.getElementById("input").value);		
		//window.location.href = '?source=' + input.value; 
		//}
	//}
//function Link() {return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;}
//var url = window.location.href;
    //url = url.split('?source=');
    //url = url[1];
    //alert(url);
//var e = '/error.m3u8';
//var script = document.createElement('script');
//script.src = Link() ? 'settings/js/ios.js' : 'settings/js/hls.js';
//document.head.appendChild(script);
//var streams = [url,e];
//var streams = [url,"/error.m3u8"];
