chess.utilities.isDefended = function(collection, targetPiece) {
	$('#' + targetPiece).css('border', 'none')
	var defended = false;
	collection.each(function(piece) {
		// $('#' + piece.get('position')).css('border', 'none')
		// console.log(piece)

		

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

			console.log(pathDetails.dependenciesPass)

			if (pathDetails.dependenciesPass && pathDetails.canTarget) {
				console.log('** ' + piece.get('piece') + ' at ' + piece.get('position') + ' has ' + pathDetails.path)

				// $('#' + piece.get('position')).css('border', '4px solid blue')
				// $('#' + targetPiece).css('border', '4px solid red')
				defended = true;
			}

		}

		if (defended) {
			console.log('defended')
			$('#' + targetPiece).css('border', '4px solid yellow')
		}
	})
}


// find all white defended

// whitePieces.each(function(piece){ 
//     chess.utilities.isDefended(whitePieces, piece.get('position'))
// })
