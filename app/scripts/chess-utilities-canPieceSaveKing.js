chess.utilities.canPieceSaveKing = function(canKingMove) {

	var collection = canKingMove.collection;
	var kingCanMove = canKingMove.kingCanMove;

	var counterSquares = [];

	var pieceCanSave = false;

	console.log('king can move? -> ', kingCanMove)
	
	if (!kingCanMove) {

		var kingPosition = collection.findWhere({'piece': 'king'}).get('position');
		var player = collection.at(0).get('player');

		collection.each(function(piece) {

			var piecePosition = piece.get('position')

			chess.setup.squares.forEach(function(square) {

				var pathDetails = {
					path:             false,
					distance:         0,
					fileDiff:         {},
					rankDiff:         {},
					id:               piecePosition,
					newId:            square,
					dependenciesPass: true
				}

				pathDetails = piece.checkMove(pathDetails);

				var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

				if (pieceIsThere) {
					if (pieceIsThere.get('player') !== player) {
						pieceIsThere.set('position', 'MIA');	
					}
				}

				piece.set('position', pathDetails.newId)

				if (pathDetails.dependenciesPass) {
					
					if (chess.utilities.isKingInCheck(player, pathDetails)) {

						if (chess.setup.attackedSquares.indexOf(kingPosition) < 0) {
							// piece can either block or capture
							pieceCanSave = true;
							console.log(pathDetails.newId)
							counterSquares.push(pathDetails.newId)

							// $('.' + pathDetails.newId).css('background', 'rgba(30, 80, 140, .8)')
						}

					}

				}

				if (pieceIsThere) {
					if (pieceIsThere.get('position') === 'MIA') {
						pieceIsThere.set('position', pathDetails.newId);
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
