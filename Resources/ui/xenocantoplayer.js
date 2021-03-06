exports.create = function(_win, _song) {
	var song = _song;
	const H = Ti.Platform.displayCaps.platformWidth / 3;
	var self = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		layout : 'vertical'
	});
	self.sonogramm = Ti.UI.createView({
		width : Ti.Platform.displayCaps.platformWidth,
		height : H,
		top : 0,
		bottom : 0,
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

	self.add(Ti.UI.createLabel({
		text : song.loc,
		height : '40dip',
		color : 'gray',
		left : '10dip',
		right : '10dip',
		font : {
			fontWeight : 'bold',
			fontFamily : 'UbuntuCondensed-Regular',
			fontSize : '16dip'
		}
	}));
	self.add(self.sonogramm);
	var meta = Ti.UI.createView({
		top : 0,
		height : '80dip'
	});
	meta.add(Ti.UI.createLabel({
		left : 100,
		top : 20,
		bottom : 30,
		text : song.rec,
		height : 25,
		font : {
			fontFamily : 'UbuntuCondensed-Regular',
			fontSize : '16dip',fontWeight:'bold'
		},
		color : 'black'
	}));
	self.add(meta);
	Ti.App.XenoCanto.getRecordingDetails({
		id : _song.id,
		onload : function(_data) {
			self.sonogramm.backgroundImage = _data.sonogramm;
			song.duration = _data.duration;
			song.mp3 = _data.mp3;
			song.date = _data.date;
			song.time = _data.time;
			song.memberpic = _data.memberpic;
			meta.add(Ti.UI.createLabel({
				left : 100,
				text : song.date,
				top : 50,
				height : 20,
				color : 'black',
				font : {
					fontFamily : 'UbuntuCondensed-Regular',
					fontSize : '14dip'
				},

			}));
			meta.add(Ti.UI.createLabel({
				left : 100,
				text : song.time,
				top : 80,
				height : 20,
				color : 'black',
				font : {
					fontFamily : 'UbuntuCondensed-Regular',
					fontSize : '14dip'
				},

			}));
			meta.add(Ti.UI.createImageView({
				left : 0,
				width : 90,
				height : 90,
				top : '10dip',
				backgroundColor : '#ddd',
				image : song.memberpic
			}));

			self.playstart = Ti.UI.createImageView({
				image : '/assets/play.png',
				width : 60,
				height : 60,
				zIndex : 999
			});
			self.sonogramm.add(self.progress);
			self.sonogramm.add(self.playstart);

			self.addEventListener('click', function() {
				self.progress.setLeft(0);
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
						self.progress.setLeft(0);
					} else {
						self.playstart.hide();
						_win.add(_win.actind);
						_win.actind.show();
						_win.actind.setMessage('   Loading \n   song\n   from Leiden …');
						_win.audioPlayer.setUrl(song.mp3);
						_win.audioPlayer.start();
					}
				} catch(E) {
					console.log(E);
				}
			});
			_win.audioPlayer.addEventListener('change', function(_e) {
				if (_song.mp3 == _e.source.url) {
					if (_win) {
						if (_win.audioPlayer.playing) {
							_win.actind.hide();
							_win.remove(_win.actind);
							self.progress.setOpacity(0.2);
							self.progress.animate({
								left : Ti.Platform.displayCaps.platformWidth,
								duration : 950 * song.duration
							});
						} else {
							self.playstart.show();
							self.progress.setOpacity(0);
							self.progress.setLeft(0);
						}
					}
				}
			});
		}
	});
	return self;
}
