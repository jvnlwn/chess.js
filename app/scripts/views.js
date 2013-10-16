SquareView = Backbone.View.extend({

	className: 'square',

	events: {
		'mouseup': 'sayPosition',
		'mousedown': 'bringForwrd'
	},

	initialize: function(options) {
		this.options = options;

		$('.container').append(this.$el);
		this.render();
	},

	position: function() {
		var top = {
			'8': '0%',
			'7': '12.5%',
			'6': '25%',
			'5': '37.5%',
			'4': '50%',
			'3': '62.5%',
			'2': '75%',
			'1': '87.5%'
		}

		var left = {
			'a': '0%',
			'b': '12.5%',
			'c': '25%',
			'd': '37.5%',
			'e': '50%',
			'f': '62.5%',
			'g': '75%',
			'h': '87.5%'
		}

		var cssPosition = {
			top: top[this.options.rank],
			left: left[this.options.file]
		}

		this.$el.css(cssPosition);

		var cssSquare = $.extend({
			width: '12.5%',
			height: '12.5%',
			position: 'absolute',
			background: this.options.color
		}, cssPosition) 

		var square = '<div class="board-square"></div>';
		$('.container').last().prepend($(square).css(cssSquare))

		var id = this.options.file + this.options.rank
		this.$el.attr('id', id)
		this.$el.addClass(id)

		return this.options.file + this.options.rank
	},

	render: function() {
		var id = '.' + this.position();
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
			// that.position();	
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

	bringForwrd: function() {
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

// var leftVal = parseInt(($('.a2').css('left')).slice(0, -2))
// var topVal = parseInt(($('.a2').css('top')).slice(0, -2))
// var closestLeftVal = parseInt($('.container').css('width').slice(0, -2))
// var closestTopVal = parseInt($('.container').css('height').slice(0, -2));
// var destinationLeftVal = closestLeftVal
// var destinationTopVal = closestTopVal

// $('.board-square').each(function(){
//     var possibleLeftVal = parseInt(($(this).css('left')).slice(0, -2))
//     var possibleTopVal = parseInt(($(this).css('top')).slice(0, -2))

//     if (Math.abs(leftVal - possibleLeftVal) <= closestLeftVal) {
//     	closestLeftVal = Math.abs(leftVal - possibleLeftVal);
//         destinationLeftVal = possibleLeftVal
//     }

//     if (Math.abs(topVal - possibleTopVal) <= closestTopVal) {
//     	closestTopVal = Math.abs(topVal - possibleTopVal);
//         destinationTopVal = possibleTopVal
//     }
// })



// function onDragMove( instance, event, pointer ) {
//   console.log( 'dragMove on ' + event.type +
//     pointer.pageX + ', ' + pointer.pageY +
//     ' position at ' + instance.position.x + ', ' + instance.position.y );
// }


// var leftVal = parseInt(($('.a2').css('left')).slice(0, -2))
// var topVal = parseInt(($('.a2').css('top')).slice(0, -2))
// var closestLeftVal = parseInt($('.container').css('width').slice(0, -2))
// var closestTopVal = parseInt($('.container').css('height').slice(0, -2));
// var destinationLeftVal = closestLeftVal
// var destinationTopVal = closestTopVal

// $('.board-square').each(function(){
//     var possibleLeftVal = parseInt(($(this).css('left')).slice(0, -2))
//     var possibleTopVal = parseInt(($(this).css('top')).slice(0, -2))
//     console.log('possibleLeft: ', possibleLeftVal)
//     console.log('possibleTop: ', possibleTopVal)
//     console.log('diffLeft : ', Math.abs(leftVal - possibleLeftVal))
//     console.log('diffTop : ', Math.abs(topVal - possibleTopVal))

//     if (Math.abs(leftVal - possibleLeftVal) <= closestLeftVal) {
//     	closestLeftVal = Math.abs(leftVal - possibleLeftVal);
//         destinationLeftVal = possibleLeftVal
//         // console.log('yo i\'m left: ', closestLeftVal + 'because: ', Math.abs(leftVal - possibleLeftVal) <= closestLeftVal)
//         // console.log('yo i\'m left: ',leftVal , possibleLeftVal , closestLeftVal)
//     }

//     if (Math.abs(topVal - possibleTopVal) <= closestTopVal) {
//     	closestTopVal = Math.abs(topVal - possibleTopVal);
//         destinationTopVal = possibleTopVal
//         // console.log('yo i\'m top: ', closestTopVal + 'because: ', Math.abs(topVal - possibleTopVal) <= closestTopVal)
//         // console.log('yo i\'m top: ', topVal , possibleTopVal , closestTopVal)
//     }

//     console.log('closestLeftVal: ', closestLeftVal)
//     console.log('closestTopVal: ', closestTopVal)
//     console.log('destinationLeftVal: ', destinationLeftVal)
//     console.log('destinationTopVal: ', destinationTopVal)

//     console.log(' ')
// })

// destinationLeftVal = destinationLeftVal.toString() + 'px';
// destinationTopVal  = destinationTopVal.toString() + 'px';

// $('.a2').css({
// 	left: destinationLeftVal,
// 	top: destinationTopVal
// })


// $('.board-square').each(function(){
//     console.log(parseInt(($('.a2').css('left')).slice(0, -2)))
// })



