$(document).on('pagebeforeshow', '#Connexion1', function() {

	var email = window.localStorage.getItem("email");
	var password = window.localStorage.getItem("password");
	var secretkey = window.localStorage.getItem("secretkey");
	
	if ( email || password || secretkey ) { var docheck = 1; } else { var docheck = 0; }
	
	if ( docheck == 1 && checkform(email, password, secretkey) == true ) {
		
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
    
});

$(document).on('click', '#submitlog', function() {

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

});

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
	
	//$('#did').val(device.uuid);
	//$('#dplatform').val(device.platform);
	
	var returndata = "NULL";

	$.ajax({url: serviceURL,
		data: {'email': email, 'password': password, 'secretkey': secretkey},
		type: 'post',
		async: true,
		beforeSend: function() {
			$.mobile.loading( 'show', { theme: "b", text: "Connexion ...", textVisible: true });
		},
		complete: function() {
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
			alert('Erreur ' + responseText.responseStatus);
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
				$.mobile.loading( 'show', { theme: "b", text: "Preparation ...", textVisible: true });
			},
			complete: function() {
				$.mobile.loading( 'hide' );
			},
			success: function (responseText) {
				membername = responseText.member_name;
				checklogin(serviceURL, membername, email, password, secretkey, local);
			},
			error: function (responseText) {             
				alert('Erreur ' + responseText.responseStatus);
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
	window.localStorage.setItem("money", returndata.money);
	window.localStorage.setItem("posts", returndata.posts);	
	window.localStorage.setItem("auth_token", returndata.auth_token);
	
	$.mobile.changePage($('#ShoutboxList'));

}

$(document).on('pagebeforeshow', '#ShoutboxList', function(event, data) {

 	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	if ( id_shoutbox && data.prevPage.attr('id') != 'ShoutList') {
		$.mobile.changePage($('#ShoutList'));
	}
	
	if (typeof(refreshIntervalId) != "undefined" && refreshIntervalId !== null) {
		clearInterval(refreshIntervalId);
	}
	
	var id_member = window.localStorage.getItem("id_member");
	var real_name = window.localStorage.getItem("real_name");
	var avatar = window.localStorage.getItem("avatar");
	var id_group = window.localStorage.getItem("id_group");
	var isvip = window.localStorage.getItem("isvip");
	var isadmin = window.localStorage.getItem("isadmin");
	var unread_messages = window.localStorage.getItem("unread_messages");
	var name_color = window.localStorage.getItem("name_color");
	var money = window.localStorage.getItem("money");
	var posts = window.localStorage.getItem("posts");
	var auth_token = window.localStorage.getItem("auth_token");
	
	var group_title = 'Membre';
	var vip_title = 'Non VIP';
	if ( isadmin == "true" ) { group_title = "Administrateur"; } else if ( id_group == 2 ) { group_title = "Mod&eacute;rateur"; }
	if ( isvip == "true" ) { vip_title = "VIP"; }
	
	$('#ULMemberInfos1').empty();
	$('#ULMemberInfos2').empty();
	$('#ULMemberInfos3').empty();
	
	$('#ULMemberInfos1').html('<img src="' + avatar + '" width="100" height="100" />');
	$('#ULMemberInfos2').html('<h2 style="color:' + name_color + '">' + real_name + '</h2>' + group_title + '<br />' + vip_title + '</p>');
	$('#ULMemberInfos3').html('<p>' + unread_messages + ' message(s) non lu(s)<br />' + posts + ' message(s)<br />' + money + ' point(s)</p>');
	
	$("#ULShoutboxList").empty();
	$('#ULShoutboxList').listview();
	$("#last_update").val('0');
	
	// get shoutbox list
	$.ajax({url: 'https://www.fruityclub.net/api/index.php/shoutbox/shoutboxlist',
		type: 'post',
		data: {'auth_token': auth_token, 'id_member': id_member},
		async: true,
		beforeSend: function() {
			$.mobile.loading( 'show', { theme: "b", text: "Affichage des ShoutBoxs ...", textVisible: true });
		},
		complete: function() {
			$.mobile.loading( 'hide' );
			$('#ULShoutboxList').listview('refresh');
		},
		success: function (responseText) {
			var shoutboxsList = '';
			$.each( responseText, function( i, item ) {
				shoutboxsList += '<li data-icon="arrow-r" class="LIShoutboxList" data-name="' + item.id_shoutbox + '"><a href="#">';
				shoutboxsList += item.name;
				shoutboxsList += '</a></li>';
			});
			$("#ULShoutboxList").append( shoutboxsList );

		},
		error: function (responseText) {             
			alert('Erreur ' + responseText.responseStatus);
		}
	});
	
});

$(document).on('vclick', 'li.LIShoutboxList', function() {

	var id_shoutbox = $(this).attr('data-name');
	window.localStorage.setItem("id_shoutbox", id_shoutbox);
	$.mobile.changePage($('#ShoutList'));
	
});

$(document).on('pagebeforeshow', '#ShoutList', function(event, data) {
	
	var id_member = window.localStorage.getItem("id_member");
	var real_name = window.localStorage.getItem("real_name");
	var avatar = window.localStorage.getItem("avatar");
	var id_group = window.localStorage.getItem("id_group");
	var isvip = window.localStorage.getItem("isvip");
	var isadmin = window.localStorage.getItem("isadmin");
	var unread_messages = window.localStorage.getItem("unread_messages");
	var name_color = window.localStorage.getItem("name_color");
	var money = window.localStorage.getItem("money");
	var posts = window.localStorage.getItem("posts");
	var auth_token = window.localStorage.getItem("auth_token");
	
	var group_title = 'Membre';
	var vip_title = 'Non VIP';
	if ( isadmin == "true" ) { group_title = "Administrateur"; } else if ( id_group == 2 ) { group_title = "Mod&eacute;rateur"; }
	if ( isvip == "true" ) { vip_title = "VIP"; }
	
	$('#ULMemberInfos12').empty();
	$('#ULMemberInfos22').empty();
	$('#ULMemberInfos32').empty();
	
	$('#ULMemberInfos12').html('<img src="' + avatar + '" width="100" height="100" />');
	$('#ULMemberInfos22').html('<h2 style="color:' + name_color + '">' + real_name + '</h2>' + group_title + '<br />' + vip_title + '</p>');
	$('#ULMemberInfos32').html('<p>' + unread_messages + ' message(s) non lu(s)<br />' + posts + ' message(s)<br />' + money + ' point(s)</p>');

	$("#ULShoutList").empty();
	$('#ULShoutList').listview();
	
	// première update
	var loading = true;
	refresh_shoutlist(loading);	
	get_shoutbox_infos();
	
	// updates suivantes regulières
	var loading = false;
	var refreshIntervalId = setInterval(function() {
		  refresh_shoutlist(loading);
	}, 30000);

});

function refresh_shoutlist(loading) {

	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	var id_member = window.localStorage.getItem("id_member");
	var auth_token = window.localStorage.getItem("auth_token");
	var last_update1 = $("#last_update").val();
	
	// get shoutbox list
	$.ajax({url: 'https://www.fruityclub.net/api/index.php/shoutbox/shoutlist',
		type: 'post',
		data: {'auth_token': auth_token, 'id_member': id_member, 'id_shoutbox': id_shoutbox, 'last_update': last_update1},
		async: true,
		beforeSend: function() {
			if ( loading == true ) { $.mobile.loading( 'show', { theme: "b", text: "Mise à jour des messages ...", textVisible: true }); }
		},
		complete: function() {
			if ( loading == true ) { $.mobile.loading( 'hide' ); }
			$('#ULShoutList').listview('refresh');
			$("#ULShoutList").animate({ scrollTop: $("#ULShoutList").attr("scrollHeight") }, 3000);
			
			var last_update2 = $('#ULShoutList li').last().attr('data-name');
			$("#last_update").val(last_update2);
		},
		success: function (responseText) {			
			if (typeof(responseText) != "undefined" && responseText !== null) {
				if ( responseText.length > 0) {			
					var shoutsList = '';
					$.each( responseText, function( i, item ) {
						shoutsList += '<li class="LIShoutList" data-name="' + item.log_time + '" data-inset="true">';
						shoutsList += '<img src="' + item.avatar + '" width="76" height="76" style="border: 2px solid white;" />';
						if ( item.member_name.length > 11 ) { var member_name_size = 11; } else { var member_name_size = 14; }
						shoutsList += '<div class="ui-grid-a"><div style="width:30%;" class="ui-block-a"><b style="color:' + item.name_color + '; font-size: ' + member_name_size + 'px;">' + item.member_name + '</b></div><div style="width:70%;" class="ui-block-b">' + item.body + '</div></div>';
						shoutsList += '</li>';
					});
					$("#ULShoutList").append( shoutsList );
				}
			}
		},
		error: function (responseText) {             
			alert('Erreur ' + responseText.responseStatus);
		}
	});	

}

function get_shoutbox_infos(id_shoutbox) {

	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	var id_member = window.localStorage.getItem("id_member");
	var auth_token = window.localStorage.getItem("auth_token");

	$.ajax({url: 'https://www.fruityclub.net/api/index.php/shoutbox/shoutboxinfos',
		type: 'post',
		data: {'auth_token': auth_token, 'id_member': id_member, 'id_shoutbox': id_shoutbox},
		async: true,
		beforeSend: function() {
			$.mobile.loading( 'show', { theme: "b", text: "Recuparation d'informations ...", textVisible: true });
		},
		complete: function() {
			$.mobile.loading( 'hide' );
		},
		success: function (responseText) {
			$("#ShoutboxTitle").html( responseText.name );
			if ( responseText.warning != '' ) { 
				$("#shoutbox_warning").show(); $("#shoutbox_warning").html( responseText.warning ); 
			} else {
				$("#shoutbox_warning").hide();
			}
			$("#last_update").val(responseText.last_update);
		},
		error: function (responseText) {             
			alert('Erreur ' + responseText.responseStatus);
		}
	});

}

$(document).on('click', '#submittext', function() {

	var shouttext = $('#shouttext').val();
	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	var id_member = window.localStorage.getItem("id_member");
	var real_name = window.localStorage.getItem("real_name");
	var auth_token = window.localStorage.getItem("auth_token");

	if ( shouttext.length > 0 ) {

		$.ajax({url: 'https://www.fruityclub.net/api/index.php/shoutbox/shoutpost',
			type: 'post',
			data: {'auth_token': auth_token, 'id_member': id_member, 'real_name': real_name, 'id_shoutbox': id_shoutbox, 'msg_txt': shouttext},
			async: true,
			beforeSend: function() {
				$.mobile.loading( 'show', { theme: "b", text: "Ajout du message ...", textVisible: true });
			},
			complete: function() {
				$('#shouttext').val('');
				$.mobile.loading( 'hide' );
			},
			success: function (responseText) {				
				var loading = true;
				refresh_shoutlist(loading);				
			},
			error: function (responseText) {             
				alert('Erreur ' + responseText.responseStatus);
			}
		});

		
	}
	
});

$(document).on('taphold', '#ULShoutList', function(event) {
	
	var id_shout = $(event.target).closest('li').attr('data-name');
	var id_group = window.localStorage.getItem("id_group");
	
	if ( id_group > 0 && id_group < 3 && id_shout ) {

		// mets à jour id_shout dans le form du popup
		$('#idShoutHidden').val(id_shout);

		// affiche un pop-up de confirmation
		$("#confirmDeleteShout").popup("open");
	
	} else {
		alert('Vous n\'avez pas les droits necessaires ou l\'identifiant du message n\'est pas correctement formé.')		
	}
	
});

// 
$(document).on('click', '#btn_confirmDeleteShout', function() {
	
	var id_group = window.localStorage.getItem("id_group");
	var id_shout = $('#idShoutHidden').val();
	
	if ( id_group > 0 && id_group < 3 && id_shout ) {
	
		var id_shoutbox = window.localStorage.getItem("id_shoutbox");
		var id_member = window.localStorage.getItem("id_member");
		var auth_token = window.localStorage.getItem("auth_token");
		
		$.ajax({url: 'https://www.fruityclub.net/api/index.php/shoutbox/shoutdelete',
			type: 'post',
			data: {'auth_token': auth_token, 'id_member': id_member, 'id_shout': id_shout, 'id_shoutbox': id_shoutbox},
			async: true,
			beforeSend: function() {
				$.mobile.loading( 'show', { theme: "b", text: "Suppression du message ...", textVisible: true });
			},
			complete: function() {
				$.mobile.loading( 'hide' );
			},
			success: function (responseText) {
				$('li.LIShoutList[data-name="' + id_shout + '"]').remove();
			},
			error: function (responseText) {             
				alert('Erreur ' + responseText.responseStatus);
			}
		});
	
	}
});

function clearLocalStorage() {
	window.localStorage.clear();
}
