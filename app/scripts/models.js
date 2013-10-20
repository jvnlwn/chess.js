Piece = Backbone.Model.extend({
	initialize: function(options) {
		this.options = options
		this.render(this.options.piece)
	},

	render: function(piece) {
		if (piece === 'pawn') {
			
			// to be called everytime this.model's view is moved
			this.instruct = function(options) {
				this.moved = options.moved || false
				this.enPassant = options.enPassant || false;

				if (this.moved) {
					this.range = 1;
				} else {
					this.range = 2;
				}

				this.paths = ['file', 'diagonal']
				this.dependencies = {
					'file': { 
						targetSquare: {
							occupation: 'not occupied', 
							range:      this.range, 
							direction:  'forward'
						}
					},
					'diagonal': { 
						targetSquare: {
							occupation: 'opponent present',
							range: 1
						}
					}
				}			
			}
		}

		if (piece === 'rook') {
			this.instruct = function(options) {
				this.moved = options.moved || false;
				this.paths = ['file', 'rank']
			}
		}

		if (piece === 'knight') {
			this.instruct = function() {
				this.paths = ['l-shape']
			}
		}

		if (piece === 'bishop') {
			this.instruct = function() {
				this.paths = ['diagonal']
			}
		}

		if (piece === 'queen') {
			this.instruct = function() {
				this.paths = ['file', 'rank', 'diagonal']
			}
		}

		if (piece === 'king') {
			this.instruct = function(options) {
				this.moved = options.moved || false;

				if (this.moved) {
					this.range = 1;
				} else {
					this.range = 2;
				}

				this.castle = function(targetSquare) {
					var file = targetSquare.slice(0, 1)
					var rank = targetSquare.slice(1)

					if (file === 'g') {
						var targetRook = 'h' + rank
					} else {
						var targetRook = 'a' + rank
					}

					var rook = this.collection.findWhere({position: targetRook})

					return rook.moved || rook
				}

				this.paths = ['file', 'rank', 'diagonal']
				this.dependencies = {
					'file': {
						targetSquare: {
							range: 1, 
						}
					},
					'rank': {
						targetSquare: {
							range: this.range, 
						}
					},
					'diagonal': {
						targetSquare: {
							range: 1, 
						}
					}
				}
			}
		}

		return this.instruct({});
	}
})

WhitePieces = Backbone.Collection.extend({
	model: Piece
})

BlackPieces = Backbone.Collection.extend({
	model: Piece
})





