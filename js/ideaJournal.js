app.ideaJournal = function () {

	'use strict';
	localStorage.setItem("1", "a good idea");
	localStorage.setItem("2", "a sort of good idea");
	localStorage.setItem("3", "a terrible idea");
	localStorage.setItem("4", "a better than bad idea");
	
	var JSONObject_idea = {'idea' : 'some kind of good idea', 'description' : 'you won'};
	localStorage.setItem("5", JSON.stringify(JSONObject_idea));
	
	
	var i = 1;
	console.log('i is currently ' + i);
	console.log(localStorage.getItem(i));
	for( i=1; i < 8; i++)
	{
		console.log('i is currently ' + i);
		console.log(localStorage.getItem(i));
	}
	
	var pub = {},
		initUI;

	pub.onDOMReady = function () {
		console.log('in app.ideaJournal.onDOMReady');

		pub.addEventListeners();
		initUI();
		pub.populateIdeaGrid();
	};

	pub.addEventListeners = function () {
		console.log('in app.savedLocations.addEventListeners');

		//action bar overflow
		document.getElementById('btnHome').addEventListener('click', app.navUtils.goHome);
		document.getElementById('btnScan').addEventListener('click', app.navUtils.goToScan);

		// context menu
		document.getElementById('btnDelete').addEventListener('click', pub.doDeletePrompt);
		document.getElementById('btnDetails').addEventListener('click', pub.viewDetails);
		document.getElementById('btnWeather').addEventListener('click', pub.showWeather);
		document.getElementById('btnMap').addEventListener('click', pub.showMap);
		document.getElementById('btnImages').addEventListener('click', pub.showImages);
	};

	initUI = function () {
		$(ideaList).fadeOut('fast');
	};

	pub.populateIdeaGrid = function () {
		console.log('in app.ideaJournal.populateIdeaGrid');
		
		app.model.selectedIdea = null;

		var ideaList = document.getElementById('ideaList'),
			numIdeas = app.model.savedIdeas.length,
			i, idea, newItem;
		console.log(' the number of ideas are ' + numIdeas);

		for (i = 1; i < 5; i++) {
					
			idea = localStorage.getItem(i);
			newItem = document.createElement('div');
			newItem.setAttribute('data-bb-type', 'item');
			newItem.setAttribute('data-bb-title', localStorage.getItem(i));
			newItem.setAttribute('data-bb-accent-text', 'this is the description');
			newItem.setAttribute('data-idx', '1');
			//newItem.innerHTML = idea.ideaDescription;
			ideaList.appendItem(newItem);
			var retrievedObject = JSON.parse(localStorage.getItem('5'));
			console.log('The value of the JSON object is ' + retrievedObject.description );

			$(newItem).on('click', function (event) {
				var rowIdx = event.currentTarget.dataset.idx,
					context = document.getElementById('contextMenu'),
					selectedIdea;

				selectedIdea = app.model.savedIdeas[rowIdx];
				//if (selectedIdea) {
					//app.model.selectedIdea = selectedIdea;
					console.log('Click on idea ' + i);
					context.menu.show({title : localStorage.getItem(i)});
				//}
			});
		} 
		$(ideaList).fadeIn('fast');
	};

	pub.showMap = function () {
		console.log('saved locations screen -> Map button');
		var url = 'http://maps.google.ca/maps?q=' + app.model.selectedLocationVO.latitude + '%2C' + app.model.selectedLocationVO.longitude;
		app.browserUtils.openBrowser(url);
	};

	pub.showWeather = function () {
		console.log('saved locations screen -> Weather button');

		bb.pushScreen('weather.html', 'weatherScreen');
	}; 

	pub.showImages = function () {
		console.log('saved locations screen -> Images button');

		bb.pushScreen('images.html', 'imagesScreen');
	};

	pub.viewDetails = function () {
		console.log('saved locations screen -> Details button');

		bb.pushScreen('locationDetails.html', 'locationDetailsScreen');
	};

	pub.doDeletePrompt = function () {
		console.log('saved locations screen -> Delete button');
		try {
			blackberry.ui.dialog.standardAskAsync(
				'Do you really want to delete this location? This can not be undone.',
				blackberry.ui.dialog.D_YES_NO,
				pub.doDelete,
				{
					title : 'Delete ' + app.model.selectedLocationVO.name + '?',
					size : blackberry.ui.dialog.SIZE_MEDIUM,
					position : blackberry.ui.dialog.CENTER
				}
			);
		} catch (e) {
			console.log('Exception in standardDialog: ' + e);
		}
	};

	pub.doDelete = function (index) {
		if (index.return === "Yes") {
			console.log('attempting to delete location ' + app.model.selectedLocationVO.name);

			window.addEventListener('LOCATIONS_RETRIEVED', pub.onDeleteSuccess);
			app.databaseUtils.deleteLocation(app.database, app.model.selectedLocationVO)
		}
	};

	pub.onDeleteSuccess = function (event) {
		console.log('onDeleteSuccess');
		window.removeEventListener('LOCATIONS_RETRIEVED', pub.onDeleteSuccess);

		document.getElementById('locationsImageList').clear();
		pub.populateLocationsGrid();
	};

	return pub;
}();
