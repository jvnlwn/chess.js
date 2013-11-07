CapturedPieceView = Backbone.View.extend({

	className: 'captured',

	initialize: function() {

		$('.' + this.model.get('player')).append(this.$el);

		this.render();
	},

	render: function() {
		this.$el.css({
			background: 'url("../images/' + this.model.get('image') + '.png") no-repeat center center',
			'background-size': 'cover',
			width: '20%',
			height: '45%',
			margin: '1% -3% 0'
		})
	}

})