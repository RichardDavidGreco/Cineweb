pal_get('http://localhost:4567/palinsesto');

function finish_info(text){
	var accord = document.getElementById('film');
	var Jarr = JSON.parse(text);
	var testo = '';
	for(i=0; i<Jarr.length; i++){
		testo = testo + '<button onclick="openAccord('+i+')" class="w3-btn-block w3-center-align w3-hover-purple"><h4>'+Jarr[i].film+'</h4></button><div class="w3-accordion-content container" style="background-color: #180125;"><div class="jumbotron"><h2>'+Jarr[i].film+'</h2><hr/><img class="img-rounded img-responsive" src="'+Jarr[i].image+'" alt="'+Jarr[i].film+'"/><p>'+Jarr[i].des+'</p><table style="text-align: left;"><thead><tr><th>Giorno</th><th colspan="3">Orari</th></tr></thead><tbody>'; 
		var inf = Jarr[i].info;
		for(j=0; j<inf.length; j++){
			testo = testo + '<tr><td>'+inf[j].giorno+'</td>';
			var orario = inf[j].ore;
			for(k=0; k<orario.length; k++){
				testo = testo + '<td>'+ orario[k].ora +'</td>';
			}
			testo = testo + '</tr>';
		}
		testo = testo + '</tbody></table></div></div>';
	}
	accord.innerHTML = testo;
}



function pal_get(url){
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		   	finish_info(xmlhttp.responseText);
     	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}
