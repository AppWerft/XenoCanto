exports.create = function(_bird) {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : _bird.latinname,
		backgroundColor : 'white',
		orientationModes : [Ti.UI.PORTRAIT]
	});
	self.audioPlayer = Ti.Media.createAudioPlayer({
		allowBackground : true,
		autoplay : true,
		volume : 1
	});
	self.actind = Ti.UI.createActivityIndicator({
		color : 'white',
		backgroundColor : '#262',
		width : '200dip',
		message : 'Bitte etwas Geduld … ',
		height : '125dip',
		zIndex : 99,
		opacity : 0.8,
		style : (Ti.Platform.osname=='android')? Ti.UI.ActivityIndicatorStyle.BIG :Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
		font : {
			fontSize : '12dip'
		}/*,
		 borderRadius : '8dip',
		 borderColor : 'white',
		 borderWidth : 2*/
	});
	var rows = [];
	if (_bird.imageurl != '')
		self.add(Ti.UI.createImageView({
			top : 0,
			image : _bird.imageurl,
			width : Titanium.Platform.displayCaps.platformWidth,
			height : Titanium.Platform.displayCaps.platformWidth * 0.7,
		}));
	self.tv = Ti.UI.createTableView({
		top : Ti.Platform.displayCaps.platformWidth * 0.7,
	});
	self.add(self.tv);
	self.add(self.actind);
	self.actind.setMessage(' Get songs from XenoCanto.');
	Ti.App.XenoCanto.searchRecordings({
		bird : _bird.latinname,
		onload : function(_res) {
			self.actind.setMessage('  Got ' + _res.recordingslength + ' songs from song database.');
			for (var i = 0; i < _res.recordings.length && i < 10; i++) {
				var row = require('ui/xenocantoplayer').create(self, _res.recordings[i]);
				rows.push(row);
			}
			self.actind.hide();
			self.remove(self.actind);
			self.tv.setData(rows);
		}
	});

	self.addEventListener('longpress', function() {
		self.close();
	});

	self.addEventListener('close', function() {
		if (self && self.audioPlayer) {
			self.audioPlayer.stop();
			if (Ti.Platform.osname === 'android') {
				self.audioPlayer.release();
			}
		}
	});
	self.addEventListener('close', function() {
		self = null;
	});
	return self;
}
