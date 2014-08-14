! function() {
	var Apiomat = require('controls/apiomat.adapter')( {
		ononline : function() {
		},
		onoffline : function() {
			console.log('Warning: offline');
			alert('Diese App braucht Internetverbindung.');
		}
	});
	if (!Ti.App.Properties.getString('pid')) {
		var dialog = Ti.UI.createAlertDialog({
			message : 'Bitte tragen Sie hier die gewünschte Projektnummer ein:',
			ok : 'Ok',
			style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
			title : 'Projekt-Nummer'
		});
		dialog.show();
		dialog.addEventListener('click', function(e) {
			Ti.App.Properties.setString('pid', e.text);
		});
	}
	
	require('ui/main')(Apiomat);
}();
