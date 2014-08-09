var Map = require('com.appmodulator.offline');
module.exports = function() {
	var self = Ti.UI.createWindow();
	self.mapview = Map.createView({
		location : {
			latitude : 50.156,
			longitude : 8.7657,
		},
		zoom : 17,
		width : 1500,
		height : 1500,
		mbtile : 'model/enkheim',
	});
	self.add(self.mapview);
	self.mapview.addEventListener('click', function(e) {
		console.log(e);
	});
	setInterval(function() {
		console.log(self.mapview);
		console.log(JSON.stringify(self.mapview));
	}, 1000);

	return self;
};
