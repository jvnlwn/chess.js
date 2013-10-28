chess.utilities.squareSearch = function(squares, player, piece, piecePosition, ifDepsPass) {
	squares.forEach(function(square) {

		var pathDetails = new chess.setup.PathDetails({
			position:    piecePosition,
			newPosition: square
		})

		pathDetails = piece.checkMove(pathDetails);

		var pieceIsThere = blackPieces.findWhere({position: pathDetails.newPosition}) || whitePieces.findWhere({position: pathDetails.newPosition});

		if (pieceIsThere) {
			if (pieceIsThere.get('player') !== player) {
				pieceIsThere.set('position', 'MIA');	
			}
		}

		piece.set('position', pathDetails.newPosition)

		if (pathDetails.dependenciesPass) {

			ifDepsPass(pathDetails)
		}

		if (pieceIsThere) {
			if (pieceIsThere.get('position') === 'MIA') {
				pieceIsThere.set('position', pathDetails.newPosition);
			}
		}

		piece.set('position', piecePosition);

	})
	
}