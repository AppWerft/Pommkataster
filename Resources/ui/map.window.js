var Map = require('ti.map');

module.exports = function() {
	var baum = {
		sorte : ''
	};
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		fullscreen : true,
		title : 'Streuobst-Karte #' + Ti.App.Properties.getString('pid', '')
	});
	self.popupbutton = Ti.UI.createButton({
		width : 26,
		height : 30,
		backgroundImage : 'assets/tree.png'
	});
	self.leftNavButton = self.popupbutton;

	self.popupbutton.addEventListener('click', function() {
		self.mapview.popup = require('ui/entry.window')(self, baum);
		self.leftNavButton = null;
		self.add(self.mapview.popup);
		self.mapview.popup.animate({
			left : 0
		});
		self.mapview.activepin = require('ui/activeannotation.widget')(self.mapview, baum, true);
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
	setTimeout(function() {
		self.add(self.mapview);
		self.add(massstab);
		Ti.App.Apiomat.getAllTrees(null, function(_trees) {
			var annotations = [];
			for (var id in _trees) {
				annotations.push(require('ui/annotation.widget')(_trees[id]));
			}
			self.mapview.addAnnotations(annotations);
		});
		self.mapview.addEventListener('click', function(_e) {
			console.log('Info: clicksource='+_e.clicksource);
			if (!self.mapview.popup && _e.annotation && _e.clicksource == 'leftButton') {
				baum = _e.annotation.itemId;
				self.mapview.popup = require('ui/entry.window')(self, baum);
				self.leftNavButton = null;
				self.add(self.mapview.popup);
				Ti.App.addEventListener('app:tree', function(_payload) {
					if (_payload.itemId)
						_e.annotation.itemId = _payload.itemId;
					_payload.sorte && _e.annotation.setTitle(_payload.sorte);

					_payload.arbeitstitel && _e.annotation.setSubtitle(_payload.arbeitstitel);
				});
				self.mapview.popup.animate({
					left : 0
				});
				var logo = Ti.UI.createImageView({
					top : 0,
					right : 0,
					width : 100,
					height : 120,
					image : 'assets/logo.png',
					opacity : 0.6,
					touchEnabled : false
				});
				self.mapview.add(logo);
			} else {
				console.log('Warning: map always actives');
			}
		});
	}, 200);
	return self;
};
