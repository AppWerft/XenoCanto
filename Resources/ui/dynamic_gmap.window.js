const START = 1;
exports.create = function(_bird) {
	var self = Ti.UI.createWindow({
		fullscreen : false,
		locked : false,
		orientationModes : [Ti.UI.PORTRAIT]
	});
	self.gmap = Ti.App.GMap.createView({
		userLocation : true,
		enableZoomControls : false,
		mapType : Ti.App.GMap.NORMAL_TYPE,
		userLocationButton : true,
		bottom : '20dp',
		region : {
			latitude : 50.9270540,
			longitude : 11.5892372,
			latitudeDelta : START,
			longitudeDelta : START
		},
		animate : true
	});
	self.logcontainer = Ti.UI.createView({
		backgroundColor : 'black',
		height : '20dp',
		width : Ti.UI.FILL,
		bottom : 0
	});
	self.log = Ti.UI.createLabel({
		height : '20dp',
		width : Ti.UI.FILL,
		color : 'white',
	});
	self.logcontainer.add(self.log);
	self.add(self.logcontainer);
	self.add(self.gmap);
	var lastregion = null;
	var lat, lng;
	var pins = [];
	var onregionchanged = function(_e) {
		if (self.locked == true) {
			lastregion = _e;
			console.log('map was locked');
			self.log.setText('Map is locked during server request.');
			return;
		}
		self.locked = true;
		self.log.setText('Map will locked until data from server retrieving');
		console.log('Map will locked until new pins are rendered');
		var box = (_e.latitude - _e.latitudeDelta / 2.1) + ',' + (_e.longitude - _e.longitudeDelta / 2.1) + ',' + (_e.latitude + _e.latitudeDelta / 2.1) + ',' + (_e.longitude + _e.longitudeDelta / 2.1);
		var xhr = Ti.App.XenoCanto.searchRecordings({
			box : box,
			onload : function(_data) {
				console.log('new data from server: ' + _data.recordings.length);
				self.log.setText('New data from server: ' + _data.recordings.length);
				self.gmap.removeAllAnnotations();
				console.log('removing of all old pins ' + pins.length);
				pins = [];
				for (var i = 0; i < _data.recordings.length && i < 99; i++) {
					var rec = _data.recordings[i];
					var pincolor = Ti.App.GMap.ANNOTATION_YELLOW;
					switch (true) {
						case rec.type.match(/song/):
							pincolor = Ti.App.GMap.ANNOTATION_GREEN;
							break;
						case rec.type.match(/call/):
							pincolor = Ti.App.GMap.ANNOTATION_AZURE;
							break;
					}
					pins.push(Ti.App.GMap.createAnnotation({
						latitude : rec.lat,
						title : rec.gen + ' ' + rec.sp,
						subtitle : rec.rec,
						pincolor : pincolor,
						longitude : rec.lng,
					}));
					self.log.setText('Pin created: ' + i);
				}
				self.gmap.addAnnotations(pins);
				setTimeout(function() {
					console.log('map unlocked');
					self.locked = false;
					self.log.setText('Map ready for panning/zooming. ' + i + ' pins visible.');
					if (lastregion) {
						onregionchanged(lastregion);
						lastregion = null;
					}
				}, 100);
			}
		});
	}
	self.gmap.addEventListener('regionchanged', onregionchanged);
	self.gmap.addEventListener('click', function() {
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
	self.log.setText('Retrieving your position');
	Ti.Geolocation.getCurrentPosition(function(_e) {
		self.addEventListener('focus', function() {
			self.log.setText('Window focused , getting your position');
			var region = {
				latitude : _e.coords.latitude,
				longitude : _e.coords.longitude,
				latitudeDelta : START,
				longitudeDelta : START
			};
			self.gmap.setRegion(region);
			onregionchanged(region);
		});
	});
	return self;
}
