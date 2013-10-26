chess.utilities.isTargeted = function(collection, targetSquare, kingPosition, index) {
	var setup = chess.setup;
	var i = index;

	var number = setup.rank[Math.floor(i / 8)];
	var klass = '.' + setup.squares[i];

	setup.squares[index].defended = false;
	$(klass).css('background', setup.colorCycles[number % 2 + 1][i % 2])

	setup.squares[i].defended = false;

	collection.each(function(piece) {

		if (piece.get('position') !== targetSquare) {

			var pathDetails = new setup.PathDetails({
				id:        piece.get('position'),
				newId:     targetSquare,
				targeting: true,
				canTarget: true
			})
			
			pathDetails = $.extend(pathDetails, chess.utilities.isAPath(pathDetails));
			pathDetails = $.extend(pathDetails, piece.isPathKnown(pathDetails))
			pathDetails = $.extend(pathDetails, piece.dependencies(pathDetails))

			if (pathDetails.dependenciesPass && pathDetails.canTarget && setup.attackedSquares.indexOf(targetSquare) === -1) {
				setup.attackedSquares.push(targetSquare)

				$('.' + targetSquare).css('background', 'rgba(177, 142, 238, .3)')

				if (targetSquare === kingPosition) {
					chess.setup.blockOrCapture.push(pathDetails.id)
					chess.setup.blockOrCapture.push(pathDetails.innerSquares)
				}
			}

		}
	})
}

