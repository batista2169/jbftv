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
	let jb_player = document.getElementById("jb_player");
	let input = document.getElementById("input");
	let inputText = input.value;
		window.alert('Canal ' + inputText + ' inserido com sucesso!');
		window.location.href = './player' + '?source=' + inputText;	   
		}
		input.value = ''
	}
