//The app could not added to your itunes library there is not enough memory available

var MapNavWindow = Ti.UI.iOS.createNavigationWindow({
	window : require('ui/map.window')()
});
//require('controls/converter')();

MapNavWindow.open();
