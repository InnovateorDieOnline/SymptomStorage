function LocationVO(location) {
	if (location) {
		this.location_ID = location.location_ID || 0;
		this.name = location.name || '';
		this.description = location.description || '';
		this.latitude = location.latitude || '';
		this.longitude = location.longitude || '';
		this.horizontalAccuracy = location.horizontalAccuracy || '';
		this.addDate = location.addDate || 0;
	}
}
