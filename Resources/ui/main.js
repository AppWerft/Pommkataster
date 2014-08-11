module.exports = function() {
	Ti.UI.iOS.createNavigationWindow({
		window : require('ui/map.window')()
	}).open();
};
