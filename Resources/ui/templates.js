exports.familyTemplate = {
	properties : {
		height : '100dip'
		//layout : 'vertical'
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'pic',
		properties : {
			width : '100dip',
			height : '100dip',
			top : 0,
			left : 0,
			bottom : 0,
			defaultImage : '/assets/bird.png'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'latin_name',
		properties : {
			color : '#333',
			font : {
				fontFamily : 'Georgia-Italic',
				fontSize : '14dp',
				fontStyle : 'italic'
			},
			bottom : 10,
			left : '110dip',
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'i18n_name',
		properties : {
			color : '#666',
			font : {
				fontFamily : 'Arial',
				fontSize : '18dip',
				fontWeight : 'bold'
			},
			left : '110dip',
			top : 10
		}
	}]
};

exports.families = {
	properties : {
		height : '60dip'
	},
	childTemplates : [{
		type : 'Ti.UI.Label',
		bindId : 'name',
		properties : {

			color : '#333',
			font : {
				fontFamily : 'Arial',
				fontSize : '16dp',
				fontWeight : 'bold'
			},
			left : '10dp',
		}
	}]
};
