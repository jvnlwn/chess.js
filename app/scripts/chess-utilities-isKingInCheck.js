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

		var kingPosition = playerCollection.findWhere({'piece': 'king'}).get('position')

		chess.setup.squares.forEach(function(square, index){
		    chess.utilities.isTargeted(opponentCollection, square, kingPosition, index)
		})


		if (chess.setup.attackedSquares.indexOf(kingPosition) > -1) {
			// king is in check
			pathDetails.dependenciesPass = false;
			// console.log(side + ' king in check')
		}
	}

	return pathDetails.dependenciesPass;
}