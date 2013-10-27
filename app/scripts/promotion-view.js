PromotionView = Backbone.View.extend({

	className: 'promote',

	initialize: function(options) {
		this.pathDetails = options
		console.log('you a promotion')
		$('body').append(this.$el);

		this.render();
	},

	events: {
		'click': 'promote'
	},

	// render: function() {

	// }

	promote: function() {

		var oldAttributes = this.getAttributes();

		var collection = this.model.collection

		this.model.destroy()

		var newModel = new Pieces['queen'](oldAttributes)
		collection.add(newModel)



		new PieceView({})

		this.model.set(oldAttributes)

		console.log('check for mate')
	},

	getAttributes: function() {
		return {
			image:       this.model.get('image').slice(0, 1) + 'q',
			position:    this.model.get('position'),
			player:      this.model.get('player'),
			opponent:    this.model.get('opponent'),
			cssPosition: this.model.get('cssPosition')
		}
	}
})