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

			pathDetails.newPercentages = chess.utilities.findClosest(pathDetails)

			pathDetails.newId = chess.utilities.reassignId(pathDetails)

			pathDetails = $.extend(pathDetails, chess.utilities.isAPath(pathDetails))

			pathDetails = $.extend(pathDetails, that.isPathKnown(pathDetails))

			pathDetails = $.extend(pathDetails, that.dependencies(pathDetails))

			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});
			if (pieceIsThere) {
				pieceIsThere.set('position', 'MIA');
			}

			that.set('position', pathDetails.newId)

			pathDetails.dependenciesPass = chess.utilities.isKingInCheck(that.get('player'), pathDetails)
			console.log(pathDetails.dependenciesPass)
			 // = chess.utilities.isKingInCheck(that.get('opponent'), pathDetails)
			console.log(pathDetails.dependenciesPass)
			

			if (pathDetails.dependenciesPass) {
				// the css and capture will resolve after king is determined safe
				// that.$el.attr('id', pathDetails.newId)
				that.instruct({moved: true})

				view.options.cssPosition = pathDetails.newPercentages
				view.$el.css(view.options.cssPosition)
				
				if (pieceIsThere) {
					if (pieceIsThere.get('player') === that.get('opponent')) {
						pieceIsThere.collection.remove(pieceIsThere)
					}				
				}

				$('#' + pathDetails.id).attr('id', pathDetails.newId)

			} else {
				that.set('position', pathDetails.id)
				$('#' + pathDetails.id).css(view.options.cssPosition)
				if (pieceIsThere) {
					pieceIsThere.set('position', pathDetails.newId);
				}
			}

			return pathDetails;
		},100)

	},

	
})

Pieces = {};








