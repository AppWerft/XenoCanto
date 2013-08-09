Ti.include('vendor/prototypes.js');

var BirdNames = require('model/birdnames');
var XenoCanto = require('model/xenocanto');

Ti.App.BirdNames = new BirdNames();
Ti.App.XenoCanto = new XenoCanto();

require('ui/root.window').create();
//https://github.com/dan-eyles/sculejs