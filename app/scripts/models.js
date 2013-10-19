Piece = Backbone.Model.extend({
	initialize: function(options) {
		this.options = options
		this.render(this.options.token)
	},

	render: function(token) {
		if (token === 'P') {
			
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
						targetSquare: ['not occupied', this.range],
						inBetweenSquares: ['not occupied']
					},
					'diagonal': { 
						targetSquare: ['opponent present', 1] 
					}
				}			
			}
		return this.instruct({});
		}
	}
})

WhitePieces = Backbone.Collection.extend({
	model: Piece
})

BlackPieces = Backbone.Collection.extend({
	model: Piece
})





