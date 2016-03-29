for(i=0; i<8; i++){
	get_info(i);
}

function get_info(n){
	var xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
     	if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
      		   	finish_info(xmlhttp.responseText, n);
     	}
	};
	xmlhttp.open("GET", "http://localhost:4567/info", true);
	xmlhttp.send();
}

function finish_info(txt, i){
	var jumbos = document.getElementsByClassName("jumbotron");
	txt = JSON.parse(txt);
	jumbos[i].getElementsByTagName("A")[0].innerHTML = txt.title;
	jumbos[i].getElementsByTagName("IMG")[0].src = txt.image;
	jumbos[i].getElementsByTagName("A")[0].href = txt.link;
	jumbos[i].getElementsByTagName("P")[0].innerHTML = txt.text;
}
