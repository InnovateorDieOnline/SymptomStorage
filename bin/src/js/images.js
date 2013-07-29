app.images = function () {

	'use strict';

	var pub = {
			imageSearchServices : [],
			searchSuccess : false,
			serviceName : '',
			flickrApiKey : '529401a02adc04abb6bdef855574aeee',
			imageURL : ''
		},
		initUI;

	pub.onDOMReady = function () {
		console.log('in app.images.onDOMReady');
		pub.addEventListeners();
		pub.resetServices();
		initUI();
		pub.getSearchService();
	};

	pub.addEventListeners = function () {
		$('#btnBrowser').on('click', pub.viewInBrowser);
	};

	pub.resetServices = function () {

		/** Deprecation Notice!
		 *
		 * The free Google Image Search API was deprecated as of May 26, 2011
		 * https://developers.google.com/image-search/
		 *
		 * It should continue to work until May 26, 2014 according to these terms of service
		 * https://developers.google.com/image-search/terms
		 *
		 */

		pub.imageSearchServices = [
			{
				serviceName : 'flickr',
				parseFunction : pub.parseFlickr,
				searchURL : 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + pub.flickrApiKey + '&safe_search=1&per_page=4&page=1&content_type=1&privacy_filter=1&format=json&nojsoncallback=1&text=' + app.model.selectedLocationVO.name
			}
			,
			{
				serviceName : 'google',
				parseFunction : pub.parseGoogle,
				searchURL : 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + app.model.selectedLocationVO.name
			}
			,
			{
				serviceName : 'localGoogle',
				parseFunction : pub.parseGoogle,
				searchURL : 'data/googleImages.json'
			}
			,
			{
				serviceName : 'localFlickr',
				parseFunction : pub.parseFlickr,
				searchURL : 'data/flickrImages.json'
			}
		];
	};

	initUI = function () {
		document.getElementById('screenTitle').setCaption(app.model.selectedLocationVO.name);
	};

	pub.getSearchService = function () {
		console.log('in pub.getSearchService');

		var service = pub.imageSearchServices.shift();
		if (service !== undefined) {
			console.log('about to start search with url: ' + service.searchURL);
			pub.doSearch(service);
		} else {
			console.log('NO SERVICES AVAILABLE... aborting image search');
		}
	};

	pub.doSearch = function (service) {

		var searchURL = service.searchURL,
			successHandler = service.parseFunction;

		console.log('    IN pub.doSearch: ' + searchURL);
		pub.searchSuccess = false;

		$.ajax({
			url : searchURL,
			timeout : 3000,
			dataType : 'json',
			success : function (data, textStatus, jqXHR) {
				// the successHandler function must indicate whether it was able to successfully parse the data it received
				pub.searchSuccess = successHandler.call(pub, data, textStatus, jqXHR);
				// so that the ajax complete handler knows whether to stop searching or to try again
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('  in ajax error: status: ' + textStatus);
				console.log('  in ajax error: error : ' + errorThrown);
			},
			complete : function (jqXHR, textStatus) {
				console.log('  in ajax complete: textStatus ' + textStatus);
				if (pub.searchSuccess) {
					console.log('  ajax call succeeded, displaying results');
					// data was retrieved and successfully parsed
					pub.resetServices();
					// keep track of where the results came from
					pub.serviceName = service.serviceName;
					pub.displayImages();
				} else {
					console.log('  ajax call did not succeed, trying again with the next service...');
					// data retrieval or parsing failed, try again with next available search service
					pub.getSearchService();
				}
			}
		});
	};

	pub.parseGoogle = function (data, textStatus, jqXHR) {
		console.log('google parser textStatus: ' + textStatus);
		var success = false,
			results, numResults, i, result, imageVO;

		if (data.responseData) {
			try {
				results = data.responseData.results;
				console.log('    results from google: ' + results);
				app.model.images = [];

				numResults = results.length;
				for (i = 0; i < numResults; i++) {
					result = results[i];
					imageVO = new ImageVO();

					// for google, show the thumbnail image, and pass the original image url to the browser
					imageVO.image_ID = i;
					imageVO.thumbnail_url = result.tbUrl;
					imageVO.large_url = result.url;

					app.model.images.push(imageVO);
				}
				success = true;
			} catch (e) {
				console.log('    error parsing results from google');
			}
		} else {
			console.log('    google returned something expected');
		}
		return success;
	};

	pub.parseFlickr = function (data, textStatus, jqXHR) {
		console.log('flickr parser textStatus: ' + textStatus);
		var success = false,
			results, numResults, i, result, imageVO;

		if (data.photos) {
			try {
				results = data.photos.photo;
				console.log('    results from flickr: ' + results);
				app.model.images = [];

				numResults = results.length;
				for (i = 0; i < numResults; i++) {
					result = results[i];
					imageVO = new ImageVO();

					// for flickr, show the original image, not the thumbnail
					imageVO.image_ID = i;
					imageVO.thumbnail_url = '';
					imageVO.large_url = 'http://farm' + result.farm + '.staticflickr.com/' + result.server + '/' + result.id + '_' + result.secret + '_b.jpg';
					/*

					 flickr api docs (http://www.flickr.com/services/api/misc.urls.html)

					 url format is:
					 http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg

					 size suffixes are:
					 s	small square 75x75
					 q	large square 150x150
					 t	thumbnail, 100 on longest side
					 m	small, 240 on longest side
					 n	small, 320 on longest side
					 -	medium, 500 on longest side
					 z	medium 640, 640 on longest side
					 c	medium 800, 800 on longest side†
					 b	large, 1024 on longest side*
					 o	original image, either a jpg, gif or png, depending on source format

					 * Before May 25th 2010 large photos only exist for very large original images.
					 † Medium 800 photos only exist after March 1st 2012.

					 */

					app.model.images.push(imageVO);
				}
				success = true;

			} catch (e) {
				console.log('    error parsing results from flickr');
			}

		} else {
			console.log('    flickr returned something expected');
		}

		return success;
	};

	pub.viewInBrowser = function () {
		app.browserUtils.openBrowser(pub.imageURL);
	};

	pub.peekContextMenu = function () {
		document.getElementById('contextMenu').menu.peek();
	};

	pub.displayImages = function () {

		var numImages = app.model.images.length,
			i, image, imageElement;

		switch (pub.serviceName) {
			case 'flickr' :
			case 'localFlickr' :

				console.log('displaying flickr images');

				$('#flickrOutput').fadeOut('fast');

				for (i = 0; i < numImages; i++) {
					image = app.model.images[i];
					imageElement = '<img src="' + image.large_url + '">';
					$('#scrollPanelImages').append(imageElement);
				}

				$('#scrollPanelImages').on('click', 'img', function () {
					pub.imageURL = this.src;
					pub.peekContextMenu();
				});

				$('#activityIndicator').fadeOut('fast', function () {
					$('#flickrOutput').fadeIn('fast');
				});


				break;

			case 'google' :
			case 'localGoogle' :

				console.log('displaying google images');

				$('#googleOutput').fadeOut('fast');

				for (i = 0; i < numImages; i++) {
					image = app.model.images[i];
					imageElement = '<img src="' + image.thumbnail_url + '" data-large-url="' + image.large_url + '">';
					$('#scrollPanelThumbs').append(imageElement);
				}
				$('#scrollPanelThumbs').on('click', 'img', function (event) {
					pub.imageURL = event.target.dataset.largeUrl;
					pub.peekContextMenu();
				});

				$('#activityIndicator').fadeOut('fast', function () {
					$('#googleOutput').fadeIn('fast');
				});

				break;

			default:
				break;
		}
	};

	return pub;
}();
