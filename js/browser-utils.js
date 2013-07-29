app.browserUtils = function () {

	'use strict';

	var pub = {};

	pub.openBrowser = function (url, successHandler, errorHandler) {
		var invokeParameters = {
			uri : url,
			target : 'sys.browser'
		};
		blackberry.invoke.invoke(invokeParameters, successHandler || pub.onInvokeSuccess, errorHandler || pub.onInvokeError);
	};

	pub.onInvokeSuccess = function (response) {
		//No need for visual feedback as the app should switch to the browser
		console.log('default BROWSER INVOKE success handler');
	};

	pub.onInvokeError = function () {
		console.log('default BROWSER INVOKE error handler');
	};

	return pub;
}();
