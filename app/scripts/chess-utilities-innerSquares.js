chess.utilities.innerSquares = function (array, change, unchanged, pathDetails) {
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