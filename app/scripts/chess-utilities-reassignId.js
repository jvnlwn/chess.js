chess.utilities.reassignId = function(newPercentages) {
	var setup = chess.setup;

	var newId = '';

	setup.file.forEach(function(file) {
		if (setup.percentages.left[file] === newPercentages.left) {
			newId += file;
		}
	}) 

	setup.rank.forEach(function(rank) {
		if (setup.percentages.top[rank] === newPercentages.top) {
			newId += rank;
		}
	})

	return newId;
}