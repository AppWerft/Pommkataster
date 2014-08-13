var Map = require('ti.map');

exports.activateAnnotation = function(_mapview, _a) {
	_mapview.removeAnnotation(_a);
	_mapview.activepin = Map.createAnnotation({
		latitude : _a.latitude,
		draggable : true,
		longitude : _a.longitude,
		pincolor : Map.ANNOTATION_RED,
		itemId : _a.itemId,
		title : _a.title,
		subtitle : _a.subtitle
	});
	_a = null;
	_mapview.addAnnotation(_mapview.activepin);
};

exports.createactiveAnnotation = function(_mapview, _lat, _lng) {
	_mapview.activepin = Map.createAnnotation({
		latitude : _lat,
		draggable : true,
		longitude : _lng,
		pincolor : Map.ANNOTATION_RED,
		title : '',
		subtitle : ''
	});
	_mapview.addAnnotation(_mapview.activepin);
};

exports.deactivateAnnotation = function(_mapview, _restore) {
	_mapview.removeAnnotation(_mapview.activepin);
	if (_mapview.activepin.itemId) {
		var pin = Map.createAnnotation({
			latitude : (_restore) ? _mapview.activepin.itemId.latitude : _mapview.activepin.latitude,
			longitude : (_restore) ? _mapview.activepin.itemId.longitude : _mapview.activepin.longitude,
			image : 'assets/tree.png',
			leftButton : 'assets/edit.png',
			itemId : _mapview.activepin.itemId,
			draggable : false,
			title : _mapview.activepin.title,
			subtitle : _mapview.activepin.subtitle
		});
		_mapview.addAnnotation(pin);
	}
	_mapview.removeAnnotation(_mapview.activepin);
	_mapview.activepin = null;
};
