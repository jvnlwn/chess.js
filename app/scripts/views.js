SquareView = Backbone.View.extend({

	className: 'square',

	events: {
		'mouseup': 'sayPosition'
	},

	initialize: function(options) {
		this.options = options;
		console.log('yo new view of a square!')
		$('.container').append(this.$el);
		this.render();
	},

	position: function() {
		var top = {
			'8': 0,
			'7': 80,
			'6': 160,
			'5': 240,
			'4': 320,
			'3': 400,
			'2': 480,
			'1': 560
		}

		var left = {
			'a': 0,
			'b': 80,
			'c': 160,
			'd': 240,
			'e': 320,
			'f': 400,
			'g': 480,
			'h': 560
		}

		var cssPosition = {
			top: top[this.options.rank],
			left: left[this.options.file],
			background: this.options.color
		}

		this.$el.css(cssPosition);
		console.log(this.options.file,this.options.rank)
	},

	render: function() {
		this.position();
	},

	sayPosition: function() {
		console.log(this.options.file,this.options.rank)
	}
})