var Map = require('ti.map');
module.exports = function(_pin) {
	var self = Map.createAnnotation({
		latitude : _pin.latitude,
		draggable : false,
		longitude : _pin.longitude,
		title : _pin.sorte,
		itemId : _pin,
		leftButton : 'assets/edit.png',
		subtitle : '#' + _pin.baumplakettennummer,
		//pincolor : Map.ANNOTATION_GREEN
		image : '/assets/tree.png'
	});
	return self;
};
