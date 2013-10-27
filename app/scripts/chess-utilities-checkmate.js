chess.utilities.checkmate = function(opponent, pathDetails) {

	var collection = opponent === 'white' ? whitePieces : blackPieces;

	var counterSquares = [];
	var pieceCanSave = false;
	var player = collection.at(0).get('player');
	
	if (!chess.utilities.isKingInCheck(player, pathDetails)) {

		var kingPosition = collection.findWhere({'piece': 'king'}).get('position');
		var squaresToCheck = _.union(_.flatten(chess.setup.blockOrCapture))

		collection.each(function(piece) {

			var piecePosition = piece.get('position')

			squaresToCheck.forEach(function(square) {

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
					
					if (chess.utilities.isKingInCheck(player, pathDetails)) {

						if (chess.setup.attackedSquares.indexOf(kingPosition) < 0) {
							// piece can either block or capture
							counterSquares.push(pathDetails.newPosition)
						}
					}
				}

				if (pieceIsThere) {
					if (pieceIsThere.get('position') === 'MIA') {
						pieceIsThere.set('position', pathDetails.newPosition);
					}
				}

				piece.set('position', piecePosition);

			})
		})

		counterSquares.forEach(function(square) {
			$('.' + square).css('background', 'rgba(30, 80, 140, .8)')
		})
	}

}