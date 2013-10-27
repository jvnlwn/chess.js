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

		// checking if king is attempting to castle, otherwise just check if king's square is targeted by opponent
		if (pathDetails.castle.squares.length > 0) {
			pathDetails.castle.squares.forEach(function(square) {
				if (chess.setup.attackedSquares.indexOf(square) > -1) {
					pathDetails.dependenciesPass = false;
				}
			})
			if (pathDetails.dependenciesPass) {
				var rook = pathDetails.castle.rookPiece
				rook.set('position', pathDetails.castle.newRookPosition)
				rook.set('cssPosition', pathDetails.castle.newCssPosition)
				rook.instruct()
			}
		} else if (chess.setup.attackedSquares.indexOf(kingPosition) > -1) {
			// king is in check
			pathDetails.dependenciesPass = false;
			// console.log(side + ' king in check')
		}
	}

	return pathDetails.dependenciesPass;
}