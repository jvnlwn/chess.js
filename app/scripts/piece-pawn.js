Pieces['pawn'] = Piece.extend({

	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', '')
		this.set('piece', 'pawn')
		this.set('paths', ['file', 'diagonal'])
			
		// to be called everytime this.model's view is moved
		this.instruct = function(options) {
			this.checkInitialMove();
			this.enPassant();

			this.moved = options.moved || false

			if (this.moved) {
				this.range = 1;
			} else {
				this.range = 2;
			}

			this.set('dependencies', {
				'file': { 
					occupied: false, 
					range:      this.range
				},
				'diagonal': { 
					occupied: this.get('opponent'),
					range: 1
				}
			})			
		}

		return this.instruct({});
	},

	extraDependencies: function(pathDetails) {
		var dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies
			var dependencies = this.get('dependencies')[pathDetails.path]

			// check range
			if (pathDetails.distance > dependencies.range) {
				dependenciesPass = false;
				// console.log('bad range')
			}

			// check direction
			if (this.checkDirection(pathDetails) !== 'forward') {
				dependenciesPass = false;
				// console.log('bad direction')
			}
				
			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

			// check occupatoin for file path
			if (pieceIsThere && dependencies.occupied === false) {
				// console.log('piece present')
				dependenciesPass = false;
			} else {
				pathDetails.canTarget = false;
			}

			// check occupation for diagonal path
			if (dependencies.occupied === this.get('opponent')) {
				if (!pathDetails.targeting) {

					if (!pieceIsThere) {
						// console.log('no opponent present')

						// check for enPassant
						if (this.get('targetSquare') !== pathDetails.newId) {
							dependenciesPass = false;
						}
					}
				} else {
					pathDetails.canTarget = true;
				}		
			}
		}

		pathDetails.dependenciesPass = dependenciesPass

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

	enPassant: function() {
		if (this.get('targetSquare')) {
			if (this.get('position') === this.get('targetSquare')) {
				var collection = this.get('opponent') === 'white' ? whitePieces : blackPieces;
				var capturedPawn = collection.findWhere({'position': this.get('enemyPawn')})
				collection.remove(capturedPawn);
			}
		}
	},

	checkInitialMove: function() {
		var pawnPosition = this.get('position')

		var file = pawnPosition.slice(0, 1);
		var rank = pawnPosition.slice(1);

		if (this.range === 2) {
			var index = chess.setup.file.indexOf(file)
			var firstSide = chess.setup.file[index - 1]
			var secondSide = chess.setup.file[index + 1]
			var targetSquare;

			var collection = this.get('opponent') === 'white' ? whitePieces : blackPieces;

			if (parseInt(rank) === 4) {
				firstSide += rank;
				secondSide += rank;
				targetSquare = file + '3';
			}

			if (parseInt(rank) === 5) {
				firstSide += rank;
				secondSide += rank;
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
					// enPassant:    true,
					targetSquare: targetSquare,
					enemyPawn:    pawnPosition
				})
			}

			if (secondSide) {
				secondSide.set({
					// enPassant:    true,
					targetSquare: targetSquare,
					enemyPawn:    pawnPosition
				})
			}
		}
	}
})




