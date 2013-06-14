$(document).on('pageshow', '#ShoutList', fn_show_ShoutList);
$(document).on('pagehide', '#ShoutList', fn_hide_ShoutList);
$(document).on('taphold', '#ULShoutList', fn_tapInShoutList);
$(document).on('vclick', '#btn_refreshShouts', fn_click_btn_refreshShouts);
$(document).on('vclick', '#btn_emptytext', fn_emptytext);
$(document).on('vclick', '#submittext', fn_sendshout);
$(document).on('submit', '#formaddshout', fn_sendshout);
$(document).on('vclick', '#smileyslist', fn_click_smileyslist);
$(document).on('vclick', '#ULsmileyslist', fn_click_ULsmileyslist);
$(document).on('vclick', '#btn_confirmDeleteShout', fn_confirmDeleteShout);

function fn_show_ShoutList(event, data) {

  stopRefresh();

	var id_member = window.localStorage.getItem("id_member");
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
	var auth_token = window.localStorage.getItem("auth_token");
	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");

	var nbShouts = $("#ULShoutList li").size();

	if ( data.prevPage.attr("id") != "config" || nbShouts == 0 ) {

		console.log('data.prevPage.attr ShoutboxList');

		var group_title = 'Membre';
		var vip_title = 'Non VIP';
		if ( isadmin == "true" ) { group_title = "Administrateur"; } else if ( id_group == 2 ) { group_title = "Mod&eacute;rateur"; }
		if ( isvip == "true" ) { vip_title = "VIP"; }

		$('.MemberInfos').empty();	
		$('#ULMemberInfos3').html('<img src="' + avatar + '" height="76" style="border: 2px solid white;" />');
		$('#ULMemberInfos4').html('<b style="color:' + name_color + '; text-shadow:0px 0px 2px ' + name_color_glow + ';">' + real_name + '</b><br />' + group_title + ' ' + vip_title + '<br />' + unread_messages + ' message(s) non lu(s)<br />' + posts + ' message(s)<br />' + money + ' point(s)');

		$('#ULShoutList').listview();
		$('#ULShoutList').children().remove('li');
		$("#loadingMessages").popup("open");	
		$("#last_update").val('0');

		get_shoutbox_infos();

		var firstRefresh = true;
		startRefresh(firstRefresh);

	} else {

		startRefresh();

	}

}

function fn_hide_ShoutList() {
	stopRefresh();
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
				var loading = false;
				refresh_shoutlist(loading);				
			},
			error: function (responseText) {             
				$.mobile.loading( 'hide' );
				$.mobile.changePage($('#Connexion1'));
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
		$("#confirmDeleteShout").popup("open");

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

		$("#confirmDeleteShout").popup("close");

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
				$.mobile.loading( 'hide' );
				$.mobile.changePage($('#Connexion1'));
				$('#erreur_connexion').show();
			}
		});

	}	
}

function fn_click_smileyslist() {
	// affiche popup smileys
	$("#pop_smileysList").popup("open");	
}

function fn_click_ULsmileyslist(e) {
	var id_smiley = $(e.target).closest('div').attr('data-name');
	$('#shouttext').val($('#shouttext').val() + ' ' + id_smiley + ' ');
	$("#pop_smileysList").popup("close");	
}
