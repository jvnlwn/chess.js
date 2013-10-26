Pieces['king'] = Piece.extend({
	initialize: function() {

		this.listenTo

		this.render()
	},

	render: function() {
		this.set('notation', 'K');
		this.set('piece', 'king');
		this.set('paths', ['file', 'rank', 'diagonal']);
		this.set('range', 1);
		this.set('moved', false);
	},

	instruct: function(options) {
		this.resetPawns();
		this.set('moved', true);
	},

	extraDependencies: function(pathDetails) {

		pathDetails.dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies

			if (pathDetails.distance > this.get('range')) {

				var response = this.castle(pathDetails);

				if (response.dependenciesPass && pathDetails.player && !this.get('moved')) {
					console.log('you have not moved yet')
					pathDetails.dependenciesPass = true;

					pathDetails.castle = {
						squares:         response.castleSquares,
						rookPiece:       response.rookPiece,
						newRookPosition: response.newRookPosition,
						newCssPosition:  response.newCssPosition
					}

					pathDetails.innerSquares = response.innerSquares;

				} else {
					pathDetails.dependenciesPass = false;
				}
			}
		}

		return pathDetails;
	},

	castle: function(pathDetails) {
		var file = pathDetails.newId.slice(0, 1)
		var rank = pathDetails.newId.slice(1)

		var dependenciesPass = false;

		if (file === 'g') {
			var targetRook = 'h' + rank;
			var newRookPosition = 'f' + rank;
			var castleSquares = ['e' + rank, 'f' + rank, 'g' + rank];
			var innerSquares = ['f' + rank, 'g' + rank];
			var newCssPosition = {
				left: chess.setup.percentages.left['f'],
				top: chess.setup.percentages.top[rank]
			}

		} else {
			var targetRook = 'a' + rank;
			var newRookPosition = 'd' + rank;
			var castleSquares = ['b' + rank, 'c' + rank, 'd' + rank, 'e' + rank];
			var innerSquares = ['b' + rank, 'c' + rank, 'd' + rank];
			var newCssPosition = {
				left: chess.setup.percentages.left['d'],
				top: chess.setup.percentages.top[rank]
			}
		}

		var rook = this.collection.findWhere({position: targetRook})

		if (rook) {
			if (!rook.get('moved') && !this.get('moved')) {
				dependenciesPass = !rook.get('moved');		
			}
		}

		return {
			dependenciesPass: dependenciesPass,
			castleSquares:    castleSquares,
			rookPiece:        rook,
			newRookPosition:  newRookPosition,
			newCssPosition:   newCssPosition,
			innerSquares:     innerSquares
		}
	}
})
