Pieces['pawn'] = Piece.extend({

	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', '')
		this.set('piece', 'pawn')
		this.set('paths', ['file', 'diagonal'])

		this.set('dependencies', {
			'file': { 
				'occupied': false, 
				'range':    2
			},
			'diagonal': { 
				'occupied': this.get('opponent'),
				'range':    1
			}
		})
	},

	instruct: function(pathDetails) {
		this.checkInitialMove();
		pathDetails = $.extend(pathDetails, this.enPassant(pathDetails));
		this.resetPawns();

		this.set('dependencies', {
			'file': { 
				'occupied': false, 
				'range':    1
			},
			'diagonal': { 
				'occupied': this.get('opponent'),
				'range':    1
			}
		})
		return pathDetails;
	},

	extraDependencies: function(pathDetails) {

		pathDetails.dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies
			var dependencies = this.get('dependencies')[pathDetails.path]

			// check range
			if (pathDetails.distance > dependencies.range) {
				pathDetails.dependenciesPass = false;
			}

			// check direction
			if (this.checkDirection(pathDetails) !== 'forward') {
				pathDetails.dependenciesPass = false;
			}
				
			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newPosition}) || whitePieces.findWhere({position: pathDetails.newPosition});

			// check occupatoin for file path
			if (pieceIsThere && dependencies.occupied === false) {
				// piece is there
				pathDetails.dependenciesPass = false;
			} else {
				pathDetails.canTarget = false;
			}

			// check occupation for diagonal path
			if (dependencies.occupied === this.get('opponent')) {
				if (!pathDetails.targeting) {

					if (!pieceIsThere) {
						// no piece present

						// check for en passant
						if (this.get('targetSquare') !== pathDetails.newPosition) {
							pathDetails.dependenciesPass = false;
						}
					}
				} else {
					pathDetails.canTarget = true;
				}		
			}

			if (pathDetails.dependenciesPass) {
				pathDetails = $.extend(this.promotion(pathDetails));
			}
		}

		return pathDetails;
	},

	checkDirection: function(pathDetails) {
		var rankDiff = pathDetails.rankDiff
		var direction;

		if ((this.get('player') === 'white' && (rankDiff.original - rankDiff.target) < 0) || (this.get('player') === 'black' && (rankDiff.original - rankDiff.target) > 0)) {
			direction = 'forward';
		}

		return direction;
	},

	enPassant: function(pathDetails) {
		if (this.get('targetSquare')) {
			if (this.get('position') === this.get('targetSquare')) {
				var collection = this.get('opponent') === 'white' ? whitePieces : blackPieces;
				var capturedPawn = collection.findWhere({'position': this.get('enemyPawn')})
				capturedPawn.destroy();
				pathDetails.notation.capture = true;
			}
		}
		return pathDetails;
	},

	checkInitialMove: function() {
		var pawnPosition = this.get('position')

		var file = pawnPosition.slice(0, 1);
		var rank = pawnPosition.slice(1);

		if (this.get('dependencies')['file'].range === 2) {
			var index = chess.setup.file.indexOf(file)
			var firstSide = chess.setup.file[index - 1] + rank
			var secondSide = chess.setup.file[index + 1] + rank
			var targetSquare;

			var collection = this.get('opponent') === 'white' ? whitePieces : blackPieces;

			if (parseInt(rank) === 4) {
				targetSquare = file + '3';
			}

			if (parseInt(rank) === 5) {
				targetSquare = file + '6';
			}

			firstSide = collection.findWhere({
				'piece':    'pawn',
				'position': firstSide
			})

			secondSide = collection.findWhere({
				'piece':    'pawn',
				'position': secondSide
			})

			if (firstSide) {
				firstSide.set({
					targetSquare: targetSquare,
					enemyPawn:    pawnPosition
				})
			}

			if (secondSide) {
				secondSide.set({
					targetSquare: targetSquare,
					enemyPawn:    pawnPosition
				})
			}
		}
	},

	promotion: function(pathDetails) {
		var rank = pathDetails.newPosition.slice(1);

		if (rank === '1' || rank === '8') {
			pathDetails.promotion = {
				promote: true,
				pawn:    this
			}
		}

		return pathDetails;
	}
})




