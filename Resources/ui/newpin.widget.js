var Map = require('ti.map');
module.exports = function(mapview) {
	Ti.Geolocation.purpose = 'Apfelbaumstandort bestimmen';
	Ti.Geolocation.getCurrentPosition(function(e) {
		if (e.success) {
			var position = [parseFloat(e.coords.latitude), parseFloat(e.coords.longitude)];
			mapview.activepin = require('ui/activepin').createactiveAnnotation(self.mapview_e.annotation);
			if (baum) {
				baum.latitude = position[0];
				baum.longitude = position[1];
			}
			mapview.activepin.addEventListener('pinchangedragstate', function(_e) {
				console.log('Info: dragend of active pin');
				baum.latitude = parseFloat(_e.annotation.latitude);
				baum.longitude = parseFloat(_e.annotation.longitude);
			});
			mapview.setLocation({
				latitude : position[0],
				longitude : position[1],
				latitudeDelta : 0.002,
				longitudeDelta : 0.002,
				animate : true
			});
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
