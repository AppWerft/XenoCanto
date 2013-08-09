exports.create = function(_win, _song) {
	
	Ti.App.XenoCanto.getRecordingDetails({
		id : _song.id,
		onload : function(_data) {
			console.log(_data);
		}
	});

	const H = Ti.Platform.displayCaps.platformWidth * 0.36;
	var self = Ti.UI.createTableViewRow({
		height : H
	});
	self.sonogramm = Ti.UI.createImageView({
		image : _song.sono,
		width : Ti.Platform.displayCaps.platformWidth,
		height : H,
		top : 0,
		bottom : 0,
		defaultImage : '/assets/bird.png',
		bubbleParent : true
	});
	self.progress = Ti.UI.createView({
		height : H,
		left : 0,
		top : 0,
		width : Ti.Platform.displayCaps.platformWidth,
		opacity : 0.01,
		backgroundColor : 'black',
	});
	self.add(self.sonogramm);
	Ti.App.XenoCanto.getDetails({
		id : _song.id,
		ndx : 0,
		onload : function(_data) {
			_song.duration = _data.duration;
			self.playstart = Ti.UI.createImageView({
				image : '/assets/play.png',
				width : 60,
				height : 60,
				zIndex : 999
			});
			self.add(self.progress);
			self.add(self.playstart);
			self.addEventListener('click', function() {
				self.progress.left = 0;
				try {
					if (_win.audioPlayer.playing || _win.audioPlayer.paused) {
						_win.audioPlayer.stop();
						if (Ti.Platform.name === 'android') {
							_win.audioPlayer.release();
						}
						_win.remove(_win.actind);
						_win.actind.hide();
						self.playstart.show();
						self.progress.setOpacity(0);
						self.progress.left = 0;
						console.log('Player stopping');
					} else {
						self.playstart.hide();
						_win.add(_win.actind);
						_win.actind.show();
						_win.actind.setMessage('   Loading \n   song\n   from Leiden …');
						_win.audioPlayer.setUrl(_song.mp3);
						_win.audioPlayer.start();
						console.log('Player starting');
					}
				} catch(E) {
					console.log(E);
				}
			});
			_win.audioPlayer.addEventListener('change', function(_e) {
				if (_song.mp3 == _e.source.url) {
					console.log(_e.state);
					if (_win) {
						if (_win.audioPlayer.playing) {
							_win.actind.hide();
							_win.remove(_win.actind);
							self.progress.setOpacity(0.2);

							console.log('Duration: ' + _song.duration);
							self.progress.animate({
								left : Ti.Platform.displayCaps.platformWidth,
								duration : 1000 * _song.duration
							});
						} else {
							self.playstart.show();
							self.progress.setOpacity(0);
							self.progress.left = 0;
						}
					}
				}
			});
		}
	});
	return self;
}
