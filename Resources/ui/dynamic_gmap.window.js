const START = 1;

exports.create = function(_bird) {
	var self = Ti.UI.createWindow({
		title : null,
		fullscreen : false,
		locked : false
	});
	var MapModule = require('ti.map');
	var gmap = MapModule.createView({
		userLocation : true,
		enableZoomControls : false,
		mapType : MapModule.NORMAL_TYPE,
		userLocationButton : true,
		region : {
			latitude : 53.5,
			longitude : 10,
			latitudeDelta : 90,
			longitudeDelta : 40
		},
		animate : true
	});
	self.add(gmap);
	var lastregion = null;
	var lat, lng;
	var pins = [];
	var onregionchanged = function(_e) {
		if (self.locked == true) {
			lastregion = _e;
			console.log('locked');
			return;
		}
		self.locked = true;
		var box = (_e.latitude - _e.latitudeDelta / 2.1) + ',' + (_e.longitude - _e.longitudeDelta / 2.1) + ',' + (_e.latitude + _e.latitudeDelta / 2.1) + ',' + (_e.longitude + _e.longitudeDelta / 2.1);
		console.log('retrieving');
		Ti.App.XenoCanto.searchRecordings({
			box : box,
			onload : function(_data) {
				console.log('got ' + _data.recordings.length);
				;
				gmap.removeAllAnnotations();
				pins = [];
				for (var i = 0; i < _data.recordings.length && i < 99; i++) {
					pins.push(MapModule.createAnnotation({
						latitude : _data.recordings[i].lat,
						title : _data.recordings[i].gen + ' ' + _data.recordings[i].sp,
						subtitle : _data.recordings[i].rec,
						pincolor : MapModule.ANNOTATION_GREEN,
						longitude : _data.recordings[i].lng,
					}));
				}
				gmap.addAnnotations(pins);
				setTimeout(function() {
					console.log('unlocked');
					self.locked = false;
					if (lastregion)
						onregionchanged(lastregion);
					lastregion = null;
				}, 1000);

			}
		});
	}
	if (_bird) {
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
			gmap.addAnnotations(pins);
			gmap.setLocation({
				latitude : lat,
				longitude : lng
			})
		}, 800);
	} else {
		gmap.addEventListener('regionchanged', onregionchanged);
		gmap.addEventListener('click', function() {
			self.locked = true;
			setTimeout(function() {
				self.locked = false;
			}, 7000);
		});

		var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
			name : Ti.Geolocation.PROVIDER_GPS,
			minUpdateTime : 600,
			minUpdateDistance : 1000
		});
		var gpsRule = Ti.Geolocation.Android.createLocationRule({
			provider : Ti.Geolocation.PROVIDER_GPS,
			accuracy : 10000,
			maxAge : 300000,
			minAge : 10000
		});
		Ti.Geolocation.Android.addLocationRule(gpsRule);
		Ti.Geolocation.Android.addLocationProvider(gpsProvider);
		Ti.Geolocation.getCurrentPosition(function(_e) {
			self.addEventListener('focus', function() {
				var region = {
					latitude : _e.coords.latitude,
					longitude : _e.coords.longitude,
					latitudeDelta : START,
					longitudeDelta : START
				};
				gmap.setLocation(region);
				onregionchanged(region);
			});
		});
	}

	return self;
}
