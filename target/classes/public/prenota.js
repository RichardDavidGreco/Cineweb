p_get('http://localhost:4567/film', '', finish_giorni);

function finish_giorni(txt){
	if(txt=='NotAuthorized'){
		notAuthorized();
		return;
	}
	txt = txt.split(', ');
	inner = '<label for="film" style="color: white;">Film</label><select id="films" name="film" class="form-control"><option value="NULL" selected>-</option>';
	for(i=0; i<txt.length; i++)
		inner = inner+'<option value="'+txt[i]+'">'+txt[i]+'</option>'
	inner = inner+'</select>';
	document.getElementById('selectFilm').innerHTML = inner;
	document.getElementById('films').addEventListener('change', film_selezionato);
}

function film_selezionato(){
	var valore = document.getElementById('films').value;
	if(valore=='NULL'){
		document.getElementById('selectGiorni').innerHTML = '';
		document.getElementById('selectOre').innerHTML = '';
		document.getElementById('vis_sala').innerHTML = '';
		return;
	}
	p_get('http://localhost:4567/film/giorni', '?film='+valore, finish_day);
}

function finish_day(txt){
	if(txt=="NotAuthorized"){
		notAuthorized();
		return;
	}
	txt = txt.split(', ');
	inner = '<label for="giorno" style="color: white;">Giorno</label><select id="giorni" name="giorno" class="form-control"><option value="NULL" selected>-</option>';
	for(i=0; i<txt.length; i++)
		inner = inner+'<option value="'+txt[i]+'">'+txt[i]+'</option>';
	inner = inner+'</select>';
	document.getElementById('selectGiorni').innerHTML = inner;
	document.getElementById('giorni').addEventListener('change', day_selezionato);
}

function day_selezionato(){
	var valoreD = document.getElementById('giorni').value;
	var valoreF = document.getElementById('films').value;
	if(valoreD=='NULL' || valoreF=='NULL'){
		document.getElementById('selectOre').innerHTML = '';
		document.getElementById('vis_sala').innerHTML = '';
		return;
	}
	p_get('http://localhost:4567/film/giorni/ora', '?film='+valoreF+'&giorno='+valoreD, finish_hour);
}

function finish_hour(txt){
	if(txt=="NotAuthorized"){
		notAuthorized();
		return;
	}
	txt = txt.split(', ');
	inner = '<label for="ora" style="color: white;">Ora</label><select id="ore" name="ora" class="form-control"><option value="NULL" selected>-</option>';
	for(i=0; i<txt.length; i++)
		inner = inner+'<option value="'+txt[i]+'">'+txt[i]+'</option>';
	inner = inner+'</select>';
	document.getElementById('selectOre').innerHTML = inner;
	document.getElementById('ore').addEventListener('change', hour_selezionato);
}

function hour_selezionato(){
	var valoreD = document.getElementById('giorni').value;
	var valoreF = document.getElementById('films').value;
	var valoreH = document.getElementById('ore').value;
	if(valoreD=='NULL' || valoreF=='NULL'){
		document.getElementById('selectOre').innerHTML = '';
		document.getElementById('vis_sala').innerHTML = '';
		return;
	}else if(valoreH=='NULL'){
		document.getElementById('vis_sala').innerHTML = '';
		return;
	}
	p_get('http://localhost:4567/film/giorni/ora/sala', '?film='+valoreF+'&giorno='+valoreD+'&ora='+valoreH, visualizza);
}

function visualizza(sala){
	if(sala=='NotAuthorized'){
		notAuthorized();
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	var param = '?numero='+sala;
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		   	finish_visualizza(xmlhttp.responseText);
     	}
	};
	xmlhttp.open("GET", "http://localhost:4567/sala"+param, true);
	xmlhttp.send();
}

function finish_visualizza(txt){
	if(txt=='NULL'){
		document.getElementById('vis_sala').innerHTML = '';
		return;
	}
	var obj = JSON.parse(txt);
	var inner = '';
	
	for(i=0; i<obj.length; i++){
		inner = inner+'<tr>';
		for(j=0; j<obj[i].handicap; j++)
			inner = inner+'<td><input class="seatH" type="checkbox" name="H" value="H_'+i+'_'+j+'" /><label id="H_'+i+'_'+j+'" class="Hlabel" for="H">.</label></td>';
		for(j=0; j<obj[i].comfort; j++)
			inner = inner+'<td><input class="seatC" type="checkbox" name="C" value="C_'+i+'_'+j+'" /><label id="C_'+i+'_'+j+'" class="Clabel" for="C">.</label></td>';
		for(j=0; j<obj[i].normal; j++)
			inner = inner+'<td><input class="seatN" type="checkbox" name="N" value="N_'+i+'_'+j+'" /><label id="N_'+i+'_'+j+'" class="Nlabel" for="N">.</label></td>';
		inner = inner+'</tr>';
	}
	document.getElementById('vis_sala').innerHTML = inner;
	document.getElementById('prenota').style.display = 'block';
	var El = document.getElementsByClassName('Hlabel');
	for(i=0; i<El.length; i++)
		El[i].addEventListener('click', cecca);
	El = document.getElementsByClassName('Clabel');
	for(i=0; i<El.length; i++)
		El[i].addEventListener('click', cecca);
	El = document.getElementsByClassName('Nlabel');
	for(i=0; i<El.length; i++)
		El[i].addEventListener('click', cecca);
	p_get('http://localhost:4567/prenotati', '?film='+document.getElementById('films').value+'&giorno='+document.getElementById('giorni').value+'&ora='+document.getElementById('ore').value+'&user='+document.getElementById('drop_2b').innerHTML, finito);
}

function finito(txt){
	var jarr = JSON.parse(txt);
	for(i=0; i<jarr.length; i++){
		var pre = document.getElementById(jarr[i].codice);
		pre.previousSibling.disabled = true;
		pre.style.cursor = 'not-allowed';
		pre.style.backgroundImage = 'url("/images/poltronaGrey.png")';
		pre.style.color = '#818181';
	}
}

function prenota(){
	var selezionati = [];
	var elementi = document.getElementsByClassName('seatH');
	for(i=0; i<elementi.length; i++)
		if(elementi[i].checked == true)
			selezionati.push(elementi[i].value);
	elementi = document.getElementsByClassName('seatN');
	for(i=0; i<elementi.length; i++)
		if(elementi[i].checked == true)
			selezionati.push(elementi[i].value);
	elementi = document.getElementsByClassName('seatC');
	for(i=0; i<elementi.length; i++)
		if(elementi[i].checked == true)
			selezionati.push(elementi[i].value);
	p_post('http://localhost:4567/prenota', '?prenotati='+selezionati+'&film='+document.getElementById('films').value+'&giorno='+document.getElementById('giorni').value+'&ora='+document.getElementById('ore').value+'&user='+document.getElementById('drop_2b').innerHTML, prenotazione_avvenuta);
}

function prenotazione_avvenuta(txt){
	if(txt=='NotAuthorized'){
		notAuthorized();
		return;
	} else if(txt=='Prenotazione_Avvenuta'){
		document.getElementById('selectBody').style.display = 'none';
		document.getElementById('vis_sala').style.display = 'none';
		document.getElementById('prenota').style.display = 'none';
		var inner = '<strong style="font-size: 1.5em; color: green;">Prenotazione avvenuta</strong></br><table style="width:40%;margin:auto;"><tr><td><strong>Utente:</strong></td><td>'+document.getElementById('drop_2b').innerHTML+'</td></tr><tr><td><strong>Film:</strong></td><td>'+document.getElementById('films').value+'</td></tr><tr><td><strong>Giorno:</strong></td><td>'+document.getElementById('giorni').value+'</td></tr><tr><td><strong>Ora:</strong></td><td>'+document.getElementById('ore').value+'</td></tr></table></br>Verrete reindirizzati alla pagina precedente.</br>Se questo non dovesse accadere cliccare <a href="home.html" target="_top" style="color: red;">qui</a></div>';
		document.getElementById('avvenuta').innerHTML = '';
		document.getElementById('avvenuta').innerHTML = inner;
		document.getElementById('avvenuta').style.display = 'block';
		setTimeout(function(){window.location.href = 'home.html';}, 5000);
	} else if(txt=='non_selezionati'){
		document.getElementById('avvenuta').innerHTML = 'Selezionare almeno un posto libero (non grigio)';
		setTimeout(function(){document.getElementById('avvenuta').style.display = 'none';}, 5000);
	}
}

function cecca(){
	cbx = this.previousSibling;
	if(cbx.checked==true && cbx.disabled==false)
		cbx.checked = false;
	else if(cbx.checked==false && cbx.disabled==false)
		cbx.checked = true;
}

function notAuthorized(name){
	document.getElementById('selectBody').innerHTML = '';
	document.getElementById('vis_sala').innerHTML = '';
	document.getElementById('prenota').style.display = 'none';
	document.getElementById('selectBody').innerHTML = '<p style="text-align: center; color: white;">Effettuare il login per poter prenotare, dopodiché ricaricare la pagina</p>';
}

function p_get(url, query, funzione){
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		   	funzione(xmlhttp.responseText);
     	}
	};
	xmlhttp.open("GET", url+query, true);
	if(sessionStorage.getItem('accessToken')!=null)
		xmlhttp.setRequestHeader('Authorization', sessionStorage.getItem('accessToken'));
	else
		xmlhttp.setRequestHeader('Authorization', localStorage.getItem('accessToken'));
	xmlhttp.send();
}

function p_post(url, query, funzione){
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		   	funzione(xmlhttp.responseText);
     	}
	};
	xmlhttp.open("POST", url+query, true);
	if(sessionStorage.getItem('accessToken')!=null)
		xmlhttp.setRequestHeader('Authorization', sessionStorage.getItem('accessToken'));
	else
		xmlhttp.setRequestHeader('Authorization', localStorage.getItem('accessToken'));
	xmlhttp.send();
}
