chess.utilities.isKingInCheck = function(side, pathDetails) {
	if (pathDetails.dependenciesPass) {

		chess.setup.attackedSquares = [];
		chess.setup.blockOrCapture = [];

		var playerCollection;
		var opponentCollection;

		if (side === 'white') {
			playerCollection = whitePieces;
			opponentCollection = blackPieces;
		} else {
			playerCollection = blackPieces;
			opponentCollection = whitePieces;
		}

		var king = playerCollection.findWhere({'piece': 'king'});
		var kingPosition = king.get('position');

		chess.setup.squares.forEach(function(square, index){
		    chess.utilities.isTargeted(opponentCollection, square, kingPosition, index)
		})

		if (pathDetails.castle.castleSquares.length > 0) {
			pathDetails.castle.castleSquares.forEach(function(square) {
				if (chess.setup.attackedSquares.indexOf(square) > -1) {
					pathDetails.dependenciesPass = false;
				}
			})
			if (pathDetails.dependenciesPass) {
				pathDetails.castle.rookPiece.set('position', pathDetails.castle.rookPosition)
				pathDetails.castle.rookPiece.set('cssPosition', pathDetails.castle.newCssPosition)
				pathDetails.castle.rookPiece.instruct()
			}
		} else if (chess.setup.attackedSquares.indexOf(kingPosition) > -1) {
			// king is in check
			pathDetails.dependenciesPass = false;
			// console.log(side + ' king in check')
		}
	}

	return pathDetails.dependenciesPass;
}