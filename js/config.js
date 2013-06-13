$(document).on('pageshow', '#config', fn_show_config);
$(document).on('vclick', '#btn_autoLogConfig', fn_del_autolog);
$(document).on('vclick', '#submit_config', fn_submit_config);
$(document).on('vclick', '#btn_confirmConfig', fn_click_btn_confirmConfig);

function fn_show_config() {

  stopRefresh();

	var vibration_msg = window.localStorage.getItem("vibration_msg");
	var msg_size = window.localStorage.getItem("msg_size");

	// mets valeurs par défaut si existe	
	if ( !vibration_msg ) { vibration_msg = 0; }
	if ( !msg_size ) { msg_size = 12; }

	$('input:radio[name="msg_size"]').filter('[value="' + msg_size + '"]').next().click();
	$('#vibration_msg').val(vibration_msg);
	$('#vibration_msg').slider('refresh');

}

function fn_del_autolog() {
	window.localStorage.removeItem("email");
	window.localStorage.removeItem("password");
	window.localStorage.removeItem("secretkey");

	$("#popup_confirmAutolog").popup("open");
}

function fn_submit_config() {

	var vibration_msg = $('#vibration_msg').val();
	var msg_size = $("input[name=msg_size]:checked").val();

	window.localStorage.setItem("vibration_msg", vibration_msg);
	window.localStorage.setItem("msg_size", msg_size);	

	$("#popup_confirmConfig").popup("open");

}

function fn_click_btn_confirmConfig() {

	$("#popup_confirmConfig").popup("close");

	if (typeof(window.localStorage.getItem("id_shoutbox")) != "undefined" && window.localStorage.getItem("id_shoutbox") !== null) {
		$.mobile.changePage($('#ShoutList'));
	} else {	
		$.mobile.changePage($('#ShoutboxList'));
	}	

}
