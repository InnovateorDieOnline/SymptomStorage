INSERT INTO 'location' (location_ID, name, description, latitude, longitude, horizontalAccuracy)
      SELECT '1' AS 'location_ID',
              'Mississauga, ON, CA' AS 'name',
              'Where the fun begins!' AS 'description',
              '43.5972036' AS 'latitude',
              '-79.636378' AS 'longitude',
              '0' AS horizontalAccuracy
UNION SELECT '2', 'Waterloo, ON, CA', 'Birthplace of BB10!', '43.480951', '-80.536115', '30'
UNION SELECT '3', 'London, UK', 'Looks like rain...', '51.500148', '-0.126313', '10'
UNION SELECT '4', 'Paris, France', 'C''est bon, mon ami', '48.858399', '2.294198', '10'
UNION SELECT '5', 'Kawah Putih, Indonesia', 'The White Crater', '-7.1658333', '107.4008333', '30'
UNION SELECT '6', 'Bangkok, Thailand', 'Home of the Golden Buddha', '13.738072', '100.513921', '30'
UNION SELECT '7', 'Bermuda', 'Grotto Bay Beach Resort', '32.352939', '-64.712541', '1'
UNION SELECT '8', 'Buenos Aires, Argentina', 'Do you like to tango?', '-34.603391', '-58.381650', '20'
UNION SELECT '9', 'Hyderabad, Andhra Pradesh, India', 'Try the biryani, you will not regret it!', '17.387378', '78.480614', '20'
