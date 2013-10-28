chess.utilities.isAPath = function(pathDetails) {
	var setup = chess.setup;

	var files = {
		original: pathDetails.position.slice(0, 1),
		target:   pathDetails.newPosition.slice(0, 1)
	}

	var ranks = {
		original: pathDetails.position.slice(1),
		target:   pathDetails.newPosition.slice(1)
	}

	var fileDiff = {
		original: setup.file.indexOf(files.original),
		target:   setup.file.indexOf(files.target)
	}

	var rankDiff = {
		original: setup.rank.indexOf(ranks.original),
		target:   setup.rank.indexOf(ranks.target)
	}

	fileDiff.diff = Math.abs(fileDiff.original - fileDiff.target)
	rankDiff.diff = Math.abs(rankDiff.original - rankDiff.target)

	pathDetails.fileDiff = fileDiff;
	pathDetails.rankDiff = rankDiff;


	// cascades: a file or rank path with distance of 3 will overide this
	if ((fileDiff.diff + rankDiff.diff) === 3) {
		pathDetails.path = 'l-shape';
		pathDetails.distance = 3;
	}

	if (fileDiff.diff === 0) {
		pathDetails.path = 'file';
		pathDetails.distance = rankDiff.diff;
		pathDetails.innerSquares = chess.utilities.innerSquares(setup.rank, rankDiff, files, pathDetails).squares
	}

	if (rankDiff.diff === 0) {
		pathDetails.path = 'rank';
		pathDetails.distance = fileDiff.diff;
		pathDetails.innerSquares = chess.utilities.innerSquares(setup.file, fileDiff, ranks, pathDetails).squares
	}

	if (Math.abs(fileDiff.diff - rankDiff.diff) === 0) {
		pathDetails.path = 'diagonal';
		pathDetails.distance = fileDiff.diff;

		var rankSlice = chess.utilities.innerSquares(setup.rank, rankDiff, files, pathDetails)
		var fileSlice = chess.utilities.innerSquares(setup.file, fileDiff, ranks, pathDetails)

		var combinedSlices = [];

		if (rankSlice.direction === fileSlice.direction) {
			_.zip(fileSlice.squares, rankSlice.squares).forEach(function(x){ combinedSlices.push(x.join(''))})
		} else {
			_.zip(fileSlice.squares, rankSlice.squares.reverse()).forEach(function(x){ combinedSlices.push(x.join(''))})
		}

		pathDetails.innerSquares = combinedSlices;
	}

	// piece wasn't moved from square
	if (pathDetails.distance === 0) {
		pathDetails.path = false;
	}
	
	return pathDetails;
}	