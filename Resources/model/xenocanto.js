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
	xhr.send(null)
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
			console.log(song);
			_song.onload(song);
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
}
/* OLD API */
XenoCanto.prototype.getSongsByLatinname = function(_args) {
	var regex = /\/download\.php\?XC=([\d]+)"/g;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var lines = xhr.responseText.split('\n');
			var res = [];
			for (var i = 0; i < lines.length; i++) {
				var elems = lines[i].split(';');
				if (elems.length > 10) {
					res.push({
						id : elems[0],
						genus : elems[1],
						species : elems[2],
						english : elems[3],
						subspecies : elems[4],
						recordist : elems[5],
						country : elems[6],
						location : elems[7],
						lat : elems[8],
						lon : elems[9],
						songtype : elems[10],
						mp3 : elems[12].replace(/ /g, '%20'),
						sono : elems[13].replace(/\/tb\/(.*)/g, '/XC') + elems[0] + '-small.png'
					})
				}
			}
			_args.onload(res);
		}
	});
	xhr.open('GET', 'http://www.xeno-canto.org/csv.php?representative=1&fileinfo=1&species=' + _args.latin.replace(/_/, '+'));
	xhr.send(null);
}

XenoCanto.prototype.getDetails = function(_song) {
	var url = 'http://www.xeno-canto.org/embed.php?XC=' + _song.id + '&simple=1';
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var regex = /<div class="jp\-xc\-duration">(.*?)<\/div>/g;
			var res = regex.exec(this.responseText);
			if (res) {
				_song.duration = parseInt(res[1].split(':')[0]) * 60 + parseInt(res[1].split(':')[1]);
				_song.onload(_song);
			}
		}
	});
	xhr.open('GET', url);
	xhr.send(null);
}

module.exports = XenoCanto;
