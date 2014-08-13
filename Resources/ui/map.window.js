var Map = require('ti.map');

module.exports = function() {
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		fullscreen : true,
		tree : {},
		title : 'Streuobst-Karte #' + Ti.App.Properties.getString('pid', '')
	});
	self.getAllTrees = function() {
		Ti.App.Apiomat.getAllTrees(null, function(_trees) {
			var annotations = [];
			for (var id in _trees) {
				annotations.push(require('ui/annotation.widget')(_trees[id]));
			}
			self.mapview.removeAllAnnotations();
			self.mapview.addAnnotations(annotations);
		});
	};

	/* button for creating new tree */
	self.popupbutton = Ti.UI.createButton({
		width : 26,
		height : 30,
		backgroundImage : 'assets/tree.png'
	});
	self.leftNavButton = self.popupbutton;

	self.popupbutton.addEventListener('click', function() {
		self.mapview.popup = require('ui/entry.window')(self);
		self.leftNavButton = null;
		self.add(self.mapview.popup);
		self.mapview.popup.animate({
			left : 0
		});
		self.mapview.activepin = require('ui/newpin.widget')(self.mapview, true);
	});
	self.mapview = Map.createView({
		mapType : Map.HYBRID_TYPE,
		popup : null,
		region : {
			latitude : 50.1559955,
			longitude : 8.7657151,
			latitudeDelta : 1,
			longitudeDelta : 1
		},
		animate : true,
		regionFit : true,
		userLocation : false,
		annotations : []
	});
	var massstab = Ti.UI.createLabel({
		bottom : 0,
		right : 0,
		height : 30,
		width : Ti.UI.SIZE,
		opacity : 0.7,
		text : '1:',
		backgroundColor : 'white'
	});
	self.mapview.addEventListener('regionchanged', function(_e) {
		const SCREENWIDTH_PAD = 0.197;
		// Meter
		var mapwidth = parseFloat(_e.longitudeDelta) * 40000 / 360;
		// Breite in Metern
		massstab.setText(' 1 : ' + (mapwidth / SCREENWIDTH_PAD).toFixed(1) + ' Tausend ');

	});

	self.add(self.mapview);
	self.add(massstab);
	var logo = Ti.UI.createImageView({
		top : 0,
		right : 0,
		width : 200,
		height : 200,
		image : 'assets/logo.png',
		opacity : 0.1,
		touchEnabled : false
	});
	logo.animate({
		opacity : 0.6,
		duration : 2000
	});
	self.mapview.add(logo);

	self.mapview.addEventListener('click', function(_e) {
		console.log('Info: clicksource=' + _e.clicksource);
		if (!self.mapview.popup && _e.annotation && _e.clicksource == 'leftButton') {
			self.tree = _e.annotation.itemId;
			self.mapview.popup = require('ui/entry.window')(self);
			self.leftNavButton = null;
			self.add(self.mapview.popup);
			require('ui/activepin.widget').activateAnnotation(self.mapview, _e.annotation);
			Ti.App.addEventListener('app:tree', function(_payload) {
				if (_payload.itemId)
					self.mapview.activepin.itemId = _payload.itemId;
				return;
				_payload.sorte && self.mapview.activepin.setTitle(_payload.sorte);
				_payload.arbeitstitel && self.mapview.activepin.setSubtitle(_payload.arbeitstitel);
			});
			self.mapview.popup.animate({
				left : 0
			});

		} else {
			console.log('Warning: map always actives');
		}
	});
	self.getAllTrees();
	return self;
};
