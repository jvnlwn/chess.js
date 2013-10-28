chess.utilities.kingMoves = function(collection) {

	var kingPosition = collection.findWhere({'piece': 'king'}).get('position');
	var squaresToCheck = _.union(_.flatten(chess.setup.blockOrCapture))

	var possibleMoves = [];

	var file = chess.setup.file.indexOf(kingPosition.slice(0, 1))
	var rank = chess.setup.rank.indexOf(kingPosition.slice(1))
	
	file = file === 0 ? 0 : file - 1
	rank = rank === 0 ? 0 : rank - 1

	var fileMax = file === 0 ? file + 2 : file + 3;
	var rankMax = rank === 0 ? rank + 2 : rank + 3;

	fileMax = file === 6 ? 8 : fileMax;
	rankMax = rank === 6 ? 8 : rankMax;

	var f,r;

	for (f = file; f < fileMax; f++) {
		for (r = rank; r < rankMax; r++) {
			possibleMoves.push(chess.setup.file[f] + chess.setup.rank[r])
		}
	}

	return possibleMoves;
}
