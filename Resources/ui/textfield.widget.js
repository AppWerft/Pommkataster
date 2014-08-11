module.exports = function() {
	var baum = arguments[0];
	var options = arguments[1] || {};
	var key = options.key;
	var self = Ti.UI.createView({
		top : 10,
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	self.input = Ti.UI.createTextField({
		width : Ti.UI.FILL,
		left : 10,
		height : 40,
		top : 0,
		keyboardType : (options.keyboardtype) ? (options.keyboardtype) : Ti.UI.KEYBOARD_DECIMAL,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText : '???'
	});
	self.input.addEventListener('change', function(_e) {
		var payload = {};
		payload[key] = _e.value;
		Ti.App.fireEvent('app:tree', payload);
		baum[key] = _e.value;
	});
	self.add(Ti.UI.createLabel({
		top : 0,
		left : 15,
		text : options.label,
		textAlign : 'left',
		width : Ti.UI.FILL,
		height : 15,
		color : '#007700',
		font : {
			fontSize : 12
		}
	}));
	self.add(self.input);
	return self;
};
