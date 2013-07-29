function ImageVO(image) {
	if (image) {
		this.image_ID = image.image_ID;
		this.thumbnail_url = image.thumbnail_url;
		this.large_url = image.large_url;
	}
}
