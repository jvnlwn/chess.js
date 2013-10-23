chess.utilities.reassignId = function(pathDetails) {
	var setup = chess.setup;

	var newId = '';

	setup.file.forEach(function(file) {
		if (setup.percentages.left[file] === pathDetails.newPercentages.left) {
			newId += file;
		}
	}) 

	setup.rank.forEach(function(rank) {
		if (setup.percentages.top[rank] === pathDetails.newPercentages.top) {
			newId += rank;
		}
	})

	return newId;
}