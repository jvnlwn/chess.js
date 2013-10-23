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
			this.moved = options.moved || false
			this.enPassant = options.enPassant || false;

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
		console.log('canTarget is ', pathDetails.canTarget)

		var dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies
			var dependencies = this.get('dependencies')[pathDetails.path]

			// check range
			if (pathDetails.distance > dependencies.range) {
				dependenciesPass = false;
				console.log('bad range')
			}

			// check direction
			if (this.checkDirection(pathDetails) !== 'forward') {
				dependenciesPass = false;
				console.log('bad direction')
			}
				
			var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

			// check occupatoin for file path
			if (pieceIsThere && dependencies.occupied === false) {
				console.log('piece present')
				dependenciesPass = false;
			} else {
				pathDetails.canTarget = false;
			}

			// check occupation for diagonal path


			if(dependenciesPass) {
				console.log(this.get('position') + ' is passing and canTarget is ', pathDetails.canTarget)
			}

			if (dependencies.occupied === this.get('opponent')) {
				if (!pathDetails.targeting) {

					if (!pieceIsThere) {
						console.log('no opponent present')
						dependenciesPass = false;
					}
				} else {
					pathDetails.canTarget = true;
				}		
			}
		}

		pathDetails.dependenciesPass = dependenciesPass

		return pathDetails;
	},


	// extraDependencies: function(pathDetails) {
	// 	var dependenciesPass = true;

	// 	if (pathDetails.path) {
	// 		// path is good but check these dependencies
	// 		var dependencies = this.get('dependencies')[pathDetails.path]

	// 		// check range
	// 		if (pathDetails.distance > dependencies.range) {
	// 			dependenciesPass = false;
	// 			console.log('bad range')
	// 		}

	// 		// check direction
	// 		if (this.checkDirection(pathDetails) !== 'forward') {
	// 			dependenciesPass = false;
	// 			console.log('bad direction')
	// 		}
				
	// 		var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId});

	// 		// check occupatoin for file path
	// 		if (pieceIsThere && dependencies.occupied === false) {
	// 			console.log('piece present')
	// 			dependenciesPass = false;
	// 		}

	// 		// check occupation for diagonal path
	// 		if (dependencies.occupied === this.get('opponent')) {

	// 			if (!pieceIsThere) {
	// 				console.log('no opponent present')
	// 				dependenciesPass = false;
	// 			}
	// 		}


	// 		// if (dependencies.occupied === this.get('opponent')) {

	// 		// 	if ((!pieceIsThere) || (pieceIsThere.get('player') !== this.get('opponent'))) {
	// 		// 		console.log('no opponent present')
	// 		// 		dependenciesPass = false;
	// 		// 	}
	// 		// }
	// 	}

	// 	return dependenciesPass;
	// },

	checkDirection: function(pathDetails) {
		var rankDiff = pathDetails.rankDiff
		var direction;

		if ((this.get('player') === 'white' && (rankDiff.original - rankDiff.target) < 0) || (this.get('player') === 'black' && (rankDiff.original - rankDiff.target) > 0)) {
			direction = 'forward';
		}

		return direction;
	}
})