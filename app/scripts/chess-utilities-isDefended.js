chess.utilities.isDefended = function(collection, targetPiece, index) {
	var setup = chess.setup;
	var i = index;

	var number = setup.rank[Math.floor(i / 8)];
	var klass = '.' + setup.squares[i].position;

	setup.squares[index].defended = false;
	$(klass).css('background', setup.colorCycles[number % 2 + 1][i % 2])

	setup.squares[i].defended = false;

	collection.each(function(piece, index) {

		if (piece.get('position') !== targetPiece) {
			var pathDetails = {
				id: piece.get('position'),
				newId: targetPiece,
				targeting: true,
				canTarget: true
			}
			
			pathDetails = $.extend(pathDetails, chess.utilities.isAPath(pathDetails));
			pathDetails = $.extend(pathDetails, piece.isPathKnown(pathDetails))
			pathDetails = $.extend(pathDetails, piece.dependencies(pathDetails))

			if (pathDetails.dependenciesPass && pathDetails.canTarget) {

				setup.squares[i].defended = true;

				$('.' + targetPiece).css('background', 'rgba(145, 29, 29, .3)')
				$('.' + targetPiece).css('background', 'rgba(177, 142, 238, .3)')
			}

		}
	})
}

