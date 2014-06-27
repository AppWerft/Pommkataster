var Map = require('com.appmodulator.offline');
module.exports = function() {
	var self = Ti.UI.createWindow();
	self.mapview = Map.createView({
		location : {
			latitude : 50.156,
			longitude : 8.7657,
		},
		zoom : 17,
		mbtile : 'ui/enkheim',
	});
	self.add(self.mapview);
	return self;
};
