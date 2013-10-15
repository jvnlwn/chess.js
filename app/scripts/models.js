Square = Backbone.Model.extend({
	initialize: function() {
		console.log('yo i\'m a square')
	}
})

Squares = Backbone.Collection.extend({
	model: Square,

	initialize: function() {
		console.log('yo i got some squres')
	}
})






