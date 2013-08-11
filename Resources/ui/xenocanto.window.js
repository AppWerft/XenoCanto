exports.create = function(_bird) {
	var self = Ti.UI.createWindow({
		fullscreen : false,
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
		width : '220dip',
		message : 'Bitte etwas Geduld … ',
		height : '100dip',
		zIndex : 99,
		opacity : 0.8,
		style : (Ti.Platform.osname == 'android') ? Ti.UI.ActivityIndicatorStyle.BIG : Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
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
			for (var i = 0; i < _res.recordings.length; i++) {
				var row = require('ui/xenocantoplayer').create(self, _res.recordings[i]);
				rows.push(row);
			}
			if (_res.recordings.length) {
				var b = Ti.UI.createButton({
					height : 60,
					right : 10,
					top : 10,
					width : Ti.UI.SIZE,
					opacity : 0.7,
					title : ' Bird map '
				});
				self.add(b);
				b.addEventListener('click', function() {
					var gmap = require('ui/gmap.window').create(_res);
					gmap.open();
				});
				self.actind.hide();
				self.remove(self.actind);
				self.tv.setData(rows);
			}
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
