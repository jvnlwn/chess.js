WhitePieces = Backbone.Collection.extend({
	model: Piece,

	initialize: function() {
		this.on('remove', function(piece) {
			console.log('what is up white')
			whiteCapturedPieces.add(piece)
		})	
	}
})

BlackPieces = Backbone.Collection.extend({
	model: Piece,

	initialize: function() {
		this.on('remove', function(piece) {
			console.log('what is up black')
			console.log(piece)
			blackCapturedPieces.add(piece)
		})	
	}
})

WhiteCapturedPieces = Backbone.Collection.extend({
	model: Piece,
})

BlackCapturedPieces = Backbone.Collection.extend({
	model: Piece
})