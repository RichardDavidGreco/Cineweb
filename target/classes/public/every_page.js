function loading(){
	while(document.readyState!='complete'){;}
	document.getElementById('reg_mail').addEventListener('input', bar);
	document.getElementById('reg_pssw').addEventListener('input', bar);
	document.getElementById('reg_pssw2').addEventListener('input', bar);
	document.getElementById('reg_name').addEventListener('input', bar);
	document.getElementById('reg_lastname').addEventListener('input', bar);
	document.getElementById('reg_town').addEventListener('input', bar);
	document.getElementById('reg_date').addEventListener('input', bar);
	if(localStorage.getItem('logged')!=null){
		var user = JSON.parse(localStorage.getItem('logged'));
		document.getElementById('log').style.display = 'none';
		document.getElementById('register').style.display = 'none';
		document.getElementById('user').style.display = 'inline';
		document.getElementById('drop_1').innerHTML = user.name;
		document.getElementById('drop_2').innerHTML = user.lastname;
		document.getElementById('drop_2b').innerHTML = user.mail;
		document.getElementById('drop_3').innerHTML = user.town;
		document.getElementById('drop_4').innerHTML = user.date;
	} else if(sessionStorage.getItem('logged')!=null){
		var user = JSON.parse(sessionStorage.getItem('logged'));
		document.getElementById('log').style.display = 'none';
		document.getElementById('register').style.display = 'none';
		document.getElementById('user').style.display = 'inline';
		document.getElementById('drop_1').innerHTML = user.name;
		document.getElementById('drop_2').innerHTML = user.lastname;
		document.getElementById('drop_2b').innerHTML = user.mail;
		document.getElementById('drop_3').innerHTML = user.town;
		document.getElementById('drop_4').innerHTML = user.date;
	}
	if(location.pathname=='/home.html'){
		var jumbos = document.getElementById('3terzi').getElementsByClassName('jumbotron');
		if(jumbos[jumbos.length-1].getElementsByTagName('P').innerHTML=='')
			setTimeout(function(){;}, 1000);
	}
	document.getElementById('loader').style.display = 'none';
	document.getElementById('img_loader').style.display = 'none';
}
