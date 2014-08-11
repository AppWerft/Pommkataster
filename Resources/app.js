! function() {
	Ti.App.Apiomat = new (require('controls/apiomat.adapter'))({
		ononline : function() {
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
			Ti.App.Apiomat.loginUser();
			require('ui/main')();
		},
		onoffline : function() {
			console.log('Warning: offline');
			alert('Diese App braucht Internetverbindung.');
		}
	});
}();
