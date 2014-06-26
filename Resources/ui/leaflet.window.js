module.exports = function() {
	var self = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	var leaflet = Ti.UI.createWebView({
		url : '/leaflet/app.html',
		disableBounce : true
	});
	self.add(leaflet);
	return self;
};
