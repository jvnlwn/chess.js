chess.utilities.canKingMove = function(pathDetails, that) {
	var collection;

	if (that.get('opponent') === 'white') {
		collection = whitePieces;
	} else {
		collection = blackPieces;
	}

	var king = collection.findWhere({'piece': 'king'});
	var kingPosition = king.get('position');
	var player = king.get('player');
	var kingCanMove = false;

	if(!chess.utilities.isKingInCheck(player, pathDetails)) {
		console.log('king is in check')

		chess.setup.squares.forEach(function(square) {
			var pathDetails = {
				path:             false,
				distance:         0,
				fileDiff:         {},
				rankDiff:         {},
				id:               kingPosition,
				newId:            square,
				dependenciesPass: true
			}

			pathDetails = king.checkMove(pathDetails)

			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

			if (pieceIsThere) {
				if (pieceIsThere.get('player') !== player) {
					pieceIsThere.set('position', 'MIA');	
				}
			}

			king.set('position', pathDetails.newId)

			if (pathDetails.dependenciesPass) {
				// an acceptable move barring king not in check
				if (chess.setup.attackedSquares.indexOf(pathDetails.newId) < 0) {
					// found a safe square
					kingCanMove = true;
				}
			}

			if (pieceIsThere) {
				if (pieceIsThere.get('position') === 'MIA') {
					pieceIsThere.set('position', pathDetails.newId);
				}
			}

			king.set('position', kingPosition);

		})
	} else {
		kingCanMove = true;
	}

	if (kingCanMove) {
		// opponent king can move out of check (if in check--otherwise, king may or may not be able to move. . but that's beside the point)
		console.log(player + ' King can move!!')
	} else {
		// opponent king can not move out of check
		console.log(player + ' King cant move!!')
	}

	console.log(kingCanMove)

	return {
		kingCanMove: kingCanMove,
		collection: collection
	}
}



