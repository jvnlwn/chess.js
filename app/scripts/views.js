SquareView = Backbone.View.extend({

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
		var id = '#' + this.$el.attr('id');

		setTimeout(function(){
			that.snapToSquare(id)
			setTimeout(function(){
				that.reassignId(that)
			},200)
		},100)
	},

	snapToSquare: function(id) {
		var actual = {
			left: parseInt(($(id).css('left')).slice(0, -2)),
			top: parseInt(($(id).css('top')).slice(0, -2))
		}

		var closest = {
			left: parseInt($('.chess-board').css('width').slice(0, -2)),
			top: parseInt($('.chess-board').css('height').slice(0, -2))
		}

		var newCSSPosition = {};

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

		    	newCSSPosition = {
		    		left: possible.left,
		    		top: possible.top
		    	}
		    }
		})

		newCSSPosition = {
			left: newCSSPosition.left.toString() + 'px',
			top: newCSSPosition.top.toString() + 'px'
		}

		$(id).css(newCSSPosition);
	},

	reassignId: function(that) {
		var id = '#' + that.$el.attr('id');
		var newId = '';

		var leftPercentage = parseInt($(id).css('left').slice(0, -1))
		var topPercentage = parseInt($(id).css('top').slice(0, -1))

		var newLeftPercentage = ((leftPercentage / $('.chess-board').width()) * 100).toString() + '%';
		var newTopPercentage = ((topPercentage / $('.chess-board').width()) * 100).toString() + '%';

		that.options.fileArray.forEach(function(file) {
			if (that.options.left[file] === newLeftPercentage) {
				newId += file;
			}
		}) 

		that.options.rankArray.forEach(function(rank) {
			if (that.options.top[rank] === newTopPercentage) {
				newId += rank;
			}
		}) 

		that.$el.attr('id', newId)
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




