app.locationDetails = function () {

	'use strict';

	var pub = {},
		initUI,
		locationName;

	pub.onDOMReady = function () {
		console.log('in app.locationDetails.onDOMReady');

		pub.addEventListeners();
		initUI();
	};

	pub.addEventListeners = function () {
		console.log('in app.locationDetails.addEventListeners');

		document.getElementById('btnEditSave').addEventListener('click', pub.doEditSave);
	};

	initUI = function () {

		var locationVO = app.model.selectedLocationVO;

		$('#txtCoordinates').html(app.displayUtils.decimalToDMS(locationVO.latitude) + ' ' + app.displayUtils.decimalToDMS(locationVO.longitude, true) + ' to within ' + locationVO.horizontalAccuracy + 'm');
		if (locationVO.name) {
			$('#txtName').attr('value', locationVO.name);
			$('#txtDescription').attr('value', locationVO.description);
		} else {
			pub.prepareForSave();
		}
		$('#txtDate').attr('value', locationVO.addDate);
	};

	pub.doEditSave = function () {
		console.log('location details screen -> Edit/Save button');

		var lbl = $('#btnEditSave').text(),
			selectedLocationVO,
			name,
			desc;

		if (lbl.indexOf('Edit') > -1) {
			console.log('doEdit');
			pub.prepareForSave();

		} else if (lbl.indexOf('Save') > -1) {
			console.log('doSave');

			selectedLocationVO = app.model.selectedLocationVO;
			name = $('#txtName').val();
			desc = $('#txtDescription').val();

			if (name && desc) {
				selectedLocationVO.name = locationName = name;
				selectedLocationVO.description = desc;

				window.addEventListener('LOCATIONS_RETRIEVED', pub.onAddUpdateSuccess);
				if (selectedLocationVO.location_ID) {
					app.databaseUtils.updateLocation(app.database, selectedLocationVO);
				} else {
					app.databaseUtils.addLocation(app.database, selectedLocationVO);
				}
				app.model.selectedLocationVO = selectedLocationVO;

				pub.prepareForEdit();
			} else {
				try {
					blackberry.ui.dialog.standardAskAsync(
						'Please enter a value for Name and Description',
						blackberry.ui.dialog.D_OK,
						function () {
						},
						{
							title : 'Validation error',
							size : blackberry.ui.dialog.SIZE_MEDIUM,
							position : blackberry.ui.dialog.CENTER
						}
					);
				} catch (e) {
					console.log('Exception in standardDialog: ' + e);
				}
			}

		} else {
			console.log('Edit/Save has invalid label');
		}
	};

	pub.onAddUpdateSuccess = function () {
		var status, message;

		window.removeEventListener('LOCATIONS_RETRIEVED', pub.onAddUpdateSuccess);

		status = blackberry.bbm.platform.self.status;
		message = 'I am in ' + locationName;

		blackberry.bbm.platform.self.setStatus(status, message, function (accepted) {
			if (accepted === true) {
				console.log('Status update was accepted.');
			} else {
				console.log('Status update was not accepted.');
			}
		});

		bb.pushScreen('savedLocations.html', 'savedLocationsScreen');
	};

	pub.prepareForSave = function () {
		$('#txtName').removeAttr('disabled');
		$('#txtDescription').removeAttr('disabled');

		$('#btnEditSave').get(0).setCaption('Save');
		$('#btnEditSave').get(0).setImage('assets/icons/save.png');
	};

	pub.prepareForEdit = function () {
		$('#txtName').attr('disabled', 'disabled');
		$('#txtDescription').attr('disabled', 'disabled');
		$('#btnEditSave').get(0).setCaption('Edit');
		$('#btnEditSave').get(0).setImage('assets/icons/edit.png');
	};

	return pub;
}();
