CREATE TABLE location (
	location_ID INTEGER PRIMARY KEY NOT NULL,
	name VARCHAR,
	description TEXT,
	latitude NUMERIC NOT NULL,
	longitude NUMERIC NOT NULL,
	horizontalAccuracy NUMERIC NOT NULL DEFAULT (0),
	addDate DATETIME DEFAULT (datetime('now','localtime'))
);
