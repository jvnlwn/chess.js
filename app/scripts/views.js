SquareView = Backbone.View.extend({

	className: 'square',

	events: {
		'mouseup': 'sayPosition',
		'mousedown': 'bringToFront'
	},

	initialize: function(options) {
		this.options = options;

		$('.container').append(this.$el);
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

	sayPosition: function() {
		this.$el.css('z-index', '1')
		console.log(this.options.file,this.options.rank)
		var that = this;
		var id = '#' + this.$el.attr('id');
		setTimeout(function(){
			that.snapToSquare(id)
		},100)
	},

	snapToSquare: function(id) {
		var leftVal = parseInt(($(id).css('left')).slice(0, -2))
		var topVal = parseInt(($(id).css('top')).slice(0, -2))
		var closestLeftVal = parseInt($('.container').css('width').slice(0, -2))
		var closestTopVal = parseInt($('.container').css('height').slice(0, -2));
		var destinationLeftVal = closestLeftVal
		var destinationTopVal = closestTopVal

		$('.board-square').each(function(){
		    var possibleLeftVal = parseInt(($(this).css('left')).slice(0, -2))
		    var possibleTopVal = parseInt(($(this).css('top')).slice(0, -2))

		    if (Math.abs(leftVal - possibleLeftVal) <= closestLeftVal) {
		    	closestLeftVal = Math.abs(leftVal - possibleLeftVal);
		        destinationLeftVal = possibleLeftVal
		    }

		    if (Math.abs(topVal - possibleTopVal) <= closestTopVal) {
		    	closestTopVal = Math.abs(topVal - possibleTopVal);
		        destinationTopVal = possibleTopVal
		    }
		})

		destinationLeftVal = destinationLeftVal.toString() + 'px';
		destinationTopVal  = destinationTopVal.toString() + 'px';

		$(id).css({
			left: destinationLeftVal,
			top: destinationTopVal
		})
	},

	bringToFront: function() {
		this.$el.css('z-index', '100')
	},

	pieceType: function() {
		console.log(this.model.piece)
		if (this.model !== undefined) {
			if (this.model.piece) {
				this.$el.css({
					background: 'url("http://clipartist.info/openclipart.org/SVG/portablejim/chess_tile_pawn_3-800px.png") no-repeat center center',
    				'background-size': 'cover',
					width: '8%',
					height: '8%',
					margin: '2.2%'
				})
			}
		}
	}
})

// function onDragMove( instance, event, pointer ) {
//   console.log( 'dragMove on ' + event.type +
//     pointer.pageX + ', ' + pointer.pageY +
//     ' position at ' + instance.position.x + ', ' + instance.position.y );
// }




