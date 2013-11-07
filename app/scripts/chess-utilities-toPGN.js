chess.utilities.toPGN = function(pathDetails) {
	var template = _.template($('#notation').text());
	var move = {}

	var notation = '';

	if (!pathDetails.notation.castle) {

		var piece = pathDetails.notation.piece;

		notation += piece.get('notation');

		// to determine if any other piece of the current player could have made the same move
		if (piece.get('piece') !== 'king' && piece.get('piece') !== 'pawn') {

			var pieces = piece.collection.where({'piece': piece.get('piece')})
			pieces.splice(pieces.indexOf(piece), 1)

			piece.set('position', 'MIA')

			var piecesPassing = _.filter(pieces, function(piece) {

				var testPathDetails = new chess.setup.PathDetails({
					newPosition: pathDetails.newPosition,
					position: piece.get('position')
				})

				if (piece.checkMove(testPathDetails).dependenciesPass) {
					return piece;
				}		
			})

			piece.set('position', pathDetails.newPosition)

			var position = pathDetails.position

			if (piecesPassing.length > 0) {
				// check if files differ
				piecesPassing = _.filter(piecesPassing, function(piece) {
					if (piece.get('position').slice(0, 1) === position.slice(0, 1)) {
						notation += position.slice(1);
						return piece;
					}
				})

				// if (piecesPassing.length > 0) {
				// 	notation += position.slice(1);
				// 	piecesPassing = _.filter(piecesPassing, function(piece) {
				// 		if (piece.get('position').slice(1) === position.slice(1)) {
				// 			return piece;
				// 		}
				// 	})

					if (piecesPassing.length === 0) {
						notation += position.slice(0, 1);
					}
				// }
			}
		}

		if (pathDetails.notation.capture) {
			if (piece.get('piece') === 'pawn') {
				notation += pathDetails.position.slice(0, 1);
			}
			notation += 'x';
		}

		notation += piece.get('position');

		if (pathDetails.notation.promote) {
			notation += '=' + pathDetails.notation.pieceToken;
		}

		if (pathDetails.notation.check) {
			notation += '+'
		}

		if (pathDetails.notation.checkmate) {
			notation += '#'
		}

	} else {
		notation += pathDetails.notation.side;
	}

	console.log(notation)

	chess.setup.pgn.push(notation)

	if (chess.setup.pgn.length % 2 === 0) {
		move.blackMove = notation
		var lastMove = $('.all-moves').children().last().children().last().text(notation);

		chess.setup.pgnText += ' ' + move.blackMove + ' ';
	} else {
		move.number = chess.setup.pgn.length === 1 ? 1 : chess.setup.pgn.length / 2 + .5;
		move.whiteMove = notation
		$('.all-moves').append(template({notation: move}))

		chess.setup.pgnText += move.number + '. ' + move.whiteMove;
	}

	$('.last-move').text(notation)



}


