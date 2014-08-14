var Apiomat = require('vendor/apiomat');
var moment = require('vendor/moment');
moment.lang('de');



///////////////////////////////////////
// Constructor: ///////////////////////
///////////////////////////////////////
var ApiomatAdapter = function() {
	// factory pattern:
	if (!(this instanceof ApiomatAdapter)) {
		return new ApiomatAdapter();
	}
	return this.loginUser();

};

ApiomatAdapter.prototype = {
	loginUser : function() {
		var args = arguments[0] || {}, callbacks = arguments[1] || {}, that = this;
		this.currenttree = {};
		this.treelist = [];
		/*Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
		 onOk : function() {
		 console.log('Offline cache gestartet');
		 },
		 onError : function(err) {
		 //Error occurred
		 }
		 });*/

		this.user = new Apiomat.Pomologe();
		this.user.setUserName(Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress()));
		this.user.setPassword('mylittlesecret');

		this.user.loadMe({
			onOk : function() {
				console.log('Info: login into apiomat OK');
				callbacks.onOk && callbacks.onOk();
			},
			onError : function(error) {
				console.log('Warning: ' + error);
				if (error.statusCode === Apiomat.Status.UNAUTHORIZED) {
					that.user.save({
	onOk : function() {
	},
	onError : function(error) {
	}
});
				} else
					callbacks.onoffline();
			}
		});
		return this;
	},

	setCurrentTree : function(_id) {
		console.log('Info: try to set currenttree with ID=' + _id);
		if (_id) {
			for (var i = 0; i < this.treelist.length; i++) {
				if (this.treelist[i].getID() == _id) {
					console.log('Info: currenttree has index ' + i);
					this.currenttree = this.treelist[i];
					break;
				}
			}
		} else {
			this.currenttree = new Apiomat.Baum();
		}
		this.currenttree.setProjektnummer(Ti.App.Properties.getString('pid'));
	},
	setPropertyOfCurrentTree : function(_key, _value) {
		console.log('Info: set ' + _key + ' to ' + _value);
		switch (_key) {
		case 'sorte':
			this.currenttree.setSorte(_value);
			break;
		case 'pflanzjahr':
			this.currenttree.setPflanzjahr(_value);
			break;
		case 'flurstueck':
			this.currenttree.setFlurstueck(_value);
			break;
		case 'baumumfang':
			this.currenttree.setBaumumfang(_value);
			break;
		case 'baumhoehe':
			this.currenttree.setBaumhoehe(_value);
			break;
		case 'arbeitstitel':
			this.currenttree.setArbeitstitel(_value);
			break;
		case 'latitude':
			this.currenttree.setPositionLatitude(_value);
			break;
		case 'longitude':
			this.currenttree.setPositionLongitude(_value);
			break;
		case 'baumplakettennummer':
			this.currenttree.setBaumplakettennummer(_value);
			break;
		}
	},
	getGeoJSON : function(_treelist) {
		if (!Ti.App.Properties.getString('pid'))
			return;
		var geojson = {
			"type" : "FeatureCollection",
			"features" : []
		};
		for (var i = 0; i < _treelist.length; i++) {
			var tree = _treelist[i];
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
	},
	saveCurrentTree : function() {

		this.currenttree.save({
			onOk : function(e) {
				Ti.App.fireEvent('app:message', {
					message : 'Baumdaten erfolgreich gespeichert. '
				});
				console.log('Info: new position of tree successful saved –––––––––––');
			},
			onError : function(E) {
				alert('Konnte Baumdaten nicht speichern');
				console.log(E);
			}
		});
	},
	getAllTrees : function(_options, _callback) {
		var query = "projektnummer==\"" + Ti.App.Properties.getString('pid') + "\"";
		var that = this;
		Ti.App.fireEvent('app:message', {
			message : 'Lade Baumdaten aus dem Netz …'
		});
		Apiomat.Baum.getBaums(query, {
			onOk : function(_treelist) {
				Ti.App.fireEvent('app:message', {
					message : 'Baumdaten erhalten: ' + _treelist.length
				});
				that.treelist = _treelist;
				var treelist = [];
				for (var i = 0; i < _treelist.length; i++) {
					try {
						var id = _treelist[i].getID();
						treelist.push({
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
							pflanzjahr : _treelist[i].getPflanzjahr() || '',
						});
					} catch(E) {
						console.log(E);
					}

				}
				that.getGeoJSON(treelist);
				_callback && _callback(treelist);
			}
		});
	}
};

module.exports = ApiomatAdapter;
