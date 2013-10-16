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
			that.reassignId(that)
		},100)
	},

	snapToSquare: function(id) {
		var leftVal = parseInt(($(id).css('left')).slice(0, -2))
		var topVal = parseInt(($(id).css('top')).slice(0, -2))
		var closestLeftVal = parseInt($('.chess-board').css('width').slice(0, -2))
		var closestTopVal = parseInt($('.chess-board').css('height').slice(0, -2));
		var destinationLeftVal = closestLeftVal
		var destinationTopVal = closestTopVal

		$('.board-square').each(function(){
		    var possibleLeftVal = parseInt(($(this).css('left')).slice(0, -2))
		    var possibleTopVal = parseInt(($(this).css('top')).slice(0, -2))

		    var diffLeft = Math.abs(leftVal - possibleLeftVal)
		    var diffTop = Math.abs(topVal - possibleTopVal)

		    if (diffLeft <= closestLeftVal) {
		    	closestLeftVal = diffLeft;
		        destinationLeftVal = possibleLeftVal
		    }

		    if (diffTop <= closestTopVal) {
		    	closestTopVal = diffTop;
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
			if (this.model.piece) {
				this.$el.css({
					background: 'url("../images/wp.png") no-repeat center center',
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




