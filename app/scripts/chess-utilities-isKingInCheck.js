chess.utilities.isKingInCheck = function(side, pathDetails) {
	if (pathDetails.dependenciesPass) {

		var setup = chess.setup;

		setup.attackedSquares = [];
		setup.blockOrCapture = [];

		var playerCollection;
		var opponentCollection;

		if (side === 'white') {
			playerCollection = gameRouter.whitePieces;
			opponentCollection = gameRouter.blackPieces;
		} else {
			playerCollection = gameRouter.blackPieces;
			opponentCollection = gameRouter.whitePieces;
		}

		var king = playerCollection.findWhere({'piece': 'king'});
		var kingPosition = king.get('position');

		opponentCollection.each(function(piece, index){
		    chess.utilities.isTargeted(chess.utilities.findAPath(piece),piece, kingPosition, index)
		})

		// just coloring the squares
		setup.squares.forEach(function(square, i) {
			var number = setup.rank[Math.floor(i / 8)];
			$('.' + square).css('background', setup.colorCycles[number % 2 + 1][i % 2])

			if (setup.attackedSquares.indexOf(square) > -1) {
				$('.' + square).css('background', 'rgba(177, 142, 238, .3)')
			}
		})

		// checking if king is attempting to castle, otherwise just check if king's square is targeted by opponent
		if (pathDetails.castle.squares.length > 0) {
			pathDetails.castle.squares.forEach(function(square) {
				if (setup.attackedSquares.indexOf(square) > -1) {
					pathDetails.dependenciesPass = false;
				}
			})
			if (pathDetails.dependenciesPass) {
				var rook = pathDetails.castle.rookPiece
				rook.set({
					'position':    pathDetails.castle.newRookPosition,
					'cssPosition': pathDetails.castle.newCssPosition
				})
				rook.instruct()
				pathDetails.notation.castle = true;
			}
		} else if (setup.attackedSquares.indexOf(kingPosition) > -1) {
			// king is in check
			pathDetails.dependenciesPass = false;
			// console.log(side + ' king in check')
		}
	}

	return pathDetails.dependenciesPass;
}