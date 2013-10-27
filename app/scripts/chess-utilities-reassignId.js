chess.utilities.reassignId = function(pathDetails) {
	var setup = chess.setup;

	var newPosition = '';

	setup.file.forEach(function(file) {
		if (setup.percentages.left[file] === pathDetails.newPercentages.left) {
			newPosition += file;
		}
	}) 

	setup.rank.forEach(function(rank) {
		if (setup.percentages.top[rank] === pathDetails.newPercentages.top) {
			newPosition += rank;
		}
	})

	return newPosition;
}