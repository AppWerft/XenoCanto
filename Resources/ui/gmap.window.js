const START = 1;

exports.create = function(_bird) {
	var MapModule = require('ti.map');
	var self = Ti.UI.createWindow({
		title : null,
		fullscreen : false
	});
	var gmap = MapModule.createView({
		userLocation : false,
		enableZoomControls : false,
		mapType : MapModule.TERRAIN_TYPE,
		userLocationButton : false,
		region : {
			latitude : 0,
			longitude : 0,
			latitudeDelta : 10,
			longitudeDelta : 10
		},
		animate : true
	});
	self.add(gmap);
	var lat, lng;
	var pins = [];
	for (var i = 0; i < _bird.recordings.length; i++) {
		var r = _bird.recordings[i];
		if (r.lat != null && r.lng != null) {
			lat = r.lat;
			lng = r.lng;
			pins.push(MapModule.createAnnotation({
				latitude : lat,
				title : r.loc,
				pincolor : MapModule.ANNOTATION_GREEN,
				longitude : lng,
			}));
		}
	}
	setTimeout(function() {
		gmap.setRegion({
			latitude : lat,
			longitude : lng
		});
		gmap.addAnnotations(pins);
	}, 10);
	return self;
}
