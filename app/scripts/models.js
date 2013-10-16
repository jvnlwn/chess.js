Square = Backbone.Model.extend({
	initialize: function(options) {
		this.options = options
		this.piece = options.piece
	},

})

Squares = Backbone.Collection.extend({
	model: Square,

	initialize: function() {
		console.log('yo i got some squres')
	}
})





