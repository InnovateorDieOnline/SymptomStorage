app.weather = function () {

	'use strict';

	var pub = {
			outputFormat : 'xml',
			APIkey : 'ab6cdba784152217122509',
			usingCelsius : true,
			usingKilometres : true,
			lblC : 'Use &deg;C',
			lblF : 'Use &deg;F',
			lblM : 'Use mph',
			lblK : 'Use km/h',
			iconM : 'assets/icons/speedMph.png',
			iconK : 'assets/icons/speedKmh.png',
			weatherDataRetrieved : false
		},
		initUI;

	pub.weatherURL = 'http://free.worldweatheronline.com/feed/weather.ashx?key=' + pub.APIkey + '&num_of_days=2&format=' + pub.outputFormat + '&q=';

	pub.onDOMReady = function () {
		console.log('in app.weather.onDOMReady');
		initUI();
		pub.getWeatherDetails();
	};

	initUI = function () {
		$('#weatherContainer').hide();
		$('#btnToggleCelsius').get(0).setCaption(pub.usingCelsius ? pub.lblF : pub.lblC);
		$('#btnToggleKilometres').get(0).setCaption(pub.usingKilometres ? pub.lblM : pub.lblK);
		$('#btnToggleKilometres').get(0).setImage(pub.usingKilometres ? pub.iconM : pub.iconK);
	};

	pub.addEventListeners = function () {
		$('#btnToggleCelsius').on('click', pub.toggleTemperature);
		$('#btnToggleKilometres').on('click', pub.toggleSpeed);
	};

	pub.getWeatherDetails = function () {
		console.log('in app.weather.getWeatherDetails');
		var locationVO,
			lat,
			lon,
			locationWeatherURL;

		locationVO = app.model.selectedLocationVO;
		if (locationVO) {

			lat = parseFloat(locationVO.latitude).toFixed(2);
			lon = parseFloat(locationVO.longitude).toFixed(2);
			console.log('lat: ' + lat + ', lon: ' + lon);

			locationWeatherURL = pub.weatherURL + lat + ',' + lon;
			// or use this URL when no network connection is available
			//locationWeatherURL = 'data/weatherData.xml';

			console.log('locationWeatherURL: ' + locationWeatherURL);

			$.ajax({
				type : 'GET',
				url : locationWeatherURL,
				timeout : 5000,
				dataType : pub.outputFormat,
				success : function (response, status, xhr) {
					console.log(response);
					var weatherData = $(response).find('data');
					if (weatherData) {
						app.model.weatherData = weatherData;
						pub.weatherDataRetrieved = true;
					}
				},
				error : function (jqXHR, textStatus, errorThrown) {
					console.log('  in ajax error: status: ' + textStatus);
					console.log('  in ajax error: error : ' + errorThrown);
				},
				complete : function (jqXHR, textStatus) {
					console.log('  in ajax complete: textStatus ' + textStatus);
					if (pub.weatherDataRetrieved) {
						pub.addEventListeners();
						pub.displayWeatherDetails();
					} else {
						console.log('   ajax call for ' + locationVO.name + ' weather data did not succeed');
						$('#activityIndicator').fadeOut('fast', function () {
							console.log('try again with the local weather data');
						});
					}
				}
			});
		}

	};

	pub.displayWeatherDetails = function () {

		var screenTitle,
			weatherData,
			currentCondition, weatherDescription1, weatherIconUrl1, tempC1, tempF1, tempDetails1, windspeedMiles1, windspeedKilometres1, windDirection1, windDetails1, weatherDetails1,
			day2Condition, weatherDate2, weatherDescription2, weatherIconUrl2, tempMaxC2, tempMinC2, tempMinF2, tempMaxF2, tempDetails2, windspeedMiles2, windspeedKilometres2, windDirection2, windDetails2, weatherDetails2,
			day3Condition, weatherDate3, weatherDescription3, weatherIconUrl3, tempMaxC3, tempMinC3, tempMinF3, tempMaxF3, tempDetails3, windspeedMiles3, windspeedKilometres3, windDirection3, windDetails3, weatherDetails3;

		screenTitle = app.model.selectedLocationVO.name;
		document.getElementById('screenTitle').setCaption(screenTitle);

		weatherData = app.model.weatherData;
		currentCondition = $(weatherData).find('current_condition');
		weatherDescription1 = currentCondition.find('weatherDesc').text();
		weatherIconUrl1 = currentCondition.find('weatherIconUrl').text();

		tempC1 = currentCondition.find('temp_C').text();
		tempF1 = currentCondition.find('temp_F').text();
		tempDetails1 = pub.usingCelsius ? tempC1 + '&deg;C' : tempF1 + '&deg;F';

		windspeedMiles1 = currentCondition.find('windspeedMiles').text();
		windspeedKilometres1 = currentCondition.find('windspeedKmph').text();
		windDirection1 = currentCondition.find('winddir16Point').text();
		windDetails1 = ' wind: ';
		windDetails1 += pub.usingKilometres ? windspeedKilometres1 + 'km/h' : windspeedMiles1 + 'mph';
		windDetails1 += ' ' + windDirection1;

		weatherDetails1 = tempDetails1 + windDetails1 + '<br />' + weatherDescription1;

		day2Condition = $(weatherData).find('weather').get(0);
		weatherDate2 = $(day2Condition).find('date').text();
		weatherDescription2 = $(day2Condition).find('weatherDesc').text();
		weatherIconUrl2 = $(day2Condition).find('weatherIconUrl').text();

		tempMaxC2 = $(day2Condition).find('tempMaxC').text();
		tempMinC2 = $(day2Condition).find('tempMinC').text();
		tempMinF2 = $(day2Condition).find('tempMinF').text();
		tempMaxF2 = $(day2Condition).find('tempMaxF').text();
		tempDetails2 = pub.usingCelsius ? tempMinC2 + '&ndash;' + tempMaxC2 + '&deg;C' : tempMinF2 + '&ndash;' + tempMaxF2 + '&deg;F';

		windspeedMiles2 = $(day2Condition).find('windspeedMiles').text();
		windspeedKilometres2 = $(day2Condition).find('windspeedKmph').text();
		windDirection2 = $(day2Condition).find('winddir16Point').text();
		windDetails2 = ' wind: ';
		windDetails2 += pub.usingKilometres ? windspeedKilometres2 + 'km/h' : windspeedMiles2 + 'mph';
		windDetails2 += ' ' + windDirection2;

		weatherDetails2 = tempDetails2 + windDetails2 + '<br />' + weatherDescription2;

		day3Condition = $(weatherData).find('weather').get(1);
		weatherDate3 = $(day3Condition).find('date').text();
		weatherDescription3 = $(day3Condition).find('weatherDesc').text();
		weatherIconUrl3 = $(day3Condition).find('weatherIconUrl').text();

		tempMaxC3 = $(day3Condition).find('tempMaxC').text();
		tempMinC3 = $(day3Condition).find('tempMinC').text();
		tempMinF3 = $(day3Condition).find('tempMinF').text();
		tempMaxF3 = $(day3Condition).find('tempMaxF').text();
		tempDetails3 = pub.usingCelsius ? tempMinC3 + '&ndash;' + tempMaxC3 + '&deg;C' : tempMinF3 + '&ndash;' + tempMaxF3 + '&deg;F';

		windspeedMiles3 = $(day3Condition).find('windspeedMiles').text();
		windspeedKilometres3 = $(day3Condition).find('windspeedKmph').text();
		windDirection3 = $(day3Condition).find('winddir16Point').text();
		windDetails3 = ' wind: ';
		windDetails3 += pub.usingKilometres ? windspeedKilometres3 + 'km/h' : windspeedMiles3 + 'mph';
		windDetails3 += ' ' + windDirection3;

		weatherDetails3 = tempDetails3 + windDetails3 + '<br />' + weatherDescription3;

		$('#now > .weatherIcon').attr('src', weatherIconUrl1);
		$('#now > .weatherString').html(weatherDetails1);

		$('#today > .weatherIcon').attr('src', weatherIconUrl2);
		$('#today > .weatherString').html(weatherDetails2);
		$('#today > .dateHeading').html(dateFormat(weatherDate2, 'dddd'));

		$('#tomorrow > .weatherIcon').attr('src', weatherIconUrl3);
		$('#tomorrow > .weatherString').html(weatherDetails3);
		$('#tomorrow > .dateHeading').html(dateFormat(weatherDate3, 'dddd'));

		$('#activityIndicator').fadeOut('fast', function () {
			$('#container').fadeIn('fast');
		});
	};

	pub.toggleTemperature = function () {
		console.log('pub.toggleTemperature');

		pub.usingCelsius = !pub.usingCelsius;
		pub.displayWeatherDetails();
		$('#btnToggleCelsius').get(0).setCaption(pub.usingCelsius ? pub.lblF : pub.lblC);
	};

	pub.toggleSpeed = function () {
		console.log('pub.toggleSpeed');

		pub.usingKilometres = !pub.usingKilometres;
		pub.displayWeatherDetails();
		$('#btnToggleKilometres').get(0).setCaption(pub.usingKilometres ? pub.lblM : pub.lblK)
		$('#btnToggleKilometres').get(0).setImage(pub.usingKilometres ? pub.iconM : pub.iconK);
	};

	return pub;
}();
