chess.utilities.isKingInCheck = function(side, pathDetails) {
	if (pathDetails.dependenciesPass) {

		chess.setup.attackedSquares = [];
		var playerCollection;
		var opponentCollection;

		if (side === 'white') {
			playerCollection = whitePieces;
			opponentCollection = blackPieces;
		} else {
			playerCollection = blackPieces;
			opponentCollection = whitePieces;
		}

		chess.setup.squares.forEach(function(square, index){
		    chess.utilities.isDefended(opponentCollection, square, index)
		})

		var king = playerCollection.findWhere({'piece': 'king'})

		if (chess.setup.attackedSquares.indexOf(king.get('position')) > -1) {
			pathDetails.dependenciesPass = false;
			console.log('isKingInCheck')
		}
	}

	return pathDetails.dependenciesPass;
}