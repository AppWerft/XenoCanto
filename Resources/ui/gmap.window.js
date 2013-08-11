exports.create = function(_bird) {
	var self = Ti.UI.createWindow({
		title : null
	});
	var MapModule = require('ti.map');
	switch (MapModule.isGooglePlayServicesAvailable()) {
		case MapModule.SUCCESS:
			Ti.API.info('Google Play services is installed.');
	}
	var pins = [];
	for (var i = 0; i < _bird.recordings.length; i++) {
		var r = _bird.recordings[i];
		console.log(r);
		pins[i] = MapModule.createAnnotation({
			latitude : r.lat,
			pincolor : MapModule.ANNOTATION_GREEN,
			longitude : r.lng,
		});

	}
	var gmap = MapModule.createView({
		userLocation : true,
		mapType : MapModule.NORMAL_TYPE,
		region : {
			latitude : _bird.recordings[0].lat,
			longitude : _bird.recordings[0].lng,
			latitudeDelta : 1,
			longitudeDelta : 1
		},
		animate : true
	});
	gmap.addAnnotations(pins);
	self.add(gmap);
	return self;
}
