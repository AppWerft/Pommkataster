window.onload = function() {
    var map = new L.Map('map', {
		center: new L.LatLng(50.156,8.7657),
		zoom: 17,
		zoomControl :  true
	});
	map.options.maxZoom = 19;
	map.options.minZoom = 17;
	map.addLayer(L.tileLayer('./enkheim/{z}/{x}/{y}.png', {
  		attribution: 'Map tiles by <a href="http://osm.org">OpenstreetMap</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
	}));
};
