app.databaseUtils = function () {

	'use strict';

	var pub = {};

	pub.getData = function () {
		console.log('pub.getData');

		app.model.selectedLocationVO = null;
		app.model.selectedIdea = null;

		if (!app.database) {
			console.log('No database defined.');
			return;
		}

		app.database.transaction(function (tx) {
			var createSQL;

			tx.executeSql('SELECT COUNT(*) FROM location', [], function (tx, result) {
				console.log('Location table exists');
				pub.getLocations(app.database);
			}, function (tx, error) {
				console.log('Creating Location table');
				createSQL = pub.getDBCreationSQL();
				pub.createTable(app.database, createSQL);
			});
		});	
		
		app.database.transaction(function (tx) {
			var createIdeaSQL;

			tx.executeSql('SELECT COUNT(*) FROM idea', [], function (tx, result) {
				console.log('Idea table exists');
				pub.getIdea(app.database);
			}, function (tx, error) {
				console.log('Creating Idea table');
				createIdeaSQL = pub.getIdeaDBCreationSQL();
				pub.createIdeaTable(app.database, createIdeaSQL);				
			});
		});
		
	/*	app.database.transaction(function (tx) {
			var createIdeaSQL;

			tx.executeSql('SELECT COUNT(*) FROM idea', [], function (tx, result) {
				console.log('Idea table exists');
				pub.getIdea(app.database);
			}, function (tx, error) {
				console.log('Creating Idea table');
				createIdeaSQL = pub.getIdeaDBCreationSQL();
				pub.createIdeaTable(app.database, createIdeaSQL);
			});
		}); */
	};

	pub.createTable = function (database, createSQL) {
		database.transaction(function (tx) {
			tx.executeSql('SELECT COUNT(*) FROM location', [], function (tx, result) {
				console.log('Location table exists');
			}, function (tx, error) {
				var populateSQL;
				tx.executeSql(createSQL, [], function (tx, result) {
					console.log('Created location table');
					populateSQL = pub.getDBPopulateSQL();
					pub.populateTable(app.database, populateSQL);
				}, function (tx, error) {
					console.log('Error creating location table:\n' + error.message);
				});
			});
		});
	};
	
	pub.createIdeaTable = function (database, createIdeaSQL) {
		pub.dropTable(ideaDatabase, 'idea');
		ideaDatabase.transaction(function (tx) {
			tx.executeSql('SELECT COUNT(*) FROM idea', [], function (tx, result) {
				console.log('Idea table exists');
			}, function (tx, error) {
				var populateIdeaSQL;
				tx.executeSql(createIdeaSQL, [], function (tx, result) {
					console.log('Created idea table');
					populateIdeaSQL = pub.getIdeaDBPopulateSQL();
					pub.populateIdeaTable(app.ideaDatabase, populateIdeaSQL);
				}, function (tx, error) {
					console.log('Error creating idea table:\n' + error.message);
				});
			});
		});
	};

	pub.getDBCreationSQL = function () {
		console.log('inside getDBCreationSQL');
		// for this to work in ripple, a MIME type must be configured in IIS (.sql == text/plain)
		var filePath = 'data/create.sql',
			createSQL = '';

		$.ajax({
			url : filePath,
			async : false,
			dataType : 'text',
			success : function (data) {
				console.log("got create.sql");
				console.log(data);
				createSQL = data;
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('error reading ' + filePath);
				console.log('errorThrown: ' + errorThrown);
			},
			complete : function (jqXHR, textStatus) {
				console.log(filePath + ' read complete, textStatus: ' + textStatus);
				if (createSQL === '') {
					console.log('relying on hard-coded sql');
					createSQL = 'CREATE TABLE location ( '
						+ 'location_ID INTEGER PRIMARY KEY NOT NULL, '
						+ 'name VARCHAR, ' + 'description TEXT, '
						+ 'latitude NUMERIC NOT NULL, '
						+ 'longitude NUMERIC NOT NULL, '
						+ 'horizontalAccuracy NUMERIC NOT NULL DEFAULT (0), '
						+ 'addDate DATETIME DEFAULT CURRENT_TIMESTAMP ' + ');';

				}
			}
		});
		console.log('returning createSQL: ' + createSQL);

		return createSQL;
	};

	pub.getDBPopulateSQL = function () {

		var filePath = 'data/populate.sql',
			populateSQL = '';

		$.ajax({
			url : filePath,
			async : false,
			dataType : 'text',
			success : function (data) {
				console.log("got populate.sql");
				console.log(data);
				populateSQL = data;
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('error reading ' + filePath);
				console.log('errorThrown: ' + errorThrown);
			},
			complete : function (jqXHR, textStatus) {
				console.log(filePath + ' read complete, textStatus: ' + textStatus);
				if (populateSQL === '') {
					console.log('relying on hard-coded sql');
					populateSQL = "INSERT INTO 'location' (location_ID, name, description, latitude, longitude, horizontalAccuracy)"
						+ "SELECT '1' AS 'location_ID', 'Mississauga, ON, CA' AS 'name', 'Where the fun begins' AS 'description', '43.5972036' AS 'latitude', '-79.636378' AS 'longitude', '0' AS horizontalAccuracy"
						+ " UNION SELECT '2', 'Waterloo, ON, CA', 'Birthplace of BB10!', '43.480951', '-80.536115', '30'"
						+ " UNION SELECT '3', 'London, UK', 'Looks like rain...', '51.500148', '-0.126313', '10'"
						+ " UNION SELECT '4', 'Paris, France', 'C''est bon, mon ami', '48.858399', '2.294198', '10'"
						+ " UNION SELECT '5', 'Kawah Putih, Indonesia', 'The White Crater', '-7.1658333', '107.4008333', '30'"
						+ " UNION SELECT '6', 'Bangkok, Thailand', 'Home of the Golden Buddha', '13.738072', '100.513921', '30'"
						+ " UNION SELECT '7', 'Bermuda', 'Grotto Bay Beach Resort', '32.352939', '-64.712541', '1'"
						+ " UNION SELECT '8', 'Buenos Aires, Argentina', 'Do you like to tango?', '-34.603391', '-58.381650', '20'"
						+ " UNION SELECT '9', 'Hyderabad, Andhra Pradesh, India', 'Try the biryani, you will not regret it!', '17.387378', '78.480614', '20'";
				}
			}
		});

		console.log('returning populateSQL: ' + populateSQL);
		return populateSQL;
	};

	pub.doesDatabaseExist = function (databaseName) {
		var doesDBExist = true,
			database = window.openDatabase(databaseName, '1.0', 'Locations database.', 5 * 1024 * 1024); // 5MB

		if (!database) {
			doesDBExist = false;
		}
		return doesDBExist;
	};

	pub.doesTableExist = function (database, tableName) {
		var doesTExist = true;
		database.transaction(function (tx) {
			tx.executeSql('SELECT COUNT(*) FROM ' + tableName, [], function (tx, result) {
				console.log('table exists');
			}, function (tx, error) {
				doesTExist = false;
			});
		});
		return doesTExist;
	};

	pub.getDatabase = function () {
		var database = window.openDatabase('locations', '1.0', 'description', 5 * 1024 * 1024); // 5MB
		console.log('inside pub.getDatabase');
		if (!database) {
			console.log('Database connection failed.');
		}
		return database;
	};
	
	pub.getIdeaDatabase = function () {
		var ideaDatabase = window.openDatabase('idea', '1.0', 'ideaDescription', 5*1024*1024);
		console.log('inside pub.getideaDatabase');
		if (!ideaDatabase) {
			console.log('Database connection failed.');
		}
		return ideaDatabase
	};

	pub.populateTable = function (database, populateSQL) {
		console.log('pub.populateTable');

		database.transaction(function (tx) {
			tx.executeSql(populateSQL, [], function (tx, result) {
				console.log('Populated location table');
				pub.getLocations(app.database);
			}, function (tx, error) {
				console.log('Error populating location table:\n' + error.message);
			});
		});
	};

	pub.dropTable = function (database, tableName) {

		var dropSQL = 'DROP TABLE ' + tableName;

		try {
			database.transaction(function (tx) {
				tx.executeSql(dropSQL, [], function (tx, result) {
					console.log('Dropped table');
				}, function (tx, error) {
					console.log('Error dropping table:\n' + error.message);
				});
			});
		} catch (e) {
			console.log('Error caught dropping table:\n' + e.message);
		}
	};

	pub.getLocations = function (database) {
		console.log('Getting locations.');

		var selectSQL = 'SELECT location_ID, '
			+ 'name, '
			+ 'description, '
			+ 'latitude, '
			+ 'longitude, '
			+ 'horizontalAccuracy, '
			+ 'addDate '
			+ 'FROM location '
			+ 'ORDER BY location_ID DESC';

		app.model.savedLocations = [];
		
		//app.model.ideaList = [];

		database.transaction(function (tx) {
			tx.executeSql(selectSQL, [], function (tx, result) {
				var rows = result.rows,
					numRows = rows.length,
					locationVO,
					i;
				console.log('numRows is ' + numRows);
				for (i = 0; i < numRows; i++) {
					locationVO = new LocationVO(rows.item(i));
					app.model.savedLocations.push(locationVO);
				}
				pub.dispatchDBEvent('LOCATIONS_RETRIEVED');

			}, function (tx, error) {
				console.log('Error getting location records:\n' + error.message);
			});
		});
	};

	pub.updateLocation = function (database, locationVO) {

		var updateSQL = 'UPDATE location ' +
			'SET ' +
			'	name = ?, ' +
			'	description = ? ' +
			'WHERE location_ID = ?';

		database.transaction(function (tx) {
			tx.executeSql(updateSQL, [locationVO.name, locationVO.description, locationVO.location_ID], function (tx, result) {
				console.log('Updated location.');
				pub.getData();
			}, function (tx, error) {
				console.log('Error updating:\n' + error.message);
			});
		});
	};

	pub.addLocation = function (database, locationVO) {

		var insertSQL = "INSERT INTO location "
			+ "( name, description, latitude, longitude, horizontalAccuracy, addDate ) "
			+ "VALUES ("
			+ "		'" + locationVO.name + "', "
			+ "		'" + locationVO.description + "', "
			+ " 	'" + locationVO.latitude + "', "
			+ "		'" + locationVO.longitude + "', "
			+ "		'" + locationVO.horizontalAccuracy + "', "
			+ "		'" + locationVO.addDate + "' "
			+ ")";

		database.transaction(function (tx) {
			tx.executeSql(insertSQL, [], function (tx, result) {
				console.log('Inserted location.');
				pub.getData();
			}, function (tx, error) {
				console.log('Error inserting:\n' + error.message);
			});
		});
	};

	pub.deleteLocation = function (database, locationVO) {

		var deleteSQL =
			'DELETE FROM location ' +
				'WHERE location_ID = ' + locationVO.location_ID;

		database.transaction(function (tx) {
			tx.executeSql(deleteSQL, [], function (tx, result) {
				console.log('Deleted location ' + locationVO.name);
				pub.getData();
			}, function (tx, error) {
				console.log('Error deleting:\n' + error.message);
			});
		});
	};

	pub.dispatchDBEvent = function (type) {
		var evt = document.createEvent('Events');
		evt.initEvent(type, true, true);
		document.dispatchEvent(evt);
	};

	pub.getSQLiteVersion = function (database) {
		var versionSQL = 'SELECT DISTINCT sqlite_version() AS version FROM sqlite_master;',
			version = 'unknown SQLite version';

		database.transaction(function (tx) {
			tx.executeSql(versionSQL, [], function (tx, result) {

				var rows = result.rows,
					numRows = rows.length,
					i, item;

				for (i = 0; i < numRows; i++) {
					item = rows.item(i);
					alert(item.version);
				}

			}, function (tx, error) {
				console.log('Error getting SQLite version.\n' + error.message);
			});
		});
	};
	
	pub.getIdea = function (database){
		console.log('Getting ideas.');

		var selectIdeaSQL = 'SELECT idea_ID, '
			+ 'ideaTitle, '
			+ 'ideaDescription '
			+ 'date '
			+ 'FROM idea '
			+ 'ORDER BY idea_ID DESC';

		app.model.savedIdeas = [];

		database.transaction(function (tx) {
			tx.executeSql(selectIdeaSQL, [], function (tx, result) {
				var rows = result.rows,
					numRows = rows.length,
					idea,
					i;
				console.log('numRows is ' + numRows);
				for (i = 0; i < numRows; i++) {
					idea = new idea(rows.item(i));
					app.model.savedIdeas.push(idea);
				}
				pub.dispatchDBEvent('Ideas_RETRIEVED');

			}, function (tx, error) {
				console.log('Error getting idea records:\n' + error.message);
			});
		});
	};
	
		
	pub.populateIdeaTable = function (ideaDatabase, populateIdeaSQL) {
		console.log('pub.populateTable');

		ideaDatabase.transaction(function (tx) {
			tx.executeSql(populateIdeaSQL, [], function (tx, result) {
				console.log('Populated Idea table');
				pub.getIdea(app.ideaDatabase);
			}, function (tx, error) {
				console.log('Error populating idea table:\n' + error.message);
			});
		});
	};
	
	pub.getIdeaDBPopulateSQL = function (){
		console.log('inside getIdeaDBPopulateSQL');
		var filePath = 'data/populateIdeas.sql',
			populateIdeaSQL = '';

		$.ajax({
			url : filePath,
			async : false,
			dataType : 'text',
			success : function (data) {
				console.log("got populateIdeas.sql");
				console.log(data);
				populateIdeaSQL = data;
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('error reading ' + filePath);
				console.log('errorThrown: ' + errorThrown);
			},
			complete : function (jqXHR, textStatus) {
				console.log(filePath + ' read complete, textStatus: ' + textStatus);
				if (populateIdeaSQL === '') {
					console.log('relying on hard-coded sql');
					populateSQL = "INSERT INTO 'idea' (idea_ID, ideaTitle, ideaDescription)"
					+ "SELECT '1' AS 'location_ID','Test1' AS 'ideaTitle','I am awesome' AS 'ideaDescription'"
					+ "UNION SELECT '2', 'Test 2', 'Birthplace of BB10!'"
					+ "UNION SELECT '3', 'Test 3', 'Looks like rain...'";
					//+ "UNION SELECT '4', 'Test 4', 'C''est bon, mon ami'"
					//+ "UNION SELECT '5', 'Kawah Putih, Indonesia', 'The White Crater'"
					//+ "UNION SELECT '6', 'Bangkok, Thailand', 'Home of the Golden Buddha'"
					//+ "UNION SELECT '7', 'Bermuda', 'Grotto Bay Beach Resort'"
					//+ "UNION SELECT '8', 'Buenos Aires, Argentina', 'Do you like to tango?'"
					//+ "UNION SELECT '9', 'Hyderabad, Andhra Pradesh, India', 'Try the biryani, you will not regret it!'";
				}
			}
		});	
	};
	
	pub.getIdeaDBCreationSQL = function (){
	
	// for this to work in ripple, a MIME type must be configured in IIS (.sql == text/plain)
		var filePath = 'data/createIdea.sql',
			createIdeaSQL = '';

		$.ajax({
			url : filePath,
			async : false,
			dataType : 'text',
			success : function (data) {
				console.log("got createIdea.sql for ideas");
				console.log(data);
				createIdeaSQL = data;
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('error reading ' + filePath);
				console.log('errorThrown: ' + errorThrown);
			},
			complete : function (jqXHR, textStatus) {
				console.log(filePath + ' read complete, textStatus: ' + textStatus);
				//if (createIdeaSQL === '') {
					console.log('relying on hard-coded sql for ideas');
					createIdeaSQL = 'CREATE TABLE idea ( '
						+ 'idea_ID INTEGER PRIMARY KEY NOT NULL, '
						+ 'ideaTitle VARCHAR, ' + ' ideaDescription TEXT, '						
						+ 'addDate DATETIME DEFAULT CURRENT_TIMESTAMP ' + ');';

				//}
			}
		});
		console.log('returning createIdeaSQL: ' + createIdeaSQL);

		return createIdeaSQL;
	
	};
	
	
	
	pub.addIdea = function (ideaDatabase, idea) {

		var insertSQL = "INSERT INTO idea "
			+ "( ideaTitle, ideaDescription, addDate ) "
			+ "VALUES ("
			+ "		'" + idea.ideaTitle + "', "
			+ "		'" + idea.ideaDescription + "', "
			+ "		'" + idea.addDate + "' "
			+ ")";

		ideaDatabase.transaction(function (tx) {
			tx.executeSql(insertSQL, [], function (tx, result) {
				console.log('Inserted idea.');
				pub.getData();
			}, function (tx, error) {
				console.log('Error inserting:\n' + error.message);
			});
		});
	};

	
	return pub;
}();
