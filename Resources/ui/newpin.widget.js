var Map = require('ti.map');
module.exports = function(mapview,Apiomat) {
	Ti.Geolocation.purpose = 'Apfelbaumstandort bestimmen';
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.success) {
			var position = [parseFloat(e.coords.latitude), parseFloat(e.coords.longitude)];
			require('ui/activepin.widget').createactiveAnnotation(mapview,Apiomat,e.coords.latitude,e.coords.longitude);
			mapview.setLocation({
				latitude : position[0],
				longitude : position[1],
				latitudeDelta : 0.002,
				longitudeDelta : 0.002,
				animate : true
			});
			
			Apiomat.setPropertyOfCurrentTree('latitude',position[0]);
			Apiomat.setPropertyOfCurrentTree('longitude',position[1]);
			
			mapview.addAnnotation(mapview.activepin);
			Ti.App.addEventListener('app:tree', function(_e) {
				_e.sorte && mapview.activepin.setTitle(_e.sorte);
				_e.arbeitstitel && mapview.activepin.setSubtitle(_e.arbeitstitel);
				if (_e.remove == true) {
					mapview.removeAnnotation(mapview.activepin);
					mapview.activepin = null;
				}

			});
			mapview.selectAnnotation(mapview.activepin);

		}
	});
	return mapview.activepin;
};
