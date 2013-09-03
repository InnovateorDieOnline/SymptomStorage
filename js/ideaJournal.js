app.ideaJournal = function () {

	'use strict';
	localStorage.clear();
	var job1 = { 'idea' : 'a good idea'};
	localStorage.setItem('1', JSON.stringify(job1));
	var job2 = {'idea' : 'a sort of good idea'};
	localStorage.setItem("2", JSON.stringify(job2));
	var job3 = {'idea' : 'a terrible idea'};
	localStorage.setItem("3", JSON.stringify(job3));
	var job4 = {'idea' : 'a better than bad idea'};
	localStorage.setItem("4", JSON.stringify(job4));
	
	var JSONObject_idea = {'idea' : 'some kind of good idea', 'description' : 'you won'};
	localStorage.setItem("5", JSON.stringify(JSONObject_idea));	
	
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
		$('#btnHome').bind('click', app.navUtils.goHome);
		$('#btnScan').bind('click', app.navUtils.goToScan);

		// context menu
		$('#btnDelete').bind('click', pub.doDeletePrompt);
		$('#btnDetails').bind('click', pub.viewDetails);		
		$('#btnImages').bind('click', pub.showImages);
	};

	initUI = function () {
		$(ideaList).fadeOut('fast');
	};

	pub.populateIdeaGrid = function () {
		
		console.log('in app.ideaJournal.populateIdeaGrid');
		
		var ideaList = document.getElementById('ideaList');			

		for (i = 0; i < localStorage.length; i++) {
					
			var	idea = JSON.parse(localStorage.getItem(localStorage.key(i)));
			
			var	newItem = document.createElement('div');
			newItem.setAttribute('data-bb-type', 'item');
			newItem.setAttribute('data-bb-title', idea.idea);
			newItem.setAttribute('data-bb-accent-text', 'something');
			newItem.setAttribute('data-idx', i);
			//newItem.innerHTML = idea.ideaDescription;
			ideaList.appendItem(newItem);
			//var retrievedObject = JSON.parse(localStorage.getItem('5'));
			//console.log('The value of the JSON object is ' + retrievedObject.description );

			$(newItem).on('click', function (event) {
				var rowIdx = event.currentTarget.dataset.idx;
				var	context = document.getElementById('contextMenu');				
				var	selectedIdea = event.currentTarget;		
				
				context.menu.show();	

				
			});
		} 
		$(ideaList).fadeIn('fast');
	};
	
	pub.showImages = function () {
		console.log('saved locations screen -> Images button');

		bb.pushScreen('images.html', 'imagesScreen');
	};

	pub.viewDetails = function (ideaDetails) {
		console.log('saved ideas screen -> Details button');

		bb.pushScreen('ideaDetails.html', 'ideaDetailsScreen', {idea : selectedIdea});
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
