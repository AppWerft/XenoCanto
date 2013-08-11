Ti.include('vendor/prototypes.js');

var BirdNames = require('model/birdnames');
var XenoCanto = require('model/xenocanto');

Ti.App.BirdNames = new BirdNames();
Ti.App.XenoCanto = new XenoCanto();
Ti.App.GMap =  require('ti.map');

var tab1 = Titanium.UI.createTab({
	title : 'All',
	icon : 'icons/list.png',
	window : require('ui/root.window').create()
});
var tab2 = Titanium.UI.createTab({
	title : 'Map',icon : 'icons/map.png',
	window : require('ui/dynamic_gmap.window').create()
});
var tab3 = Titanium.UI.createTab({
	title : 'Login',
	icon : 'icons/user.png',
	window : require('ui/user.window').create()
});
var tabGroup = Titanium.UI.createTabGroup();

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.open();
require('ui/root.window').create();
//https://github.com/dan-eyles/sculejs