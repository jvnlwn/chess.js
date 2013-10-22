Piece = Backbone.Model.extend({})

Pieces = {};

Pieces['pawn'] = Piece.extend({

	initialize: function() {
		this.render()
	},
	// render: function(piece) {
	render: function() {
		console.log('yo ive been rendered')
			
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
					occupied: false, 
					range:      this.range, 
					direction:  'forward'
				},
				'diagonal': { 
					occupied: this.get('opponent'),
					range: 1,
					direction: 'forward'
				}
			}			
		}

		return this.instruct({});
	}
})

Pieces['rook'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function(){
		this.instruct = function(options) {
			this.moved = options.moved || false;
			this.paths = ['file', 'rank']
		}
		return this.instruct({});
	}	
})

Pieces['knight'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
		this.instruct = function() {
			this.paths = ['l-shape']
		}
		return this.instruct({});
	}
})

Pieces['bishop'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
	this.instruct = function() {
			this.paths = ['diagonal']
		}
		return this.instruct({});
	}
})

Pieces['queen'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
	this.instruct = function() {
			this.paths = ['file', 'rank', 'diagonal']
		}
		return this.instruct({});
	}
})

Pieces['king'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
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
					range: 1 
				},
				'rank': {
					range: this.range,
				},
				'diagonal': {
					range: 1
				}
			}
		}
		return this.instruct({});
	}
})

AllPieces = Backbone.Collection.extend({
	model: Piece
})

WhitePieces = Backbone.Collection.extend({
	model: Piece,

	initialize: function() {
		var that = this;

		this.on('add',  function(model) {
			that.listenTo(model, 'change:position', function() {
				console.log('yo some change been done')
			})
		})

	}
})

BlackPieces = Backbone.Collection.extend({
	model: Piece
})





