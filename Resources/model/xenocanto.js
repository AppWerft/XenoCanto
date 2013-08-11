/* NEW API */
/* http://xeno-canto.org/feature-view.php?blognr=153 */
var XenoCanto = function() {
	return this;
}

XenoCanto.prototype.searchRecordings = function(_args) {
	var self = this;
	var parameters = [];
	if (_args.bird)
		parameters.push(encodeURI(_args.bird));
	var keys = ['type', 'q', 'loc', 'cnt', 'gen', 'box', 'nr', 'area'];
	for (var i = 0; i < keys.length; i++) {
		if (_args[keys[i]])
			parameters.push(keys[i] + ':' + encodeURI(_args[keys[i]]));
	}
	var url = 'http://www.xeno-canto.org/api/recordings.php?query=' + parameters.join('%20');
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);
			if (_args.onload && typeof _args.onload == 'function')
				_args.onload(json);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
}

XenoCanto.prototype.getRecordingDetails = function(_song) {
	var url = 'http://www.xeno-canto.org/' + _song.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var web = this.responseText;
			var res = null;
			var song = {};
			res = /<div class="jp\-xc\-duration">(.*?)<\/div>/g.exec(web);
			if (res) {
				song.duration = parseInt(res[1].split(':')[0]) * 60 + parseInt(res[1].split(':')[1]);
			}
			res = /<div class="jp\-xc\-sono"><a(.*?)><img src="(.*?)"><\/a><\/div>/g.exec(web);
			if (res) {
				song.sonogramm = res[2];
			}
			res = /data\-xc\-filepath="(.*?)"/g.exec(web);
			if (res) {
				song.mp3 = res[1];
			}
			res = /uploaded\/(.*?)\//g.exec(song.mp3);
			if (res) {
				song.memberpic = 'http://www.xeno-canto.org/graphics/memberpics/' + res[1] + '.png';
			}
			res = /<td>Date<\/td><td>(.*?)<\/td>/g.exec(web);
			if (res) {
				song.date = res[1];
			}
			res = /<td>Time<\/td><td>(.*?)<\/td>/g.exec(web);
			if (res) {
				song.time = res[1];
			}
			_song.onload(song);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
}

module.exports = XenoCanto;
