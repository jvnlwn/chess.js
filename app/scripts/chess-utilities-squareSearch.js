chess.utilities.squareSearch = function(squares, player, piece, piecePosition, ifDepsPass) {
	squares.forEach(function(square) {

		var pathDetails = new chess.setup.PathDetails({
			position:    piecePosition,
			newPosition: square
		})

		pathDetails = piece.checkMove(pathDetails);

		var pieceIsThere = gameRouter.blackPieces.findWhere({position: pathDetails.newPosition}) || gameRouter.whitePieces.findWhere({position: pathDetails.newPosition});
		// var pieceIsThere = gameRouter.allPieces.findWhere({position: pathDetails.newPosition})

		if (pieceIsThere) {
			if (pieceIsThere.get('player') !== player) {
				pieceIsThere.set('position', 'MIA');	
			}
		}

		piece.set('position', pathDetails.newPosition)

		if (pathDetails.dependenciesPass) {

			// do stuff here with passed in function
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

