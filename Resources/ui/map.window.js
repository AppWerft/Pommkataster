var MapNF = require('ti.map');

module.exports = function() {
	var self = Ti.UI.createWindow({
		backgroundColor : 'white'
	});
	var mbtilesDB = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'assets', 'enkheim.mbtiles').nativePath;
	console.log(mbtilesDB);
	self.mapview = MapNF.createView({
		
		enableZoomControls : false,
		animate : true,
		regionFit : true,
		region : {   
			latitude : 50.1559955,
			longitude : 8.7657151,
			animate : true,
			latitudeDelta : 0.005,
			longitudeDelta : 0.005
		},
		tileDB : mbtilesDB,
		userLocation : true
	});
	setTimeout(function() {
		self.add(self.mapview);
	}, 1200);
	return self;
};
