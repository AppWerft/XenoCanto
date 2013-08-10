exports.create = function() {
	var self = Ti.UI.createWindow();
	var MapModule = require('ti.map');
	switch (MapModule.isGooglePlayServicesAvailable()) {
		case MapModule.SUCCESS:
			Ti.API.info('Google Play services is installed.');
	}
	var gmap = MapModule.createView({
		userLocation : true,
		mapType : MapModule.TERRAIN_TYPE,
		region : {
			latitude : 53.53,
			longitude : 10,
			latitudeDelta : 0.1,
			longitudeDelta : 0.1
		}
	});
	self.add(gmap);
	return self;
}
