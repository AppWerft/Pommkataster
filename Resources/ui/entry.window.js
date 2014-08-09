module.exports = function() {
	var self = Ti.UI.createView({
		backgroundColor : '#ccffcc',
		title : 'Baum-Datensatz',
		width : 300,
		left : -300,
		bottom : 20,
		top : 20
	});
	var navi = Ti.UI.createView({
		top : 0,
		height : 50
	});
	self.add(navi);
	var tree = {};
	self.savebutton = Ti.UI.createButton({
		title : 'Speichern',
		right : 10
	});
	self.cancelbutton = Ti.UI.createButton({
		title:'Abbrechen',
		left : 10
	});
	navi.add(self.savebutton);
	navi.add(self.cancelbutton);
	var pommesdata = require('model/pommes');
	var pommes = [];
	var data = [];
	for (var i = 0; i < pommesdata.length; i++) {
		pommes.push(pommesdata[i].div[0].a.title);
	}
	pommes.sort();
	for (var i = 0; i < pommes.length; i++) {
		data.push(Ti.UI.createPickerRow({
			title : pommes[i]
		}));
	}
	var picker = Ti.UI.createPicker({
		top : 50
	});
	picker.add(data);
	picker.selectionIndicator = true;
	picker.addEventListener('change', function(_e) {
		console.log(_e.selectedValue[0]);
		tree.sorte = _e.selectedValue[0];
		Ti.App.fireEvent('app:tree', tree);
	});
	self.add(picker);
	var container = Ti.UI.createScrollView({
		height : Ti.UI.FILL,
		right : 10,
		width : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
		contentWidth : Ti.UI.FILL,
		layout : 'vertical',
		top : 290
	});
	self.add(container);
	var textinputs = {
		baumplakettennummer : {
			label : "Baumplakettennummer",
			keyboardtype : Ti.UI.KEYBOARD_DECIMAL_PAD
		},
		baumalter : {
			label : 'Alter des Baumes',
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
		textinputs[key].view = new (require('ui/textfield.widget'))({
			key : key,
			label : textinputs[key].label,

		});
		container.add(textinputs[key].view);
	}
	return self;
};
