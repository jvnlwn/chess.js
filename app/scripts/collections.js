PiecesSet = Backbone.Collection.extend({
	model: Piece,

	initialize: function(models, options) {
		this.capturedPieces = new CapturedPieces()

		this.on('add', function(model) {
			new PieceView({model: model})
		})

		this.on('remove', function(piece) {
			var add = true;

			// for pawn promotion
			if (piece.get('piece') === 'pawn') {
				var rank = piece.get('position').slice(1)

				if (rank === '1' || rank === '8') {
					add = false
				}
			}

			if (add) {
				this.capturedPieces.add(piece)
			}
		})
	}
})

CapturedPieces = Backbone.Collection.extend({
	model: Piece,

	initialize: function() {
		this.on('add', function(piece) {
			new CapturedPieceView({model: piece})
		})
	}
})
