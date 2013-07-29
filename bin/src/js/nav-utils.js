app.navUtils = function () {

	'use strict';

	var pub = {};

	pub.goHome = function () {
		bb.pushScreen('splash.html', 'splashScreen');
	};

	pub.goToList = function () {
		bb.pushScreen('savedLocations.html', 'savedLocationsScreen');
	};

	pub.goToScan = function () {
		bb.pushScreen('scan.html', 'scanScreen');
	};

	return pub;
}();
