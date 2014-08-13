module.exports = function(parent) {
	var self = Ti.UI.createView({
		backgroundColor : '#ccffcc',
		width : 220,
		left : -300,
		bottom : 0,
		top : 0
	});
	var navi = Ti.UI.createView({
		top : 0,
		height : 45
	});
	self.add(navi);
	self.savebutton = Ti.UI.createButton({
		title : 'Speichern',
		right : 10
	});
	self.cancelbutton = Ti.UI.createButton({
		title : 'Abbrechen',
		left : 10
	});
	navi.add(self.savebutton);
	navi.add(self.cancelbutton);
	var container = Ti.UI.createScrollView({
		height : Ti.UI.FILL,
		right : 10,
		width : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.FILL,
		layout : 'vertical',
		top : 30
	});
	self.add(container);
	var pommesdata = require('model/pommes');
	var pommes = [];
	var data = [];

	for (var i = 0; i < pommesdata.length; i++) {
		pommes.push(pommesdata[i].div[0].a.title);
	}
	pommes.sort();
	pommes.unshift('unbekannte Obstsorte');
	var index = 0;
	for (var i = 0; i < pommes.length; i++) {
		data.push(Ti.UI.createPickerRow({
			title : pommes[i]
		}));
		if (parent.tree.sorte && pommes[i] == parent.tree.sorte)
			index = i;
	}
	var picker = Ti.UI.createPicker({
		top : 0,
		left : 0,
		right : 0,
		transform : Ti.UI.create2DMatrix({
			scale : 0.9
		})
	});
	picker.add(data);
	picker.selectionIndicator = true;
	if (parent.tree.sorte) {
		picker.setSelectedRow(0, index);
	}
	picker.addEventListener('change', function(_e) {
		parent.tree.sorte = _e.selectedValue[0];
		Ti.App.fireEvent('app:tree', {
			sorte : _e.selectedValue[0]
		});
	});
	container.add(picker);

	var textinputs = {
		flurstueck : {
			label : "Flurstück"
		},
		plakettennummer : {
			label : "Baumplakettennummer",
			keyboardtype : Ti.UI.KEYBOARD_DECIMAL_PAD
		},
		pflanzjahr : {
			label : 'Pflanzjahr des Baumes',
			keyboardtype : Ti.UI.KEYBOARD_DECIMAL_PAD
		},
		arbeitstitel : {
			label : 'Arbeitstitel'
		},
		baumhoehe : {
			label : 'Höhe des Baumes',
			keyboardtype : Ti.UI.KEYBOARD_DECIMAL_PAD
		},
		baumumfang : {
			label : 'Umfang des Baumes in 1 m Höhe',
			keyboardtype : Ti.UI.KEYBOARD_DECIMAL_PAD
		},
		flurstueck : {
			label : 'Flurstück'
		},
		pflegezustand : {
			label : 'Pflegezustand'
		}
	};
	for (var key in textinputs) {
		textinputs[key].view = new (require('ui/textfield.widget'))(parent.tree, {
			key : key,
			label : textinputs[key].label,
		});
		container.add(textinputs[key].view);
	}
	self.cancelbutton.addEventListener('click', function() {
		parent.leftNavButton = parent.popupbutton;
		self.animate({
			left : -300
		}, function() {
			require('ui/activepin.widget').deactivateAnnotation(parent.mapview, true);
			parent.mapview.popup = null;
			parent.remove(self);
			parent.tree = null;
			self = null;
		});
	});
	self.savebutton.addEventListener('click', function() {
		// save to cloud:
		Ti.App.Apiomat.saveBaum(parent.tree);
		// save to map:
		/*Ti.App.fireEvent('app:tree', {
		itemId : parent.tree
		});*/
		// restore button:
		if (!parent.tree)
			parent.getAllTrees();
		parent.leftNavButton = parent.popupbutton;
		require('ui/activepin.widget').deactivateAnnotation(parent.mapview, false);
		// hiding of panel
		self.animate({
			left : -300,
			duration : 700
		}, function() {
			parent.remove(self);
			parent.mapview.popup = null;
			self = null;
		});
	});
	return self;
};
