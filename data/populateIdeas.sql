INSERT INTO 'idea' (idea_ID, ideaTitle, ideaDescription)
SELECT '1' AS 'idea_ID',
'Test1' AS 'ideaTitle',
'I am awesome' AS 'ideaDescription'
UNION SELECT '2', 'Test 2', 'Birthplace of BB10!'
UNION SELECT '3', 'Test 3', 'Looks like rain...'
