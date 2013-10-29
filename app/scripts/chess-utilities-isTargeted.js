chess.utilities.isTargeted = function(squares, piece, kingPosition, index) {
	var setup = chess.setup;

	squares.forEach(function(square, i) {

		if (piece.get('position') !== square) {

			var pathDetails = new setup.PathDetails({
				position:    piece.get('position'),
				newPosition: square,
				targeting:   true,
				canTarget:   true
			})

			var paths = piece.get('paths');

			pathDetails = $.extend(pathDetails, piece.checkMove(pathDetails))

			if (pathDetails.dependenciesPass && pathDetails.canTarget && setup.attackedSquares.indexOf(square) === -1) {
				setup.attackedSquares.push(square)

				if (square === kingPosition) {
					setup.blockOrCapture.push(pathDetails.position)
					setup.blockOrCapture.push(pathDetails.innerSquares)
				}
			}

		}
	})
}

