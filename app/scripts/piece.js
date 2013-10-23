Piece = Backbone.Model.extend({

	dependencies: function(pathDetails) {
		var dependenciesPass = pathDetails.path;

		if (dependenciesPass && this.extraDependencies) {
			dependenciesPass = this.extraDependencies(pathDetails).dependenciesPass;
		}

		if (dependenciesPass) {
			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

			if ((pieceIsThere) && (pieceIsThere.get('player') === this.get('player'))) {

				// player already occupies target square

				if (!pathDetails.targeting) {
					dependenciesPass = false;
				}
				// console.log('you already here dude')

			}

			if (pathDetails.path !== 'l-shape') {

				pathDetails.innerSquares.forEach(function(square) {
					var pieceIsThere = blackPieces.findWhere({position: square}) || whitePieces.findWhere({position: square});

					if (pieceIsThere) {
						// path is blocked
						dependenciesPass = false;
						// console.log('dude a piece is in your way')
					}
				})
			}
		}
		pathDetails.dependenciesPass = dependenciesPass

		return pathDetails;
	},

	isPathKnown: function(pathDetails) {
		var pathIsKnown = false;
		if (pathDetails) {
			this.get('paths').forEach(function(path) {
				if (path === pathDetails.path) {
					pathIsKnown = true;
				}
			})
		}

		if(!pathIsKnown) {
			pathDetails.path = false
		}

		return pathDetails;
	}
})

Pieces = {};








