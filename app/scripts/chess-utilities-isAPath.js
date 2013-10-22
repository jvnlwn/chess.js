chess.utilities.isAPath = function(that, id, newId) {
	var pathDetails = {
		path:     false,
		distance: 0,
		fileDiff: {},
		rankDiff: {}
	}

	var files = {
		original: id.slice(0, 1),
		target:   newId.slice(0, 1)
	}

	var ranks = {
		original: id.slice(1),
		target:   newId.slice(1)
	}

	var fileDiff = {
		original: that.options.fileArray.indexOf(files.original),
		target:   that.options.fileArray.indexOf(files.target)
	}

	var rankDiff = {
		original: that.options.rankArray.indexOf(ranks.original),
		target:   that.options.rankArray.indexOf(ranks.target)
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
		pathDetails.innerSquares = innerSquares(that.options.rankArray, rankDiff, files).squares
	}

	if (rankDiff.diff === 0) {
		pathDetails.path = 'rank';
		pathDetails.distance = fileDiff.diff;
		pathDetails.innerSquares = innerSquares(that.options.fileArray, fileDiff, ranks).squares
	}

	if (Math.abs(fileDiff.diff - rankDiff.diff) === 0) {
		pathDetails.path = 'diagonal';
		pathDetails.distance = fileDiff.diff;

		var rankSlice = innerSquares(that.options.rankArray, rankDiff, files)
		var fileSlice = innerSquares(that.options.fileArray, fileDiff, ranks)

		var combinedSlices = [];
		var x = rankSlice.squares.length

		if (rankSlice.direction === fileSlice.direction) {
			for (i = 0; i < x; i++) {
				combinedSlices.push(fileSlice.squares[i] + rankSlice.squares[i])
			}
		} else {
			for (i = 0; i < x; i++) {
				combinedSlices.push(fileSlice.squares[i] + rankSlice.squares[Math.abs(i - (x - 1))])
			}		
		}

		pathDetails.innerSquares = combinedSlices;
	}

	// piece wasn't moved from square
	if (pathDetails.distance === 0) {
		pathDetails.path = false;
	}

	// determine if move was forward direction
	if ((that.model.get('player') === 'white' && (rankDiff.original - rankDiff.target) < 0) || (that.model.get('player') === 'black' && (rankDiff.original - rankDiff.target) > 0)) {
		pathDetails.direction = 'forward';
	}

	function innerSquares(array, change, unchanged) {
		var startingSquare;
		var endingSquare;
		var inBetween = {
			squares: [],
			direction: 'greater'
		};

		if (pathDetails.distance > 1) {
			if (change.original < change.target) {
				startingSquare = change.original + 1;
				endingSquare = change.target;
			} else {
				startingSquare = change.target + 1;
				endingSquare = change.original;
				inBetween.direction = 'lesser';
			}		
		}

		for(i = startingSquare; i < endingSquare; i++) {
			if (pathDetails.path === 'rank') {
				inBetween.squares.push(array[i].toString() + unchanged.original)
			}

			if (pathDetails.path === 'file') {
				inBetween.squares.push(unchanged.original + array[i].toString())
			}

			if (pathDetails.path === 'diagonal') {
				inBetween.squares.push(array[i])
			}
		}

		return inBetween
	}
	
	return pathDetails;
}	