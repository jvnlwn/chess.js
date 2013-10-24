// AllPieces = Backbone.Collection.extend({
// 	model: Piece
// })

WhitePieces = Backbone.Collection.extend({
	model: Piece,

	initialize: function() {
		var that = this;

		// this.on('add',  function(model) {
		// 	that.listenTo(model, 'change:position', function() {
		// 		console.log('yo some change been done')
		// 	})
		// })

	}
})

BlackPieces = Backbone.Collection.extend({
	model: Piece
})