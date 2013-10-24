Piece = Backbone.Model.extend({

	dependencies: function(pathDetails) {
		var dependenciesPass = pathDetails.path;

		// console.log(this.extraDependencies)

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
	},

	validateMove: function(view) {
		var that = this;

		var pathDetails = {
			path:             false,
			distance:         0,
			fileDiff:         {},
			rankDiff:         {},
			id:               that.get('position'),
			dependenciesPass: true
		}

		setTimeout(function(){

			pathDetails = that.checkMove(that.targetSquare(pathDetails))

			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

			pathDetails.dependenciesPass = that.checkKing(that.get('player'), pathDetails, pieceIsThere)

			that.finalizeMove(pathDetails, pieceIsThere, view)

			// if oppenent in check and if so, can king move
			chess.utilities.canKingMove(pathDetails, that)

			return pathDetails;

		},100)

	},

	targetSquare: function(pathDetails) {

		pathDetails.newPercentages = chess.utilities.findClosest(pathDetails);

		pathDetails.newId = chess.utilities.reassignId(pathDetails);

		return pathDetails;
	},

	checkMove: function(pathDetails) {

		pathDetails = $.extend(pathDetails, chess.utilities.isAPath(pathDetails));

		pathDetails = $.extend(pathDetails, this.isPathKnown(pathDetails));

		pathDetails = $.extend(pathDetails, this.dependencies(pathDetails));

		return pathDetails;
	},

	checkKing: function(side, pathDetails, pieceIsThere) {

		if (pieceIsThere) {
			if (pieceIsThere.get('player') !== this.get('player')) {
				pieceIsThere.set('position', 'MIA');	
			}
		}

		this.set('position', pathDetails.newId)

		return chess.utilities.isKingInCheck(side, pathDetails);

	},

	finalizeMove: function(pathDetails, pieceIsThere, view) {
		if (pathDetails.dependenciesPass) {

			this.instruct({moved: true})

			view.options.cssPosition = pathDetails.newPercentages
			view.$el.css(view.options.cssPosition)
			view.$el.attr('id', pathDetails.newId)
			
			if (pieceIsThere) {
				if (pieceIsThere.get('player') === this.get('opponent')) {
					pieceIsThere.collection.remove(pieceIsThere)
				}				
			}
		} 

		else {
			this.set('position', pathDetails.id)

			view.$el.css(view.options.cssPosition)

			if (pieceIsThere) {
				if (pieceIsThere.get('position') === 'MIA') {
					pieceIsThere.set('position', pathDetails.newId);
				}
			}
		}
	}
})

Pieces = {};








