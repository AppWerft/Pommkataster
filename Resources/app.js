var mapwindow = require('ui/map.window')();
var detailNav = Ti.UI.iOS.createNavigationWindow({
	window : mapwindow
});

var master = Ti.UI.createWindow({
	backgroundColor : 'gray'
});
var label2 = Ti.UI.createLabel({
	text : 'Master View'
});


master.add(label2);
var masterNav = Ti.UI.iOS.createNavigationWindow({
	window : master
});

var splitWin = Ti.UI.iPad.createSplitWindow({
	detailView : detailNav,
	masterView : masterNav
});

splitWin.addEventListener('visible', function(e) {
	if (e.view == 'detail') {
		e.button.title = "Master";
		mapwindow.leftNavButton = e.button;
	} else if (e.view == 'master') {
		mapwindow.leftNavButton = null;
	}
});

splitWin.open(); 