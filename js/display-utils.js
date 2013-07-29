app.displayUtils = function () {

	'use strict';

	var pub = {};

	pub.decimalToDMS = function (decimalDegrees, longitude, obj) {
		var data = {
			dir : decimalDegrees < 0 ? longitude ? 'W' : 'S' : longitude ? 'E' : 'N',
			deg : 0 | (decimalDegrees < 0 ? decimalDegrees = -decimalDegrees : decimalDegrees),
			min : 0 | decimalDegrees % 1 * 60,
			sec : (0 | decimalDegrees * 60 % 1 * 6000) / 100
		};

		if (obj) {
			return data;
		} else {
			return data.deg + "&deg;" + data.dir + " " + data.min + "' " + Math.round(data.sec) + "\"";
		}
	};

	pub.getOrientation = function (outerWidth, outerHeight) {
		return (outerWidth > outerHeight ? 'landscape' : 'portrait');
	};

	return pub;
}();
