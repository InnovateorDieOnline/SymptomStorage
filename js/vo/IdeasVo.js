function IdeaVo(idea) {
	if (idea) {
		this.idea_ID = idea.idea_ID || 0;
		this.ideaTitle = idea.ideaTitle || '';
		this.ideaDescription = idea.ideaDescription || '';
		this.addDate = idea.addDate || 0;
	}
}
