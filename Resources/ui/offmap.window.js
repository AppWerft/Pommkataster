var Map = require('com.appmodulator.offline');
module.exports = function() {
	var self = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	self.mapview = Map.createView({
		//regionFit : true,   
		location : {
			latitude : 50.156,
			longitude : 8.7657,
		},
		zoom : 17,
		mbtile : 'enkheim',
	});
	setTimeout(function() {
		self.add(self.mapview);
	}, 1200);
	return self;
};
