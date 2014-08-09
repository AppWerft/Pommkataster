module.exports = function() {
	var foo = Ti.Database.install('model/enkheim.mbtiles','foo');
	var bar = Ti.Database.install('model/ExampleMap.sqlite','bar');
	var res = foo.query('select * from tiles');
};
