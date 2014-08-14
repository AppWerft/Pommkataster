var Map = require('ti.map');

/* make an exist annotation to active annotation */
exports.activateAnnotation = function(_mapview, _a) {
	_mapview.removeAnnotation(_a);
	_mapview.activepin = Map.createAnnotation({
		latitude : _a.latitude,
		ref : _a.ref,
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
/* create a new, active annotation */
exports.createactiveAnnotation = function(_mapview, Apiomat,_lat, _lng) {
	
	
	/* obwohl der factory Zweig nicht durchlaufen wird, ist Apiomat.currenttree leer */
	_mapview.activepin = Map.createAnnotation({
		latitude : _lat,
		draggable : true,
		longitude : _lng,
		pincolor : Map.ANNOTATION_RED,
		title : 'unbekannte Obstsorte',
		subtitle : ''
	});
	_mapview.addAnnotation(_mapview.activepin);
	_mapview.activepin.addEventListener('pinchangedragstate', function(_a) {
		if (_a.newState == Map.ANNOTATION_DRAG_STATE_END) {
			Apiomat.setPropertyOfCurrentTree('latitude', _a.annotation.latitude);
			Apiomat.setPropertyOfCurrentTree('longitude', _a.annotation.longitude);
		}
	});
	return _mapview.activepin;
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
