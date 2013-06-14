// Events
document.addEventListener("deviceready", onDeviceReady, false);

//$(document).bind("mobileinit", fn_mobileinit);

$(document).ready(fn_show_Connexion1);
//$(document).on('pageshow', '#Connexion1', fn_show_Connexion1);
$(document).on('submit', '#checkuser', fn_submitconnexion);
$(document).on('vclick', '#submitlog', fn_submitconnexion);

// Functions
function onDeviceReady() {
	var deviceReady = true;	
}

function fn_show_Connexion1(event, data) {
	
	// Définit préférence par défaut
	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");
	
	if ( !vibration_msg ) { window.localStorage.setItem('vibration_msg', 0); }
	if ( !msg_size ) { window.localStorage.setItem('msg_size', 12); }
	
	var email = window.localStorage.getItem("email");
	var password = window.localStorage.getItem("password");
	var secretkey = window.localStorage.getItem("secretkey");
	var prevPage = window.localStorage.getItem("prevPage");
	
	var docheck = 0;
	var navback = 0;
	
	stopRefresh();
	
	if ( prevPage == "ShoutboxList" || prevPage == "ShoutboxList" ) { var navback = 1; }
	
	if ( (email || password || secretkey) && navback == 0 ) { var docheck = 1; }
	
	if ( docheck == 1 && checkform(email, password, secretkey) == true ) {

		$('#erreur_connexion').hide();
		
		if ( email.length > 0 && password.length > 0 ) {
		
			var serviceURL = 'https://www.fruityclub.net/api/index.php/connexion/email';
			var local = 1;
			checkmembername(serviceURL, email, password, secretkey, local);			
			
		} else if ( secretkey.length > 0 ) {
		
			var serviceURL = 'https://www.fruityclub.net/api/index.php/connexion/secretkey';
			var local = 1;
			var email = '';
			checkmembername(serviceURL, email, password, secretkey, local);
		
		}
	
	}	
}

function fn_submitconnexion(e) {
	
	e.preventDefault();
	
	var email = $('#email').val();
	var password = $('#passlog').val();
	var secretkey = $('#secretkey').val();		
	
	if ( checkform(email, password, secretkey) == true ) {

		if ( email.length > 0 && password.length > 0 ) {
		
			var serviceURL = 'https://www.fruityclub.net/api/index.php/connexion/email';
			var local = 0;
			checkmembername(serviceURL, email, password, secretkey, local);	
			
		} else if ( secretkey.length > 0 ) {
		
			var serviceURL = 'https://www.fruityclub.net/api/index.php/connexion/secretkey';
			var local = 0;
			var email = '';
			checkmembername(serviceURL, email, password, secretkey, local);
		
		}
			
	} else {
	
		alert('Il manque une information pour vous connecter.');
	
	}
	
	return false;
	
}

function checkform(email, password, secretkey) {

	var testForm = false;
	if ( email.length > 0 && password.length > 0 ) {
		testForm = true;
	} else if ( secretkey.length > 0 ) {
		testForm = true;
	}
	
	return testForm;

}

function checklogin(serviceURL, membername, email, password, secretkey, local) {
	
	if ( local == 0 ) {
		if ( membername != '' ) {
			password = $.sha1(membername + password);
			secretkey = '';
		} else {
			password = '';
			secretkey = $.sha1(secretkey);	
		}
	} else {
		if ( membername != '' ) {
			password = password;
			secretkey = '';
		} else {
			password = '';
			secretkey = secretkey;	
		}
	}
	
	var returndata = "NULL";

	$.ajax({url: serviceURL,
		data: {'email': email, 'password': password, 'secretkey': secretkey},
		type: 'post',
		async: true,
		beforeSend: function() {
			$('body').addClass('ui-loading');
			$.mobile.loading( 'show', { theme: "b", text: "Connexion ...", textVisible: true });
		},
		complete: function() {
			$('body').removeClass('ui-loading');
			$.mobile.loading( 'hide' );
		},
		success: function (responseText) {
			if ( $('#autolog').val() == 1 && local == 0 ) {			
				window.localStorage.setItem("email", email);
				window.localStorage.setItem("password", password);
				window.localStorage.setItem("secretkey", secretkey);
			}
			shoutboxAccess(responseText);
		},
		error: function (responseText) {
			$.mobile.loading( 'hide' );
			$.mobile.changePage($('#Connexion1'));
			$('#erreur_connexion').show();
		}
	});
	
	return returndata;

}

function checkmembername(serviceURL, email, password, secretkey, local) {

	var returndata = "NULL";
	
	if ( email == '' ) { 
		
		var membername = '';
		checklogin(serviceURL, membername, email, password, secretkey, local);
	
	} else {
	
		$.ajax({url: 'https://www.fruityclub.net/api/index.php/connexion/membername',
			data: {'email': email},
			type: 'post',
			async: true,
			beforeSend: function() {
				$('body').addClass('ui-loading');
				$.mobile.loading( 'show', { theme: "b", text: "Preparation ...", textVisible: true });
			},
			complete: function() {
				$('body').removeClass('ui-loading');
				$.mobile.loading( 'hide' );
			},
			success: function (responseText) {
				membername = responseText.member_name;
				checklogin(serviceURL, membername, email, password, secretkey, local);
			},
			error: function (responseText) {             
				$.mobile.loading( 'hide' );
				$.mobile.changePage($('#Connexion1'));
				$('#erreur_connexion').show();
			}
		});
		
	}

}

function shoutboxAccess(returndata) {

	$('#passlog').val('');
	$('#secretkey').val('');
	
	window.localStorage.setItem("id_member", returndata.id_member);
	window.localStorage.setItem("real_name", returndata.real_name);
	window.localStorage.setItem("avatar", returndata.avatar);
	window.localStorage.setItem("id_group", returndata.id_group);
	window.localStorage.setItem("isvip", returndata.isvip);
	window.localStorage.setItem("isadmin", returndata.isadmin);	
	window.localStorage.setItem("unread_messages", returndata.unread_messages);
	window.localStorage.setItem("name_color", returndata.name_color);
	window.localStorage.setItem("name_color_glow", returndata.name_color_glow);
	window.localStorage.setItem("money", returndata.money);
	window.localStorage.setItem("posts", returndata.posts);	
	window.localStorage.setItem("auth_token", returndata.auth_token);
	
	if (typeof(window.localStorage.getItem("id_shoutbox")) != "undefined" && window.localStorage.getItem("id_shoutbox") !== null) {
		$('#content').load('shoutslist.html');
	} else {
		$('#content').load('shoutboxslist.html');
	}

}
