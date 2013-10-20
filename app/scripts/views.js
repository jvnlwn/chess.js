PieceView = Backbone.View.extend({

	className: 'square',

	events: {
		'mouseup': 'validateMove',
		'mousedown': 'bringToFront'
	},

	initialize: function(options) {
		this.options = options;

		$('.chess-board').append(this.$el);
		this.render();
	},

	position: function() {
		this.$el.css(this.options.cssPosition);
	},

	setId: function() {
		this.$el.attr('id', this.options.id)
		return this.options.id;
	},

	render: function() {
		this.position();
		var id = '#' + this.setId();
		var elem = document.querySelector(id);
		new Draggabilly(elem);

		this.pieceType();
	},

	validateMove: function() {
		this.$el.css('z-index', '1')
		var that = this;
		var id = this.$el.attr('id');

		setTimeout(function(){
			// that.reassignId(that, that.findClosest(id))
			var newPercentages = that.findClosest(id)
			var newId = that.reassignId(that, newPercentages)
		},100)

		// if (this.model.options.token === 'K' ) {
		// 	console.log(this.model.castle('g8'))
		// }
	},

	isAPath: function(id, newId) {
		// if ()
	},

	findClosest: function(id) {
		var id = '#' + id;	

		var actual = {
			left: parseInt(($(id).css('left')).slice(0, -2)),
			top: parseInt(($(id).css('top')).slice(0, -2))
		}

		var boardDimensions = {
			width:  parseInt($('.chess-board').css('width').slice(0, -2)),
			height: parseInt($('.chess-board').css('height').slice(0, -2))
		}

		var closest = {
			left: boardDimensions.width,
			top: boardDimensions.height
		}

		var newPercentages = {};

		$('.board-square').each(function(){
		    var possible = {
		    	left: parseInt(($(this).css('left')).slice(0, -2)),
		    	top: parseInt(($(this).css('top')).slice(0, -2))
		    }

		    var diff = {
		    	left: Math.abs(actual.left - possible.left),
		    	top: Math.abs(actual.top - possible.top)
		    }

		    if (diff.left <= closest.left && diff.top <= closest.top) {
		    	closest = {
		    		left: diff.left,
		    		top: diff.top
		    	}

		    	newPercentages = {
		    		left: possible.left,
		    		top: possible.top
		    	}
		    }
		})

		newPercentages = {
			left: ((newPercentages.left / boardDimensions.width) * 100).toString() + '%',
			top: ((newPercentages.top / boardDimensions.height) * 100).toString() + '%'
		}

		return newPercentages;
	},

	reassignId: function(that, newPercentages) {
		var id = '#' + that.$el.attr('id');
		var newId = '';

		that.options.fileArray.forEach(function(file) {
			if (that.options.left[file] === newPercentages.left) {
				newId += file;
			}
		}) 

		that.options.rankArray.forEach(function(rank) {
			if (that.options.top[rank] === newPercentages.top) {
				newId += rank;
			}
		})

		// return [newId, newPercentages]
		return newId;
	},

	bringToFront: function() {
		this.$el.css('z-index', '100')
	},

	pieceType: function() {
		if (this.model !== undefined) {
			this.$el.css({
				background: 'url("../images/' + this.model.options.image + '.png") no-repeat center center',
				// background: 'url("../app/images/' + this.model.options.image + '.png") no-repeat center center',
				'background-size': 'cover',
				width: '8%',
				height: '8%',
				margin: '2.2%'
			})
		}
	}
})

// function onDragMove( instance, event, pointer ) {
//   console.log( 'dragMove on ' + event.type +
//     pointer.pageX + ', ' + pointer.pageY +
//     ' position at ' + instance.position.x + ', ' + instance.position.y );
// }




