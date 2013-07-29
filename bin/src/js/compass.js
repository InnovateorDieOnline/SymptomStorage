app.compass = function () {

	'use strict';

	var pub = {},
		degrees = 0,
		arrowImg,
		deviceCompassCallback;

	pub.onDOMReady = function () {
		console.log('in app.compass.onDOMReady');

		console.log('Supported Sensors:');
		console.log(blackberry.sensors.supportedSensors);

		arrowImg = $('img#arrowImg');

		blackberry.sensors.setOptions('devicecompass', {
			reducedReporting : true,
			delay : 1000000
		});

		blackberry.event.addEventListener('devicecompass', deviceCompassCallback);
	};

	deviceCompassCallback = function (data) {
		var offset;

		degrees = data.value;

		console.log('Degrees: ' + degrees);
		offset = 360 - degrees;
		arrowImg.css('webkit-transform', 'rotate(' + offset + 'deg)');
	};

	pub.onScreenPop = function () {
		blackberry.event.removeEventListener('devicecompass', deviceCompassCallback);
	};

	return pub;
}();
