function init() {
   var osmLayer = L.tileLayer('./enkheim/{z}/{x}/{y}.png', {
  					attribution: 'Map tiles by <a href="http://osm.org">OpenstreetMapn</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
	});
    var map = new L.Map('map', {
				center: new L.LatLng(50.156,8.7657),
				zoom: 16,
				zoomControl :  true});
	map.addLayer(osmLayer);
		
		
}
