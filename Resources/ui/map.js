exports.create = function() {
	var self = Ti.UI.createWindow({modal:true});
	var MapModule = require('ti.map');
	var rc = MapModule.isGooglePlayServicesAvailable()
	switch (rc) {
		case MapModule.SUCCESS:
			Ti.API.info('Google Play services is installed.');
			break;
		case MapModule.SERVICE_MISSING:
			alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
			break;
		case MapModule.SERVICE_VERSION_UPDATE_REQUIRED:
			alert('Google Play services is out of date. Please update Google Play services.');
			break;
		case MapModule.SERVICE_DISABLED:
			alert('Google Play services is disabled. Please enable Google Play services.');
			break;
		case MapModule.SERVICE_INVALID:
			alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
			break;
		default:
			alert('Unknown error.');
			break;
	}
	var gmap = MapModule.createView({
		userLocation : true,
		mapType : MapModule.NORMAL_TYPE,
		animate : true,
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
