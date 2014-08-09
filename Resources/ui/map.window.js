var Map = require('ti.map');

module.exports = function() {
	var button = Ti.UI.createButton({
		title : 'Baum hinzufügen',
		image : 'assets/tree.png'
	});
	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		fullscreen : true,
		leftNavButton : button,
		fullscreen : true,
		title : 'Streuobst-Karte',
		navBarHidden : false
	});
	var popup = require('ui/entry.window')(null);

	popup.cancelbutton.addEventListener('click', function() {
		self.leftNavButton = button;
		popup.animate({
			left : -300
		}, function() {
			if (self.mapview.activepin) {
				self.mapview.removeAnnotation(self.mapview.activepin);
				self.mapview.activepin = null;
			}
			self.remove(popup);
		});
	});
	button.addEventListener('click', function() {
		self.leftNavButton = null;
		self.add(popup);
		popup.animate({
			left : 0
		});
		Ti.Geolocation.purpose = 'Apfelbaumstandort bestimmen';
		Ti.Geolocation.getCurrentPosition(function(e) {
			if (e.success) {
				self.mapview.activepin = Map.createAnnotation({
					latitude : e.coords.latitude,
					draggable : true,
					longitude : e.coords.longitude,
					title : 'Apfelbaum',
					subtitle : '#',
					pincolor : Map.ANNOTATION_GREEN
					//	image : '/assets/tree.png',
				});

				self.mapview.setLocation({
					latitude : e.coords.latitude,
					longitude : e.coords.longitude,
					latitudeDelta : 0.002,
					longitudeDelta : 0.002,
					animate : true
				});
				self.mapview.addAnnotation(self.mapview.activepin);
				Ti.App.addEventListener('app:tree', function(_e) {
					console.log(_e);
					_e.sorte && self.mapview.activepin.setTitle(_e.sorte);
					_e.arbeitstitel && self.mapview.activepin.setSubtitle(_e.arbeitstitel);
					if (_e.remove == true) {
						self.mapview.removeAnnotation(self.mapview.activepin);
						self.mapview.activepin = null;
					}

				});
				self.mapview.selectAnnotation(self.mapview.activepin);

			}
		});
	});

	self.mapview = Map.createView({
		mapType : Map.HYBRID_TYPE,
		region : {
			latitude : 50.1559955,
			longitude : 8.7657151,
			latitudeDelta : 0.02,
			longitudeDelta : 0.02
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
		width : 200,
		opacity : 0.7,
		text : '1:',
		backgroundColor : 'white'
	});
	self.mapview.addEventListener('regionchanged', function(_e) {
		const SCREENWIDTH_PAD = 0.2;
		// Meter
		var mapwidth = Math.round(parseFloat(_e.longitudeDelta) * 40000 / 360);
		// Breite in Metern
		massstab.setText(' 1 : ' + (mapwidth / SCREENWIDTH_PAD).toFixed(1) + ' Tausend');

	});
	setTimeout(function() {
		self.add(self.mapview);
		self.add(massstab);
	}, 200);
	return self;
};
