chess.utilities.findAPath = function(piece) {
	var pathFinder = {};

	var pathDirections = [];

	var paths = piece.get('paths');
	var position = piece.get('position')

	var file = position.slice(0, 1)
	var rank = position.slice(1)

	var rankIndex = chess.setup.rank.indexOf(rank)
	var fileIndex = chess.setup.file.indexOf(file)

	paths.forEach(function(path) {
		pathFinder[path]();
	})

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
			if (chess.setup.file[fileIndex] !== undefined && chess.setup.rank[rankIndex]) {
				array.push(chess.setup.file[fileIndex] + chess.setup.rank[rankIndex])
				return tillUndefined(fileIndex + fileChange, rankIndex + rankChange, fileChange, rankChange, array)
			} else {
				return array;
			}
		}
	}

	pathDirections = _.union(_.flatten(pathDirections))

	chess.setup.squares.forEach(function(square) {
		if (pathDirections.indexOf(square) > -1) {
			$('.' + square).css('background', 'rgba(177, 142, 238, .3)')
		}
	})

	console.log(pathDirections)
}


