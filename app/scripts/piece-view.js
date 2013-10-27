PieceView = Backbone.View.extend({

	className: 'square',

	events: {
		'mouseup': 'validateMove',
		'mousedown': 'bringToFront'
	},

	initialize: function(options) {
		this.options = options;

		$('.chess-board').append(this.$el);
		var that = this;
		this.model.on('remove', function() {
			that.remove()
		})

		this.listenTo(this.model, 'change:cssPosition', function() {
			this.$el.css(this.model.get('cssPosition'));
			// this.options.cssPosition = this.model.get('cssPosition');
			this.$el.attr('id', this.model.get('position'))
		})

		this.listenTo(this.model, 'change:image', function() {
			this.displayPiece();
		})

		this.render();
	},

	position: function() {
		this.$el.css(this.model.get('cssPosition'));
	},

	setId: function() {
		this.$el.attr('id', this.model.get('position'))
		return this.model.get('position');
	},

	render: function() {
		this.position();
		var id = '#' + this.setId();

		var elem = document.querySelector(id);
		new Draggabilly(elem);

		this.displayPiece();
	},

	validateMove: function() {
		this.$el.css('z-index', '1')
		var that = this;

		var pathDetails = this.model.validateMove(this)
	},

	bringToFront: function() {
		this.$el.css('z-index', '100')
	},

	displayPiece: function() {
		this.$el.css({
			background: 'url("../images/' + this.model.get('image') + '.png") no-repeat center center',
			// background: 'url("../app/images/' + this.model.get('image') + '.png") no-repeat center center',
			'background-size': 'cover',
			width: '8%',
			height: '8%',
			margin: '2.2%'
		})
	}
})

// function onDragMove( instance, event, pointer ) {
//   console.log( 'dragMove on ' + event.type +
//     pointer.pageX + ', ' + pointer.pageY +
//     ' position at ' + instance.position.x + ', ' + instance.position.y );
// }














