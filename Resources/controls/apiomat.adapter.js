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
	this.loginUser();

	return this;
	// test if online:

	var xhr = Ti.Network.createHTTPClient({
		onload : callbacks.ononline,
		onerror : callbacks.onoffline
	});
	xhr.open('HEAD', 'https://apiomat.org/yambas/rest');
	xhr.send();
};

ApiomatAdapter.prototype.loginUser = function() {
	var args = arguments[0] || {}, callbacks = arguments[1] || {}, that = this;
	var uid = Ti.Utils.md5HexDigest(Ti.Platform.getMacaddress());
	var that = this;
	Apiomat.Datastore.setOfflineStrategy(Apiomat.AOMOfflineStrategy.USE_OFFLINE_CACHE, {
		onOk : function() {
			console.log('Offline cache gestartet');
		},
		onError : function(err) {
			//Error occurred
		}
	});

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
	var Baum = new Apiomat.Baum();
	console.log('~~~~~~~~~~~~~~~');
	console.log(baum);
	for (var key in baum) {
		console.log(key);
		switch (key) {
		case 'sorte':
			Baum.setSorte(baum.sorte);
			break;
		case 'baumalter':
			Baum.setBaumalter(baum.baumalter);
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
	Baum.save({
		onOk : function() {
			console.log('Info: new position (from alarm process) successful saved ');
		},
		onError : function() {
			console.log('Error: cannot save new position (from alarm process) ' + E);

		}
	});
};

ApiomatAdapter.prototype.setPosition = function(args) {
	var that = this;
	var myNewPosition = new Apiomat.Position();
	myNewPosition.setPositionLatitude(args.latitude);
	myNewPosition.setPositionLongitude(args.longitude);
	myNewPosition.setDevice(Ti.Platform.model);
	myNewPosition.setUserid(that.userid);
	myNewPosition.setApi(Ti.Platform.Android.API_LEVEL);
	myNewPosition.setVersion(Ti.App.version);
	myNewPosition.setEnabled(args.enabled);
	myNewPosition.save({
		onOk : function() {
			console.log('Info: new position (from alarm process) successful saved ' + myNewPosition);
		},
		onError : function() {
			console.log('Error: cannot save new position (from alarm process) ' + E);

		}
	});

};
ApiomatAdapter.prototype.getAllTrees = function(_options, _callback) {
	var query = "";
	Apiomat.Baum.getBaums(query, {
		onOk : function(_trees) {
			var treelist = {};
			for (var i = 0; i < _trees.length; i++) {
				try {
					var id = _trees[i].getID();
					treelist[id] = {
						latitude : _trees[i].getPositionLatitude(),
						longitude : _trees[i].getPositionLongitude(),
						sorte : _trees[i].getSorte(),
						baumplakettennummer : _trees[i].getBaumplakettennummer() || '',
						baumhoehe : _trees[i].getBaumhoehe() || '',
						baumumfang : _trees[i].getBaumumfang() || '',
						arbeitstitel : _trees[i].getArbeitstitel() || '',
						flurstueck : _trees[i].getFlurstueck() || '',
						pflegezustand : _trees[i].getPflegezustand() || '',
					};
				} catch(E) {
					console.log(E);
				}
				_callback(treelist);
			}
			
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
ApiomatAdapter.prototype.deletePhoto = function(_id, _callbacks) {
	for (var i = 0; i < this.photos.length; i++) {
		// only own phots has an id:
		if (this.photos[i].data.id && this.photos[i].data.id == _id) {
			this.photos[i].deleteModel({
				onOk : function() {
					Ti.Android && Ti.UI.createNotification({
						message : 'Photo in Liste gelöscht'
					}).show();
					Ti.Media.vibrate();
					_callbacks.ondeleted();
					console.log('SUCCESSFUl deleted');
				},
				onError : function(error) {
					console.log(error);
				}
			});
			break;
		}
	}
};

ApiomatAdapter.prototype.getAllPhotos = function(_args, _callbacks) {
	var that = this;
	Apiomat.Photo.getPhotos("order by createdAt limit 500", {
		onOk : function(_res) {
			that.photos = _res;
			var photolist = [];
			for (var i = 0; i < that.photos.length; i++) {
				var photo = that.photos[i];
				var ratio = photo.getRatio() || 1.3;
				photolist.push({
					id : (photo.data.ownerUserName == that.user.getUserName())//
					? photo.data.id : undefined,
					latitude : photo.getLocationLatitude(),
					longitude : photo.getLocationLongitude(),
					title : photo.getTitle(),
					ratio : ratio,
					bigimage : photo.getPhotoURL(600, null, null, null, 'png') ,
				});
			}
			_callbacks.onload(photolist);
		},
		onError : function(error) {
			//handle error
		}
	});

};
module.exports = ApiomatAdapter;
