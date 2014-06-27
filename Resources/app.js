//The app could not added to your itunes library there is not enough memory available
var mapwindow = require('ui/offmap.window')();

if (Ti.UI.iPad) {
	var detailNav = Ti.UI.iOS.createNavigationWindow({
		window : mapwindow
	});
	var master = Ti.UI.createWindow({
		backgroundColor : 'gray'
	});
	var masterNav = Ti.UI.iOS.createNavigationWindow({
		window : master
	});
	var splitWin = Ti.UI.iPad.createSplitWindow({
		detailView : detailNav,
		masterView : masterNav
	});
	splitWin.addEventListener('visible', function(e) {
		if (e.view == 'detail') {
			e.button.title = "Datenbank";
			mapwindow.leftNavButton = e.button;
		} else if (e.view == 'master') {
			mapwindow.leftNavButton = null;
		}
	});
	splitWin.open();
} else
	mapwindow.open();
