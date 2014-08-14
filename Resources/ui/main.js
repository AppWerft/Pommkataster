module.exports = function(Apiomat) {
	Ti.UI.iOS.createNavigationWindow({
		window : require('ui/map.window')(Apiomat)
	}).open();
};
