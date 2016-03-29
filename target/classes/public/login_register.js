function bar(){
	var form = document.getElementById('form_register');
	var i = 0;
	for(j=0; j<form.length; j++){
		if(form[j].tagName!='label' && form[j].value!='')
			i = i+1;
	}
	var barra = document.getElementById('reg_bar');
	if(i==7){
		barra.innerHTML = '100%';
		barra.style.width = '100%';
		barra['aria-valenow'] = 100;
	} else {
		barra.innerHTML = 15*i+'%';
		barra.style.width = 15*i+'%';
		barra['aria-valenow'] = 15*i;
	}
}

function get(url, query){
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		   	finish_login(xmlhttp.responseText+"$$"+xmlhttp.getResponseHeader('Authorization'));
     	}
	};
	xmlhttp.open("GET", url+query, true);
	xmlhttp.send();
}

function post(url, params){
	var xmlhttp = new XMLHttpRequest();
	var query = '?mail='+params[0]+'&pssw='+params[1]+'&name='+params[2]+'&last='+params[3]+'&town='+params[4]+'&date='+params[5];
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		finish_register(xmlhttp.responseText);
     	}
	};
	xmlhttp.open("POST", url+query, true);
	xmlhttp.send();
}

function login(){
	var ml = document.getElementById('mail').value.replace('@','_').replace('.','_');
	var pw = document.getElementById('pssw').value;
	get('http://localhost:4567/login', '?mail='+ml+'&pssw='+pw);
}

function finish_login(txt){
	response = txt.split('$$')[0];
	if(response==='non_registrato'){
		document.getElementById('non-registrato').style.display = 'block';
		document.getElementById('non-registrato').innerHTML = '<strong>Utente non registrato</strong>'
	} else if(response==='password_errata') {
		document.getElementById('non-registrato').style.display = 'block';
		document.getElementById('non-registrato').innerHTML = '<strong>Password non corrispondente</strong>';
	} else {
		var user = JSON.parse(response);
		document.getElementById('log').style.display = 'none';
		document.getElementById('register').style.display = 'none';
		document.getElementById('user').style.display = 'inline';
		document.getElementById('drop_1').innerHTML = user.name;
		document.getElementById('drop_2').innerHTML = user.lastname;
		document.getElementById('drop_2b').innerHTML = user.mail;
		document.getElementById('drop_3').innerHTML = user.town;
		document.getElementById('drop_4').innerHTML = user.date;
		if(document.getElementById('remember').checked==true){
			localStorage.setItem('accessToken', txt.split('$$')[1]);
			localStorage.setItem('logged', JSON.stringify(user));
		} else {
			sessionStorage.setItem('accessToken', txt.split('$$')[1]);
			sessionStorage.setItem('logged', JSON.stringify(user));
		}
		document.getElementById('close-modal').click();
	}
}

function logout(){
	if(sessionStorage.getItem('accessToken')==null){
		update('http://localhost:4567/logout', localStorage.getItem('accessToken'));
		localStorage.removeItem('accessToken');
		localStorage.removeItem('logged');
	} else {
		update('http://localhost:4567/logout', sessionStorage.getItem('accessToken'));
		sessionStorage.removeItem('logged');
		sessionStorage.removeItem('accessToken');
	}
	document.getElementById('log').style.display = 'inline';
	document.getElementById('register').style.display = 'inline';
	document.getElementById('user').style.display = 'none';
	document.getElementById('drop_1').innerHTML = '';
	document.getElementById('drop_2').innerHTML = '';
	document.getElementById('drop_3').innerHTML = '';
	document.getElementById('drop_4').innerHTML = '';
}

function update(url, token){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("PUT", url, true);
	xmlhttp.setRequestHeader('Authorization', token);
	xmlhttp.send();
}

function register(){
	var mail = document.getElementById('reg_mail').value.replace('@','_').replace('.','_');
	var pssw = document.getElementById('reg_pssw').value;
	var pssww = document.getElementById('reg_pssw2').value;
	var name = document.getElementById('reg_name').value;
	var last = document.getElementById('reg_lastname').value;
	var town = document.getElementById('reg_town').value;
	var date = document.getElementById('reg_date').value;
	var yet = false;
	var go = true;	
	
	if(pssw!=pssww){
		document.getElementById('error_reg').innerHTML = '<div id="inner_error" class="w3-container w3-red"><p style="margin: auto;">Le password non corrispondono</p></div>';
		yet = true;
		go = false;
	}
	if(date.charAt(2)!='-' || date.charAt(5)!='-' || Number(date.substring(0, 2))<1 || Number(date.substring(0, 2))>31 || Number(date.substring(3, 5))<1 || Number(date.substring(3, 5))>12){
		if(yet)
			document.getElementById('inner_error').innerHTML = document.getElementById('inner_error').innerHTML+'<p style="margin: auto;">Inserire data in questo formato "gg-mm-aaaa"!</p>';
		else
			document.getElementById('error_reg').innerHTML = '<div id="inner_error" class="w3-container w3-red"><p style="margin: auto;">Inserire data in questo formato "gg-mm-aaaa"</p></div>';
		go = false;
	}
	if(go){
		var params = [mail, pssw, name, last, town, date];
		post('http://localhost:4567/register', params);
	}
	return false;
}

function finish_register(text){
	if(text=='esiste'){
		document.getElementById('error_reg').innerHTML = '<div id="inner_error" class="w3-container w3-red"><p style="margin: auto;">Utente gi&#224 registrato</p></div>';
	} else {
		document.getElementById('reg_mail').value = '';
		document.getElementById('reg_pssw').value = '';
		document.getElementById('reg_pssw2').value = '';
		document.getElementById('reg_name').value = '';
		document.getElementById('reg_lastname').value = '';
		document.getElementById('reg_town').value = '';
		document.getElementById('reg_date').value = '';
		var barra = document.getElementById('reg_bar');
		barra.innerHTML = '0%';
		barra.style.width = '0%';
		barra['aria-valenow'] = 0;
		document.getElementById('close-modal-register').click();
		window.location.href = "registrato.html";
	}
}













