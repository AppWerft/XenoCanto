getFamilyData = function(_args) {
	var latin_name = _args.family.latinname;
	var i18n_name = _args.family.localname;
	var imageurl = _args.family.imageurl;
	var dataItem = {
		properties : {
			itemId : JSON.stringify(_args.family),
			accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
		},
		latin_name : {
			text : latin_name
		},
		i18n_name : {
			text : i18n_name
		},
		pic : {
			image : imageurl
		}
	};
	return dataItem;
}

exports.create = function() {
	Ti.UI.setBackgroundImage('Default.png');
	var self = Ti.UI.createWindow({
		exitOnClose : true,
		backgroundColor : 'white',
		navBarHidden : true,
		title : 'Birdnames :: Orders and Families'
	});
	
	var listView = Ti.UI.createListView({
		templates : {
			'template' : require('ui/templates').familyTemplate
		},
		defaultItemTemplate : 'template',
		locked : false,
		backgroundColor : 'white'
	});
	var orders = Ti.App.BirdNames.getOrders();
	var sections = [];
	for (var i = 0; i < orders.length; i++) {
		var families = [];
		sections[i] = Ti.UI.createListSection({
			headerTitle : orders[i]['latin_name']
		});
		for (var f = 0; f < orders[i].families.length; f++) {
			families.push(getFamilyData({
				section : sections[i],
				ndx : i,
				family : orders[i].families[f]
			}));
		}
		sections[i].setItems(families);
	}
	listView.setSections(sections);
	self.add(listView);
	listView.addEventListener('itemclick', function(e) {
		console.log('rootlistview clicked');
		if (listView.locked == true)
			return;
		listView.locked = true;
		require('ui/family.window').create(JSON.parse(e.itemId)).open();
	});
	self.addEventListener('blur', function() {
		console.log('rootlistview blurred');
		listView.locked = false
	});
	return self;
}
