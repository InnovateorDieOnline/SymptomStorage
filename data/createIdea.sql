CREATE TABLE idea (
	idea_ID INTEGER PRIMARY KEY NOT NULL,
	 ideaTitle VARCHAR,
	ideaDescription TEXT,	
	addDate DATETIME DEFAULT (datetime('now','localtime'))
);
