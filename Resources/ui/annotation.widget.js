var Map = require('ti.map');
module.exports = function(_pin) {
	var self = Map.createAnnotation({
		latitude : _pin.latitude,
		id: _pin.id,
		draggable : false,
		longitude : _pin.longitude,
		title : _pin.sorte,
		leftButton : 'assets/edit.png',
		subtitle : '#' + _pin.baumplakettennummer,
		image : '/assets/tree.png'
	});
	return self;
};
