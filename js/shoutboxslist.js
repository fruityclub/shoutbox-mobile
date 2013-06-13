$(document).on('pageshow', '#ShoutboxList', fn_show_ShoutboxList);
$(document).on('vclick', 'li.LIShoutboxList', fn_click_LIShoutboxList);

function fn_show_ShoutboxList(event, data) {

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

	stopRefresh();
	$("#last_update").val('0');

	var group_title = 'Membre';
	var vip_title = 'Non VIP';
	if ( isadmin == "true" ) { group_title = "Administrateur"; } else if ( id_group == 2 ) { group_title = "Mod&eacute;rateur"; }
	if ( isvip == "true" ) { vip_title = "VIP"; }

	$('.MemberInfos').empty();

	$('#ULMemberInfos1').html('<img src="' + avatar + '" height="76" style="border: 2px solid white;" />');
	$('#ULMemberInfos2').html('<b style="color:' + name_color + '; text-shadow:0px 0px 2px ' + name_color_glow + ';">' + real_name + '</b><br />' + group_title + ' ' + vip_title + '<br />' + unread_messages + ' message(s) non lu(s)<br />' + posts + ' message(s)<br />' + money + ' point(s)');

	var nbShoutboxs = $("#ULShoutboxList li").size();

	if ( data.prevPage.attr("id") != "ShoutList" || nbShoutboxs == 0 ) {

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
				$("#ULShoutboxList").empty();
				$('#ULShoutboxList').listview();
				var shoutboxsList = '';
				$.each( responseText, function( i, item ) {
					shoutboxsList += '<li data-icon="arrow-r" class="LIShoutboxList" data-name="' + item.id_shoutbox + '"><a href="#">';
					shoutboxsList += item.name;
					shoutboxsList += '</a></li>';
				});
				$("#ULShoutboxList").append( shoutboxsList );

			},
			error: function (responseText) {             
				$.mobile.loading( 'hide' );
				$('#erreur_connexion').show();
			}
		});

	}

}

function fn_click_LIShoutboxList() {
	console.log('fn_click_LIShoutboxList');
	var id_shoutbox = $(this).attr('data-name');
	window.localStorage.setItem("id_shoutbox", id_shoutbox);
	$.mobile.changePage($('#ShoutList'));	
}
