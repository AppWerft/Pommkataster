var Apiomat = require('vendor/apiomat');
var moment = require('vendor/moment');
moment.lang('de');

var saveCB = {
	onOk : function() {
	},
	onError : function(error) {
	}
};

///////////////////////////////////////
// Constructor: ///////////////////////
///////////////////////////////////////
var ApiomatAdapter = function() {
	var callbacks = arguments[0] || {};
	this.userid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()).substring(0, 7);
	this.user = {};
	// test if online:
	var xhr = Ti.Network.createHTTPClient({
		onload : callbacks.ononline,
		onerror : callbacks.onoffline
	});
	xhr.open('HEAD', 'https://apiomat.org/yambas/rest');
	xhr.send();
	return this;
};

ApiomatAdapter.prototype.loginUser = function() {
	var args = arguments[0] || {}, callbacks = arguments[1] || {}, that = this;
	var uid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress());
	var that = this;
	/*Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
	 onOk : function() {
	 console.log('Offline cache gestartet');
	 },
	 onError : function(err) {
	 //Error occurred
	 }
	 });*/

	this.user = new Apiomat.Pomologe();
	this.user.setUserName(uid);
	this.user.setPassword('mylittlesecret');

	this.user.loadMe({
		onOk : function() {
			console.log('Info: login into apiomat OK');
			callbacks.onOk && callbacks.onOk();
		},
		onError : function(error) {
			console.log('Warning: ' + error);
			if (error.statusCode === Apiomat.Status.UNAUTHORIZED) {
				that.user.save(saveCB);
			} else
				callbacks.onoffline();
		}
	});
	return this;
};

ApiomatAdapter.prototype.saveBaum = function(baum) {
	var Baum = (baum.id) ? this.trees[baum.id] : new Apiomat.Baum();
	console.log('~~~~~~~~~~~~~~~');
	console.log(baum);
	for (var key in baum) {
		switch (key) {
		case 'sorte':
			Baum.setSorte(baum.sorte);
			break;
		case 'pflanzjahr':
			Baum.setPflanzjahr(baum.pflanzjahr);
			break;
			case 'flurstueck':
			Baum.setFlurstueck(baum.flurstueck);
			break;
		case 'baumumfang':
			Baum.setBaumumfang(baum.baumumfang);
			break;
		case 'baumhoehe':
			Baum.setBaumumfang(baum.baumhoehe);
			break;
		case 'arbeitstitel':
			Baum.setArbeitstitel(baum.arbeitstitel);
			break;
		case 'latitude':
			Baum.setPositionLatitude(baum.latitude);
			break;
		case 'longitude':
			Baum.setPositionLongitude(baum.longitude);
			break;
		case 'baumplakettennummer':
			Baum.setBaumplakettennummer(baum.baumplakettennummer);
		}
	}
	Baum.setProjektnummer(Ti.App.Properties.getString('pid'));
	Baum.save({
		onOk : function() {
			console.log('Info: new position  successful saved ');
		},
		onError : function() {
			console.log('Error: cannot save new position  ' + E);

		}
	});
};

ApiomatAdapter.prototype.getGeoJSON = function(_Trees) {
	if (!Ti.App.Properties.getString('pid'))
		return;
	var geojson = {
		"type" : "FeatureCollection",
		"features" : []
	};
	
	for (var id in _Trees) {
		var tree = _Trees[id];
		geojson.features.push({
			type : "Feature",
			properties : {
				sorte : tree.sorte
			},
			geometry : {
				type : "Point",
				coordinates : [tree.latitude, tree.longitude]
			}
		});
	}
	var pid = Ti.App.Properties.getString('pid');
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, pid + '_geojson.json');
	file.write(JSON.stringify(geojson));
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var shapefile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'baumkataster_' + pid + '_shape.zip');
			shapefile.write(this.responseData);
		},
		onerror : function() {
			console.log(this.error);
		}
	});
	xhr.open('POST', 'http://ogre.adc4gis.com/convertJson');
	xhr.send({
		json : JSON.stringify(geojson),
		outputName : 'baumkataster_' + pid + '_'
	});
};

ApiomatAdapter.prototype.getAllTrees = function(_options, _callback) {
	var query = "projektnummer==\"" + Ti.App.Properties.getString('pid') + "\"";
	var that = this;
	Apiomat.Baum.getBaums(query, {
		onOk : function(_treelist) {
			that.trees = _treelist;
			var Trees = {};
			for (var i = 0; i < _treelist.length; i++) {
				try {
					var id = _treelist[i].getID();
					Trees[id] = {
						id : id,
						latitude : _treelist[i].getPositionLatitude(),
						longitude : _treelist[i].getPositionLongitude(),
						sorte : _treelist[i].getSorte(),
						baumplakettennummer : _treelist[i].getBaumplakettennummer() || '',
						baumhoehe : _treelist[i].getBaumhoehe() || '',
						baumumfang : _treelist[i].getBaumumfang() || '',
						arbeitstitel : _treelist[i].getArbeitstitel() || '',
						flurstueck : _treelist[i].getFlurstueck() || '',
						pflegezustand : _treelist[i].getPflegezustand() || '',
					};
				} catch(E) {
					console.log(E);
				}

			}
			that.getGeoJSON(Trees);
			_callback(Trees);
		}
	});

};

ApiomatAdapter.prototype.saveTree = function(_args, _callbacks) {
	var args = arguments[0] || {}, callbacks = arguments[1] || {}, that = this;
	var myNewTree = new Apiomat.Baum();
	myNewTree.setPositionLatitude(args.latitude);
	// from getPosition
	myNewTree.setPositionLongitude(args.longitude);
	myNewTree.save({
		onOK : function() {
			console.log('Info: newPhoto.save successful');

			Ti.Android && Ti.UI.createNotification({
				message : 'Photo erhalten.'
			}).show();
		},
		onError : function() {
		}
	});

};

module.exports = ApiomatAdapter;
