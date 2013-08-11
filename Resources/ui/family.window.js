exports.create = function(_family) {
	console.log('start familywindow');
	var self = Ti.UI.createWindow({
		fullscreen : true,
		title : 'All species of ' + _family.latinname + ' # ' + _family.localname,
		orientationModes : [Ti.UI.PORTRAIT],
	});
	self.listView = Ti.UI.createListView({
		templates : {
			'template' : require('ui/templates').familyTemplate
		},
		defaultItemTemplate : 'template',
		backgroundColor : 'white'
	});
	var sections = [];
	var genuses = Ti.App.BirdNames.getFamily(_family.id);
	console.log('familywindow got datas');
	for (var g = 0; g < genuses.length; g++) {
		var species = [];
		for (var s = 0; s < genuses[g].species.length; s++) {
			var name = genuses[g]['latin_name'] + ' ' + genuses[g].species[s]['latin_name'];
			species.push({
				properties : {
					itemId : JSON.stringify({
						latinname : name,
						imageurl : genuses[g].species[s]['image_url']
					}),
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
				},
				pic : {
					image : genuses[g].species[s]['image_url']
				},
				latin_name : {
					text : name
				},
				i18n_name : {
					text : genuses[g].species[s]['english_name']
				}
			});
		}
		sections[g] = Ti.UI.createListSection({
			headerTitle : genuses[g]['latin_name'],
			items : species
		});
	}
	self.listView.setSections(sections);
	self.add(self.listView);

	self.listView.addEventListener('itemclick', function(e) {
		require('ui/xenocanto.window').create(JSON.parse(e.itemId)).open();
	});
	self.addEventListener('longpress', function() {
		if (self) {
			self.close();
		}
		self = null;
		return true;
	});
	self.addEventListener('androidback', function() {
		if (self) {
			self.close();
		}
		self = null;
		return true;
	});
	return self;
}
