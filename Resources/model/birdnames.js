const DBNAME = 'ioclist';
const UPDATEDB = false;
var BirdNames = function() {
	this.orders = {};
	var lines = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', 'orders.csv').read().text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		var parts = lines[i].split(' ');
		this.orders[parts[0]] = parts[2];
	};
	if (UPDATEDB) {
		this.dblink = Ti.Database.open(DBNAME);
		if (this.dblink.file && this.dblink.file.exists())
			this.dblink.file.deleteFile();
		else {
			this.dblink.remove();
			console.log('DB removed');
		}
	}
	this.dblink = Ti.Database.install('/depot/ioclist.sql', DBNAME);
	if (this.dblink.file)
		this.dblink.file.setRemoteBackup(false);
	//this.importI18N();
	//this.importImages4Species();
	//this.importImages4Families();
	return this;
}

BirdNames.prototype.getOrders = function() {
	if (Ti.App.Properties.hasProperty('orders'))
		return Ti.App.Properties.getObject('orders');
	var self = this;
	function getFamiliesByOrder(_id) {
		var families = [];
		var resultset = self.dblink.execute('SELECT * FROM family WHERE order_id=?', _id);
		while (resultset.isValidRow()) {
			families.push({
				id : resultset.fieldByName('id'),
				file : resultset.fieldByName('file'),
				englishname : resultset.fieldByName('english_name'),
				latinname : resultset.fieldByName('latin_name'),
				imageurl : resultset.fieldByName('image_url'),
				localname : resultset.fieldByName('german_name')
			});
			resultset.next();
		}
		resultset.close();
		return families;
	}

	var resultset = this.dblink.execute('SELECT * FROM orders');
	var orders = [];
	while (resultset.isValidRow()) {
		orders.push({
			id : resultset.fieldByName('id'),
			'latin_name' : resultset.fieldByName('latin_name'),
			families : getFamiliesByOrder(resultset.fieldByName('id'))
		})
		resultset.next();
	}
	resultset.close();
	Ti.App.Properties.setObject('orders', orders);
	return orders;
}

BirdNames.prototype.getFamily = function(_fid) {
	console.log(_fid);
	var self = this;
	function getSpeciesByFamily(_id, _latingenus) {
		var q = 'SELECT species.id id,species.latin_name latin,species.image_url image_url, i18n.german german FROM species,i18n WHERE i18n.latin="' + _latingenus + ' "' + ' || species.latin_name AND species.genus_id=' + _id;
		var resultset = self.dblink.execute(q);
		var species = [];
		while (resultset.isValidRow()) {
			species.push({
				"id" : resultset.fieldByName('id'),
				"latin_name" : resultset.fieldByName('latin'),
				"english_name" : resultset.fieldByName('german'),
				"image_url" : resultset.fieldByName('image_url'),
			})
			resultset.next();
		}
		resultset.close();
		return species;
	}

	var resultset = this.dblink.execute('SELECT * FROM genus WHERE family_id=' + _fid);
	var genuses = [];
	while (resultset.isValidRow()) {
		genuses.push({
			id : resultset.fieldByName('id'),
			'latin_name' : resultset.fieldByName('latin_name'),
			species : getSpeciesByFamily(resultset.fieldByName('id'), resultset.fieldByName('latin_name'))
		})
		resultset.next();
	}
	resultset.close();
	return genuses;
}
BirdNames.prototype.importI18N = function() {
	var words = {};
	var parts;
	var latin = null;
	var langs = ['english', 'chinese', 'czech', 'danish', 'dutch', 'estonian', 'finnish', 'french', 'german', 'hungarian', 'italian', 'japanese', 'norwegian', 'polish', 'portuguese', 'russian', 'slovak', 'spanish', 'swedish'];
	var lines = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'depot', 'i18n.csv').read().text.split('\n');
	for (var i = 2; i < lines.length - 1; i++) {
		//console.log(parts);
		if (lines[i].match(/;;;;;;;;;;;;;;;;;;/g))
			continue;
		parts = lines[i].split(';');
		if (!parts || !parts.isArray)
			continue;

		if (parts[3] != '') {
			latin = parts[3];
		}
		for (var p = 4; p < parts.length; p++) {
			if (parts[p] != '') {
				words[langs[p - 4]] = parts[p];
			}
		}

		i++;
		parts = lines[i].split(';');
		for (var p = 4; p < parts.length; p++) {
			if (parts[p] != '') {
				words[langs[p - 4]] = parts[p];
			}
		}
		var q = 'INSERT INTO i18n (latin,' + langs.join() + ') VALUES ("' + latin + '"';
		for (var l = 0; l < langs.length; l++) {
			q += ',"' + words[langs[l]] + '"';
		}
		q += ')';
		this.dblink.execute(q);
		console.log(q);
		words = {};
		latin = null;
	};

}

BirdNames.prototype.importImages4Species = function() {
	var self = this;
	self.dblink.execute('UPDATE species SET image_url="" WHERE image_url LIKE "%svg.png%"');
	self.dblink.execute('UPDATE family SET image_url="" WHERE image_url LIKE "%svg.png%"');
	function getImage(_id, _latin) {
		require('vendor/wikipedia').getSpeciesImage(_latin, function(_url) {
			console.log(_id + ' ' + _url);
			if (!_url.match(/svg\.png/g))
				self.dblink.execute('UPDATE species SET image_url=? WHERE id=?', _url, _id);
		});
	}

	var resultset = this.dblink.execute('SELECT species.id AS id, genus.latin_name||"_"||species.latin_name AS latin FROM species,genus WHERE species.image_url = "" AND genus.id=species.genus_id');
	while (resultset.isValidRow()) {
		var latin = resultset.fieldByName('latin');
		var id = resultset.fieldByName('id');
		getImage(id, latin);
		resultset.next();
	}

}

BirdNames.prototype.importImages4Families = function() {
	var self = this;
	function getImage(_id, _latin) {
		require('vendor/wikipedia').getSpeciesImage(_latin, function(_url) {
			console.log(_id + ' ' + _url);
			if (!_url.match(/svg\.png/g))
				self.dblink.execute('UPDATE family SET image_url=? WHERE id=?', _url, _id);
		});
	}

	var resultset = this.dblink.execute('SELECT id,latin_name FROM family WHERE image_url = ""');
	while (resultset.isValidRow()) {
		var latin = resultset.fieldByName('latin_name');
		var id = resultset.fieldByName('id');
		getImage(id, latin);
		resultset.next();
	}
}

BirdNames.prototype.importDB = function() {
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + 'depot/tree_of_all_birds.json');
	if (!f.exists())
		return;
	var orders = JSON.parse(f.read().text).ioclist.list.order;
	for (var o = 0; o < orders.length; o++) {
		this.dblink.execute('INSERT INTO orders (latin_name,note,code) VALUES (?,?,?)', orders[o]['latin_name'], orders[o].note, orders[o].code);
		var order_id = this.dblink.getLastInsertRowId();
		console.log(JSON.stringify(this.dblink));
		console.log(order_id + ' ' + orders[o]['latin_name']);
		var family = orders[o].family;
		if (family) {
			if (!family.isArray)
				family = [family];
			for (var f = 0; f < family.length; f++) {
				this.dblink.execute('INSERT INTO family (order_id,latin_name,english_name,file) VALUES (?,?,?,?)', order_id, family[f]['latin_name'], family[f]['english_name'], family[f].file);
				var family_id = this.dblink.getLastInsertRowId();
				console.log(order_id + '_____' + family_id + '   ' + family[f]['latin_name']);

				var genus = family[f].genus;
				if (genus) {
					if (!genus.isArray)
						genus = [genus];
					for (var g = 0; g < genus.length; g++) {
						this.dblink.execute('INSERT INTO genus (family_id,latin_name,authority) VALUES (?,?,?)', family_id, genus[g]['latin_name'], genus[g].autority);
						var genus_id = this.dblink.getLastInsertRowId();
						//	console.log(genus_id +'     ' + genus[g]['latin_name']);
						var species = genus[g].species;
						if (species) {
							if (!species.isArray)
								species = [species];
							for (var s = 0; s < species.length; s++) {
								this.dblink.execute('INSERT INTO species (genus_id,latin_name,english_name,authority,breeding_regions,breeding_subregions) VALUES (?,?,?,?,?,?)', genus_id, species[s]['latin_name'], species[s]['english_name'], species[s].autority, species[s]['breeding_regions'], species[s]['breeding_subregions']);
								var species_id = this.dblink.getLastInsertRowId();
								//	console.log(species_id +'    ' + species[s]['latin_name']);
								var subspecies = species[s].subspecies;
								if (subspecies) {
									if (!subspecies.isArray)
										subspecies = [subspecies];
									for (var ss = 0; ss < subspecies.length; ss++) {
										this.dblink.execute('INSERT INTO subspecies (species_id,authority,breeding_subregions,nonbreeding_regions,extinct) VALUES (?,?,?,?,?)', species_id, species[s].autority, species[s]['breeding_subregions'], species[s]['nonbreeding_regions'], species[s].extinct);
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

module.exports = BirdNames;
