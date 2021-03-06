// Events
document.addEventListener("deviceready", onDeviceReady, false);
$(document).ready(fn_show_Connexion1);
$(document).on('submit', '#checkuser', fn_submitconnexion);
$(document).on('click', '#submitlog', fn_submitconnexion);
$(document).on('click', '#btn_autoLogConfig', fn_del_autolog);
$(document).on('click', '#submit_config', fn_submit_config);
$(document).on('click', '#btn_confirmConfig', fn_click_btn_confirmConfig);
$(document).on('click', 'li.LIShoutboxList', fn_click_LIShoutboxList);
$(document).on('taphold', '#ULShoutList', fn_tapInShoutList);
$(document).on('click', '#btn_refreshShouts', fn_click_btn_refreshShouts);
$(document).on('click', '#btn_showShoutboxsList', fn_click_btn_showShoutboxsList);
$(document).on('click', '#btn_emptytext', fn_emptytext);
$(document).on('click', '#submittext', fn_sendshout);
$(document).on('submit', '#formaddshout', fn_sendshout);
$(document).on('click', '#smileyslist', fn_click_smileyslist);
$(document).on('click', '#ULsmileyslist', fn_click_ULsmileyslist);
$(document).on('click', '#btn_confirmDeleteShout', fn_confirmDeleteShout);
$(document).on('click', '#btn_closeSmileyslist', fn_click_btn_closeSmileyslist);
$(document).on('click', '#btn_cancelDeleteShout', fn_click_cancelDeleteShout);

var baseApiUrl = "https://api.fruityclub.net/index.php/";

// Functions
function onDeviceReady() {
	var deviceReady = true;	
}

function fn_click_btn_showShoutboxsList() {
	$('#content').load('html/shoutboxslist.html', fn_show_ShoutboxList);
}

function fn_show_Connexion1() {
	
	console.log('fn_show_Connexion1');
	$('#shootFooter').hide();
	
	// Définit préférence par défaut
	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");
	
	if ( !vibration_msg ) { window.localStorage.setItem('vibration_msg', 0); }
	if ( !msg_size ) { window.localStorage.setItem('msg_size', 14); }
	
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

		console.log('auto connexion ok');
		$('#erreur_connexion').hide();
		
		if ( email.length > 0 && password.length > 0 ) {
		
			var serviceURL = baseApiUrl + 'connexion/email';
			var local = 1;
			checkmembername(serviceURL, email, password, secretkey, local);			
			
		} else if ( secretkey.length > 0 ) {
		
			var serviceURL = baseApiUrl + 'connexion/secretkey';
			var local = 1;
			var email = '';
			checkmembername(serviceURL, email, password, secretkey, local);
		
		}
	
	} else {
		console.log('auto connexion ko');
		window.localStorage.setItem("prevPage", "connexion");
		$('#content').load('html/connexion.html', fn_showSwitch);		
	}
	
}

function fn_showSwitch() {
	$('.switch').bootstrapSwitch();
}

function fn_submitconnexion(e) {
	
	console.log('fn_submitconnexion');
	e.preventDefault();
	
	var email = $('#email').val();
	var password = $('#passlog').val();
	var secretkey = $('#secretkey').val();		
	
	if ( checkform(email, password, secretkey) == true ) {

		if ( email.length > 0 && password.length > 0 ) {
			
			console.log('connexion email');
			var serviceURL = baseApiUrl + 'connexion/email';
			var local = 0;
			checkmembername(serviceURL, email, password, secretkey, local);	
			
		} else if ( secretkey.length > 0 ) {
			
			console.log('connexion cle');
			var serviceURL = baseApiUrl + 'connexion/secretkey';
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
			$('#miniloader').show();
		},
		complete: function() {
			$('#miniloader').hide();
		},
		success: function (responseText) {
			if ( $('#autolog').val() == "on" && local == 0 ) {	
				console.log('autolog ok');
				window.localStorage.setItem("email", email);
				window.localStorage.setItem("password", password);
				window.localStorage.setItem("secretkey", secretkey);
			}
			shoutboxAccess(responseText);
		},
		error: function (responseText) {
			$('#miniloader').hide();
			$('#content').load('html/connexion.html', fn_showSwitch);
			$('#erreur_connexion').show();
		}
	});
	
	return returndata;

}

function checkmembername(serviceURL, email, password, secretkey, local) {

	console.log('checkmembername');
	
	var returndata = "NULL";
	
	if ( email == '' ) { 
		
		var membername = '';
		checklogin(serviceURL, membername, email, password, secretkey, local);
	
	} else {
	
		$.ajax({url: baseApiUrl + 'connexion/membername',
			data: {'email': email},
			type: 'post',
			async: true,
			beforeSend: function() {
				$('#miniloader').show();
			},
			complete: function() {
				$('#miniloader').hide();
			},
			success: function (responseText) {
				membername = responseText.member_name;
				checklogin(serviceURL, membername, email, password, secretkey, local);
			},
			error: function (responseText) {             
				$('#miniloader').hide();
				$('#content').load('html/connexion.html', fn_showSwitch);
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
		$('#content').load('html/shoutslist.html', fn_show_ShoutList);
	} else {
		$('#content').load('html/shoutboxslist.html', fn_show_ShoutboxList);
	}

}

function vibrateOnNewMEssages() {
  if (typeof(deviceReady) != "undefined" && deviceReady !== null) {
		navigator.notification.vibrate(1000);
	}
}

function get_shoutbox_infos(id_shoutbox) {

	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	var id_member = window.localStorage.getItem("id_member");
	var auth_token = window.localStorage.getItem("auth_token");

	$.ajax({url: baseApiUrl + 'shoutbox/shoutboxinfos',
		type: 'post',
		data: {'auth_token': auth_token, 'id_member': id_member, 'id_shoutbox': id_shoutbox},
		async: true,
		beforeSend: function() {
			$('#miniloader').show();			
		},
		complete: function() {
			$('#miniloader').hide();
		},
		success: function (responseText) {
			$("#ShoutboxTitle").html( responseText.name );
			if ( responseText.warning != '' ) { 
				$("#shoutbox_warning").show(); $("#shoutbox_warning").html( responseText.warning ); 
			} else {
				$("#shoutbox_warning").hide();
			}
		},
		error: function (responseText) {
			$('#miniloader').hide();
		}
	});

}

function refresh_shoutlist(loading) {

  loading = loading || false;

	// loading = true si premier refresh
	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	var id_member = window.localStorage.getItem("id_member");
	var auth_token = window.localStorage.getItem("auth_token");
	var last_update1 = $("#last_update").val();

	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");

	// get shoutbox list
	$.ajax({url: baseApiUrl + 'shoutbox/shoutlist',
		type: 'post',
		data: {'auth_token': auth_token, 'id_member': id_member, 'id_shoutbox': id_shoutbox, 'last_update': last_update1},
		async: true,
		beforeSend: function() {
			if ( loading == true ) { $('#miniloader').show(); }
		},
		complete: function() {
			if ( loading == true ) { $('#miniloader').hide(); $("#loadingMessages").modal('hide'); }

			var last_update2 = $('#ULShoutList li').last().attr('data-name');
			$("#last_update").val(last_update2);

			$(".linkInMessage").each(function() {

				var url = $(this).attr("href");
				var hostname = $(this).prop('href', url).prop('hostname');
				$(this).text(hostname);

			});
		},
		success: function (responseText) {
			if ( loading == true ) { $("#ULShoutList").empty(); }
			if (typeof(responseText) != "undefined" && responseText !== null) {
				if ( responseText.length > 0) {	
					var shoutsList = '';
					$.each( responseText, function( i, item ) {
						shoutsList += '<li class="LIShoutList" data-name="' + item.log_time + '" data-inset="true"><div class="row">';
						shoutsList += '<div class="span2"><div class="well"><img src="' + item.avatar + '" class="img-polaroid" style="width: 76px;" /></div></div>';						
						shoutsList += '<div class="span10"><div class="well"><b style="color:' + item.name_color + '; text-shadow:0px 0px 2px ' + item.name_color_glow + ';">' + item.member_name + '</b><br /><span style="font-size:' + msg_size + 'px;">' + item.body + '</span><blockquote class="pull-right"><small>' + item.time_shout + '</small></blockquote></div></div>';
						shoutsList += '</div></li>';
					});
					$("#ULShoutList").append( shoutsList );
					if ( vibration_msg == 1 ) { 
						vibrateOnNewMEssages(); 
					}
				}
			}
		},
		error: function (responseText) {             
			$('#miniloader').hide();
			$('#content').load('html/connexion.html', fn_showSwitch);
			$('#erreur_connexion').show();
		}
	});

}

function startRefresh(firstRefresh) {

  firstRefresh = firstRefresh || false;

	refresh_shoutlist(firstRefresh);	
	var refreshIntervalId = setTimeout(startRefresh, 30000);

	// on conserve l'id du refreshinterval pour utilisation future
	window.localStorage.setItem("refreshIntervalId", refreshIntervalId);	
}

function stopRefresh() {
	if (typeof(window.localStorage.getItem("refreshIntervalId")) != "undefined" && window.localStorage.getItem("refreshIntervalId") !== null) {
		var refreshIntervalId = window.localStorage.getItem("refreshIntervalId");
		clearInterval(refreshIntervalId);
	}

}

function fn_show_config() {

  	stopRefresh();
  	$('#shootFooter').hide();

	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");

	// mets valeurs par défaut si existe	
	if ( !vibration_msg ) { vibration_msg = 0; }
	if ( !msg_size ) { msg_size = 12; }

	$('input:radio[name="msg_size"]').filter('[value="' + msg_size + '"]').next().click();
	$('#vibration_msg').val(vibration_msg);
	
	window.localStorage.setItem("prevPage", "config");

}

function fn_del_autolog() {
	window.localStorage.removeItem("email");
	window.localStorage.removeItem("password");
	window.localStorage.removeItem("secretkey");
	
	$('#popup_confirmAutolog').modal('show');
}

function fn_submit_config() {

	var vibration_msg = $('#vibration_msg').val();
	var msg_size = $("input[name=msg_size]:checked").val();

	window.localStorage.setItem("vibration_msg", vibration_msg);
	window.localStorage.setItem("msg_size", msg_size);	
	
	$('#popup_confirmConfig').modal('show');
}

function fn_click_btn_confirmConfig() {

	$('#popup_confirmConfig').modal('hide');

	if (typeof(window.localStorage.getItem("id_shoutbox")) != "undefined" && window.localStorage.getItem("id_shoutbox") !== null) {
		$('#content').load('html/shoutslist.html');
	} else {
		$('#content').load('html/shoutboxslist.html');
	}	

}

function fn_show_ShoutboxList(event, data) {
	
	$('#shootFooter').hide();

  	var id_member = window.localStorage.getItem("id_member");
	var auth_token = window.localStorage.getItem("auth_token");
	
	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");
	var prevPage = window.localStorage.getItem("prevPage");

	stopRefresh();	
	$("#last_update").val('0');
	displayUserInfos();
	
	var nbShoutboxs = $("#ULShoutboxList li").size();
	if ( nbShoutboxs == 0 ) {

		// get shoutbox list
		$.ajax({url: baseApiUrl + 'shoutbox/shoutboxlist',
			type: 'post',
			data: {'auth_token': auth_token, 'id_member': id_member},
			async: true,
			beforeSend: function() {
				$('#miniloader').show();
			},
			complete: function() {
				$('#miniloader').hide();
			},
			success: function (responseText) {
				$("#ULShoutboxList").empty();
				var shoutboxsList = '';
				$.each( responseText, function( i, item ) {
					shoutboxsList += '<li class="LIShoutboxList" data-name="' + item.id_shoutbox + '"><div class="well well-large"><h3>';
					shoutboxsList += item.name;
					shoutboxsList += '</h3></div></li>';
				});
				$("#ULShoutboxList").append( shoutboxsList );

			},
			error: function (responseText) {
				$('#miniloader').hide();
				$('#content').load('html/connexion.html', fn_showSwitch);
				$('#erreur_connexion').show();
			}
		});

	}
	
	window.localStorage.setItem("prevPage", "shoutboxslist");

}

function fn_click_LIShoutboxList() {
	console.log('fn_click_LIShoutboxList');
	var id_shoutbox = $(this).attr('data-name');
	window.localStorage.setItem("id_shoutbox", id_shoutbox);	
	$('#content').load('html/shoutslist.html', fn_show_ShoutList);
}


function fn_show_ShoutList(event, data) {

  	stopRefresh();
  	
  	$('#shootFooter').show();

	var id_member = window.localStorage.getItem("id_member");
	var auth_token = window.localStorage.getItem("auth_token");
	
	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");
	var prevPage = window.localStorage.getItem("prevPage");
	
	var nbShouts = $("#ULShoutList li").size();
	if ( nbShouts == 0 ) {

		$('#ULShoutList').children().remove('li');
		$('#loadingMessages').modal('show');
		$("#last_update").val('0');

		get_shoutbox_infos();

		var firstRefresh = true;
		startRefresh(firstRefresh);

	} else {

		startRefresh();

	}
	
	window.localStorage.setItem("prevPage", "shoutslist");

}

function fn_hide_ShoutList() {
	stopRefresh();
	$('#shootFooter').hide();
}

function fn_click_btn_refreshShouts() {
	var loading = true;
	refresh_shoutlist(loading);	
}

function fn_emptytext() {
	$('#shouttext').val('');	
}

function fn_sendshout(e) {

	e.preventDefault();

	var shouttext = $('#shouttext').val();
	var id_shoutbox = window.localStorage.getItem("id_shoutbox");
	var id_member = window.localStorage.getItem("id_member");
	var real_name = window.localStorage.getItem("real_name");
	var auth_token = window.localStorage.getItem("auth_token");

	if ( shouttext.length > 0 ) {

		$.ajax({url: baseApiUrl + 'shoutbox/shoutpost',
			type: 'post',
			data: {'auth_token': auth_token, 'id_member': id_member, 'real_name': real_name, 'id_shoutbox': id_shoutbox, 'msg_txt': shouttext},
			async: true,
			beforeSend: function() {
				$('#miniloader').show();
			},
			complete: function() {
				$('#shouttext').val('');
				$('#miniloader').hide();
			},
			success: function (responseText) {				
				var loading = false;
				refresh_shoutlist(loading);				
			},
			error: function (responseText) {
				$('#miniloader').hide();
				$('#content').load('html/connexion.html', fn_showSwitch);
				$('#erreur_connexion').show();
			}
		});


	}

	return false;

}

function fn_tapInShoutList(event) {	
	var id_shout = $(event.target).closest('li').attr('data-name');		
	popupDeleteShout(id_shout);	
}

function popupDeleteShout(id_shout) {		

	var id_group = window.localStorage.getItem("id_group");

	if ( id_group > 0 && id_group < 3 && id_shout ) {

		// mets à jour id_shout dans le form du popup
		$('#idShoutHidden').val(id_shout);

		// affiche un pop-up de confirmation
		$('#confirmDeleteShout').modal('show');

	} else {
		alert('Vous n\'avez pas les droits necessaires ou l\'identifiant du message n\'est pas correctement formé.')		
	}

}

function fn_confirmDeleteShout() {
	var id_group = window.localStorage.getItem("id_group");
	var id_shout = $('#idShoutHidden').val();

	if ( id_group > 0 && id_group < 3 && id_shout ) {

		var id_shoutbox = window.localStorage.getItem("id_shoutbox");
		var id_member = window.localStorage.getItem("id_member");
		var auth_token = window.localStorage.getItem("auth_token");
		
		$('#confirmDeleteShout').modal('hide');

		$.ajax({url: baseApiUrl + 'shoutbox/shoutdelete',
			type: 'post',
			data: {'auth_token': auth_token, 'id_member': id_member, 'id_shout': id_shout, 'id_shoutbox': id_shoutbox},
			async: true,
			beforeSend: function() {
				$('#miniloader').show();
			},
			complete: function() {
				$('#miniloader').hide();
			},
			success: function (responseText) {
				$('li.LIShoutList[data-name="' + id_shout + '"]').remove();
			},
			error: function (responseText) {             
				$('#miniloader').hide();
				$('#content').load('html/connexion.html', fn_showSwitch);
				$('#erreur_connexion').show();
			}
		});

	}	
}

function fn_click_cancelDeleteShout() {
	$('#confirmDeleteShout').modal('hide');
}

function fn_click_smileyslist() {
	// affiche popup smileys
	$('#pop_smileysList').modal('show');
}

function fn_click_ULsmileyslist(e) {
	var id_smiley = $(e.target).closest('div').attr('data-name');
	$('#shouttext').val($('#shouttext').val() + ' ' + id_smiley + ' ');	
}

function fn_click_btn_closeSmileyslist() {
	$('#pop_smileysList').modal('hide');
}

function displayUserInfos() {

	var real_name = window.localStorage.getItem("real_name");
	var avatar = window.localStorage.getItem("avatar");
	var id_group = window.localStorage.getItem("id_group");
	var isvip = window.localStorage.getItem("isvip");
	var isadmin = window.localStorage.getItem("isadmin");
	var unread_messages = window.localStorage.getItem("unread_messages");
	var name_color = window.localStorage.getItem("name_color");
	var name_color_glow = window.localStorage.getItem("name_color_glow");
	var money = window.localStorage.getItem("money");
	var posts = window.localStorage.getItem("posts");

	var group_title = 'Membre';
	var vip_title = 'Non VIP';
	if ( isadmin == "true" ) { group_title = "Administrateur"; } else if ( id_group == 2 ) { group_title = "Mod&eacute;rateur"; }
	if ( isvip == "true" ) { vip_title = "VIP"; }

	$('.MemberInfos').empty();

	$('#ULMemberInfos1').html('<img src="' + avatar + '" class="img-polaroid" />');
	$('#ULMemberInfos2').html('<b style="color:' + name_color + '; text-shadow:0px 0px 2px ' + name_color_glow + ';">' + real_name + '</b><br />' + group_title + ' ' + vip_title + '<br />' + unread_messages + ' message(s) non lu(s)<br />' + posts + ' message(s)<br />' + money + ' point(s)');

	
}

function fn_click_btn_showShoutboxsList() {
	$('#content').load('html/shoutboxslist.html', fn_show_ShoutboxList);
}
