exports.create = function() {
	var self = Ti.UI.createWindow({
		
	});
	var MapModule = require('ti.map');
	switch (MapModule.isGooglePlayServicesAvailable()) {
		case MapModule.SUCCESS:
			Ti.API.info('Google Play services is installed.');
	}
	var gmap = MapModule.createView({
		userLocation : true,
		mapType : MapModule.NORMAL_TYPE,
		region : {
			latitude : -33.87365,
			longitude : 151.20689,
			latitudeDelta : 0.1,
			longitudeDelta : 0.1
		}
	});
	self.add(gmap);
	return self;
}
