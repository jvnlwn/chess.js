chess.utilities.findAPath = function(piece) {
	var pathFinder = {};

	var pathDirections = [];

	var paths = piece.get('paths');
	var position = piece.get('position')

	var file = position.slice(0, 1)
	var rank = position.slice(1)

	var rankIndex = chess.setup.rank.indexOf(rank)
	var fileIndex = chess.setup.file.indexOf(file)


	pathFinder['file'] = function() {
		for (i = 0; i < 8; i++) {
			pathDirections.push(file + chess.setup.rank[i])
		}
	}

	pathFinder['rank'] = function() {
		for (i = 0; i < 8; i++) {
			pathDirections.push(chess.setup.file[i] + rank)
		}
	}

	pathFinder['diagonal'] = function() {

		pathDirections.push(tillUndefined(fileIndex, rankIndex, (+1), (+1), []))
		pathDirections.push(tillUndefined(fileIndex, rankIndex, (-1), (-1), []))
		pathDirections.push(tillUndefined(fileIndex, rankIndex, (+1), (-1), []))
		pathDirections.push(tillUndefined(fileIndex, rankIndex, (-1), (+1), []))

		function tillUndefined(fileIndex, rankIndex, fileChange, rankChange, array) {
			if (chess.setup.file[fileIndex] && chess.setup.rank[rankIndex]) {
				array.push(chess.setup.file[fileIndex] + chess.setup.rank[rankIndex])
				return tillUndefined(fileIndex + fileChange, rankIndex + rankChange, fileChange, rankChange, array)
			} else {
				return array;
			}
		}
	}

	pathFinder['l-shape'] = function() {

		pathDirections.push(ifUndefined(fileIndex + 1, rankIndex + 2, (-2), (+0), [], 0))
		pathDirections.push(ifUndefined(fileIndex + 1, rankIndex - 2, (-2), (+0), [], 0))
		pathDirections.push(ifUndefined(fileIndex + 2, rankIndex - 1, (+0), (+2), [], 0))
		pathDirections.push(ifUndefined(fileIndex - 2, rankIndex - 1, (+0), (+2), [], 0))

		function ifUndefined(fileIndex, rankIndex, fileChange, rankChange, array, count) {
			count++;
			if (chess.setup.file[fileIndex] && chess.setup.rank[rankIndex]) {
				array.push(chess.setup.file[fileIndex] + chess.setup.rank[rankIndex])
			} 
			if (count < 2) {
				return ifUndefined(fileIndex + fileChange, rankIndex + rankChange, fileChange, rankChange, array)
			} else {
				return array;
			}
			
		}
	}

	if (piece.get('piece') === 'king') {

		pathDirections.push(chess.utilities.kingMoves(piece))

	} else if (piece.get('piece') === 'pawn') {

		if (piece.get('player') === 'white') {
			var op = (+1)
		} else {
			var op = (-1)
		}

		pathDirections.push(undefinedCheck(chess.setup.file[fileIndex], + chess.setup.rank[rankIndex + op], true))
		pathDirections.push(undefinedCheck(chess.setup.file[fileIndex], + chess.setup.rank[rankIndex + (2*op)], !piece.get('moved')))
		pathDirections.push(undefinedCheck(chess.setup.file[fileIndex + 1], + chess.setup.rank[rankIndex + op], true))
		pathDirections.push(undefinedCheck(chess.setup.file[fileIndex - 1], + chess.setup.rank[rankIndex + op], true))

		function undefinedCheck(a, b, range) {
			if (a && b && range) {
				return a + b;

			} else {
				return [];
			}
		}

	} else {

		paths.forEach(function(path) {
			pathFinder[path]();
		})
	}

	pathDirections = _.union(_.flatten(pathDirections))

	var index = pathDirections.indexOf(position)
	if (index > -1) {
		pathDirections.splice(index, 1)
	}

	// chess.setup.squares.forEach(function(square) {
	// 	if (pathDirections.indexOf(square) > -1) {
	// 		$('.' + square).css('background', 'rgba(177, 142, 238, .3)')
	// 	}
	// })

	return pathDirections

}


