function vibrateOnNewMEssages() {
  if (typeof(deviceReady) != "undefined" && deviceReady !== null) {
		navigator.notification.vibrate(1000);
	}
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
			$.mobile.loading( 'show', { theme: "b", text: "Recuperation d'informations ...", textVisible: true });
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
		},
		error: function (responseText) {

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
	$.ajax({url: 'https://www.fruityclub.net/api/index.php/shoutbox/shoutlist',
		type: 'post',
		data: {'auth_token': auth_token, 'id_member': id_member, 'id_shoutbox': id_shoutbox, 'last_update': last_update1},
		async: true,
		beforeSend: function() {
			if ( loading == true ) { $.mobile.loading( 'show', { theme: "b", text: "Mise à jour des messages ...", textVisible: true }); }
		},
		complete: function() {
			if ( loading == true ) { $.mobile.loading( 'hide' ); $("#loadingMessages").popup("close"); }
			$('#ULShoutList').listview('refresh');

			var last_update2 = $('#ULShoutList li').last().attr('data-name');
			$("#last_update").val(last_update2);

			$(".linkInMessage").each(function() {

			  var hrefUrl = $(this).attr('href');
			  var hrefInfos = $.mobile.path.parseUrl(hrefUrl);

			  var hrefHost = hrefInfos.hostname;
			  $(this).text(hrefHost);

			});
		},
		success: function (responseText) {
			if ( loading == true ) { $("#ULShoutList").empty(); }
			if (typeof(responseText) != "undefined" && responseText !== null) {
				if ( responseText.length > 0) {	
					var shoutsList = '';
					$.each( responseText, function( i, item ) {
						shoutsList += '<li class="LIShoutList" data-name="' + item.log_time + '" data-inset="true">';
						shoutsList += '<img src="' + item.avatar + '" width="76" height="76" style="border: 2px solid white;" />';						
						shoutsList += '<b style="color:' + item.name_color + '; text-shadow:0px 0px 2px ' + item.name_color_glow + ';">' + item.member_name + '</b><br /><span style="font-size:' + msg_size + 'px;">' + item.body + '</span>';
						shoutsList += '</li>';
					});
					$("#ULShoutList").append( shoutsList );
					if ( vibration_msg == 1 ) { 
						vibrateOnNewMEssages(); 
					}
				}
			}
		},
		error: function (responseText) {             
			$.mobile.loading( 'hide' );
			$.mobile.changePage($('#Connexion1'));
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
