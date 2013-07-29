app.calendar = function () {

	'use strict';

	var pub = {},
		tag = 'MTL',
		detailLevel = blackberry.pim.calendar.CalendarFindOptions.DETAIL_FULL,
		initUI,
		addEventListeners,
		populateEventsList,
		onFindSuccess,
		onFindError,
		openAddCalendarCard,
		onDone,
		onCancel,
		onInvoke;

	pub.onDOMReady = function () {
		console.log('in app.calendar.onDOMReady');
		addEventListeners();
		initUI();
		populateEventsList();
	};

	addEventListeners = function () {
		console.log('in app.calendar.addEventListeners');
		document.getElementById('btnAddEvent').addEventListener('click', openAddCalendarCard);
		document.getElementById('btnRefresh').addEventListener('click', populateEventsList);
	};

	initUI = function () {
		$(eventsList).fadeOut('fast');
	};

	populateEventsList = function () {
		console.log('in app.calendar.populateEventsList');
		var filter = {
				substring : tag,
				start : new Date()
			},
			findOptions = {
				filter : filter,
				detail : detailLevel
			};

		blackberry.pim.calendar.findEvents(findOptions, onFindSuccess, onFindError);
	};

	onFindSuccess = function (events) {
		var eventsList = document.getElementById('eventsList'),
			newItem;

		events.forEach(function (evt) {
			newItem = document.createElement('div');
			newItem.setAttribute('data-bb-type', 'item');
			newItem.setAttribute('data-bb-style', 'removebuttons');
			newItem.setAttribute('data-bb-title', evt.summary + (evt.location ? ' @ ' + evt.location : ''));
			newItem.setAttribute('data-bb-accent-text', evt.location);
			newItem.innerHTML = evt.start;
			eventsList.appendItem(newItem);
		});

		$(eventsList).fadeIn('fast');
	};

	onFindError = function (error) {
		if (error) {
			switch (error.code) {
				case error.UNKNOWN_ERROR:
					console.log('Find event error: An unknown error occurred');
					break;
				case error.INVALID_ARGUMENT_ERROR:
					console.log('Find event error: Invalid argument');
					break;
				case error.PERMISSION_DENIED_ERROR:
					console.log('Find event error: Permission denied error');
					break;
				default:
					console.log('Find event error: other error, code=' + error.code);
			}
		} else {
			console.log('Calendar event find success');
		}
	};

	openAddCalendarCard = function () {
		var calendarComposerOptions = {
			accountId : blackberry.pim.calendar.getDefaultCalendarAccount().id,
			folderId : blackberry.pim.calendar.getDefaultCalendarFolder().id,
			body : tag,
			subject : 'dinner reservation',
			participants : ['me@vacation.com', 'you@funtimes.com']
		};

		blackberry.invoke.card.invokeCalendarComposer(calendarComposerOptions, onDone, onCancel, onInvoke);
	};

	onDone = function () {
		console.log('onDone');
	};

	onCancel = function () {
		console.log('onCancel');
	};

	onInvoke = function () {
		console.log('onInvoke');
	};

	return pub;
}();
