var mbt = MBTiles.load('enkheim.mbtiles', function(me) {
    var centerVal = me.metadata('center').split(",");
    var boundVal  = me.metadata('bounds').split(",");
    var bounds    = new L.LatLngBounds( new L.LatLng(boundVal[1],boundVal[0]), new L.LatLng(boundVal[3],boundVal[2]) );
    console.log(boundVal);
    var MBLayer = L.TileLayer.extend({
      options: {
        minZoom: me.metadata('minzoom'),
        maxZoom: me.metadata('maxzoom'),
        tileSize: 256,
        tms: true,
        errorTileUrl: '',
        attribution: me.metadata('attribution'),
        zoomOffset: 0,
        opacity: 1,
        bounds: bounds,
        continuousWorld: true,
        unloadInvisibleTiles: L.Browser.mobile,
        updateWhenIdle: L.Browser.mobile
      },
      getTileUrl: function (tilePoint) {
        this._adjustTilePoint(tilePoint);
        var tile = me.getTileImage(tilePoint.x, tilePoint.y, this._getZoomForUrl());
        return tile;
      }
    }); 
    
    var MBLayerObj = new MBLayer('dummy',{tms:true});
    var map = new L.Map('map',
      {
        minZoom: me.metadata('minzoom'),
        maxZoom: me.metadata('maxzoom')
      }
    );
    console.log(me.metadata('minzoom'));
    map.addLayer(MBLayerObj);
    console.log(centerVal);
    //map.setView(new L.LatLng(parseFloat(centerVal[1]),parseFloat(centerVal[0])),parseInt(centerVal[2]));
    map.fitBounds(bounds);
  }
);