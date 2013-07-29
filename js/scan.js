app.scan = function () {

	'use strict';

	var pub = {
			options : { timeout : 10000 },
			scanLimit : 3,
			scanInterval : 2000,
			timeout : null,
			eventCounter : 0
		},
		initUI;

	pub.onDOMReady = function () {
		console.log('in app.scan.onDOMReady');

		pub.addEventListeners();
		initUI();
		pub.startPositionSensing();
	};

	pub.addEventListeners = function () {
		console.log('in app.scan.addEventListeners');

		document.getElementById('btnMap').addEventListener('click', pub.openMap);
		document.getElementById('btnSave').addEventListener('click', pub.doSave);

		document.getElementById('btnScanAgain').addEventListener('click', pub.restart);
		document.getElementById('btnHome').addEventListener('click', pub.gotoHomeScreen);
		document.getElementById('btnSavedLocations').addEventListener('click', pub.gotoListScreen);
	};

	initUI = function () {
		console.log('in app.scan.initUI');
		var scanResultsImageList = $('#scanResultsImageList');

		scanResultsImageList.fadeOut('fast');
		scanResultsImageList.empty();
		scanResultsImageList.fadeIn('fast');

		document.getElementById('scanProgress').setValue(0);
	};

	pub.stopScan = function () {
		if (pub.timeout) {
			clearTimeout(pub.timeout);
		}
	};

	pub.gotoHomeScreen = function () {
		pub.stopScan();
		app.navUtils.goHome();
	};

	pub.gotoListScreen = function () {
		pub.stopScan();
		app.navUtils.goToList();
	};

	pub.restart = function () {
		pub.stopScan();
		initUI();
		pub.startPositionSensing();
	};

	pub.doSave = function () {
		console.log('scan screen -> Save button');

		bb.pushScreen('locationDetails.html', 'locationDetailsScreen');
	};

	pub.startPositionSensing = function () {

		pub.eventCounter = 0;

		console.log('starting pub.startPositionSensing');
		$('#statusText').html('Starting...');

		pub.getCurrentPosition();
	};

	pub.getCurrentPosition = function () {
		console.log('pub.getCurrentPosition @ ' + pub.eventCounter);
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(pub.onPosition, pub.onError, pub.options);
			if (pub.eventCounter === 0) {
				$('#statusText').html('Geolocation active. Listening for updates.');
			}
		} else {
			$('#statusText').html('GPS deactivated.');
		}
	};

	pub.onPosition = function (position) {

		var latitude = position.coords.latitude,
			longitude = position.coords.longitude,
			horizontalAccuracy = position.coords.accuracy,
			locationVO = new LocationVO(),
			newLastIndex;

		pub.eventCounter++;
		$('#statusText').html('GPS detection event: ' + pub.eventCounter + ' of ' + pub.scanLimit);

		locationVO.name = '';
		locationVO.description = '';
		locationVO.latitude = latitude;
		locationVO.longitude = longitude;
		locationVO.horizontalAccuracy = horizontalAccuracy;
		locationVO.addDate = dateFormat(new Date().getTime(), app.dateMask);

		newLastIndex = app.model.scannedLocations.push(locationVO) - 1;
		// save the most recent item as the selected one... so the user doesn't have to tap
		app.model.selectedLocationVO = app.model.scannedLocations[newLastIndex];

		pub.appendScanResultsGrid(locationVO);

		if (pub.eventCounter < pub.scanLimit) {
			pub.timeout = setTimeout(pub.getCurrentPosition, pub.scanInterval);
		} else {
			pub.eventCounter = 0;
			$('#statusText').html('GPS detection completed.');
			
		}

		pub.updateProgress();
	};

	pub.onError = function (e) {
		$('#statusText').html('Geolocation error: ' + e.message);
	};

	pub.appendScanResultsGrid = function (locationVO) {
		console.log('appendScanResultsGrid');

		var latStr = app.displayUtils.decimalToDMS(locationVO.latitude),
			lonStr = app.displayUtils.decimalToDMS(locationVO.longitude, true),
			addDate = locationVO.addDate,
			scanResultsImageList = document.getElementById('scanResultsImageList'),
			newItem = document.createElement('div');

		newItem.setAttribute('data-bb-type', 'item');
		newItem.setAttribute('data-bb-img', 'assets/icons/satellite.png');
		newItem.setAttribute('data-bb-title', latStr + ' / ' + lonStr);
		newItem.setAttribute('data-bb-accent-text', 'to within<br>' + locationVO.horizontalAccuracy + 'm');
		newItem.setAttribute('data-idx', app.model.scannedLocations.length - 1);
		newItem.innerHTML = addDate;
		newItem.addEventListener('click', pub.onLocationClick);
		
		/*var	checkInBtn = document.createElement('div');		
		checkInBtn.setAttribute('data-bb-type', 'action');
		checkInBtn.setAttribute('data-bb-style' 'button');
		checkInBtn.setAttribute('data-bb-title', 'Check In'); */
		
		if (scanResultsImageList) {
			scanResultsImageList.appendItem(newItem);
			//scanResultsImageList.appendItem(checkInBtn);
		}
	};

	pub.onLocationClick = function (event) {

		var index = event.currentTarget.dataset.idx;
		console.log(index + ' : ' + app.model.selectedLocationVO.latitude);

		app.model.selectedLocationVO = app.model.scannedLocations[index];
		document.getElementById('contextMenu').menu.show();
	};

	pub.updateProgress = function () {
		console.log('in updateProgress');

		var prog = document.getElementById('scanProgress'),
			newVal = parseInt(prog.getAttribute('value')) + 1;

		if (newVal <= parseInt(prog.getAttribute('max'))) {
			prog.setValue(newVal);
		}
	};

	pub.openMap = function () {
		var url = 'http://maps.google.ca/maps?q=' + app.model.selectedLocationVO.latitude + '%2C' + app.model.selectedLocationVO.longitude;
		app.browserUtils.openBrowser(url);
	};

	return pub;
}();
