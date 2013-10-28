chess.utilities.toPNG = function(pathDetails) {
	var notation = '';

	notation += pathDetails.notation.piece.get('notation');

	if (pathDetails.notation.capture) {
		if (pathDetails.notation.piece.get('piece') === 'pawn') {
			notation += pathDetails.notation.piece.get('position').slice(0, 1);
		}
		notation += 'x';
	}

	notation += pathDetails.notation.piece.get('position');

	if (pathDetails.notation.check) {
		notation += '+'
	}

	if (pathDetails.notation.checkmate) {
		notation += '#'
	}

	console.log(notation)
}