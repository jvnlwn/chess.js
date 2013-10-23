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

		this.displayPiece();
	},

	validateMove: function() {
		this.$el.css('z-index', '1')
		var that = this;
		var id = this.$el.attr('id');

		setTimeout(function(){

			var pathDetails = {
				path:     false,
				distance: 0,
				fileDiff: {},
				rankDiff: {},
				id:       id
			}

			pathDetails.newPercentages = chess.utilities.findClosest(pathDetails)

			pathDetails.newId = chess.utilities.reassignId(pathDetails)

			pathDetails = $.extend(pathDetails, chess.utilities.isAPath(pathDetails))

			pathDetails = $.extend(pathDetails, that.model.isPathKnown(pathDetails))

			// pathDetails.dependenciesPass = that.model.dependencies(pathDetails)
			pathDetails = $.extend(pathDetails, that.model.dependencies(pathDetails))


			if (pathDetails.dependenciesPass) {

				// console.log('you moved')


				// that.model.set('position', newId)
				that.model.set('position', pathDetails.newId)
				console.log('testing this position: ', that.model.get('position'))
				chess.utilities.isDefended(whitePieces, that.model.get('position'))

				// potential but not probable code:
				// that.options.cssPosition = newPercentages
				// that.$el.css(that.options.cssPosition)

				// var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;
				// if (pieceIsThere) {
				// 	pieceIsThere.collection.remove(pieceIsThere)
				// }	

				if (!that.isKingInCheck(that)) {
					// the css and capture will resolve after king is determined safe
					that.$el.attr('id', pathDetails.newId)
					that.model.instruct({moved: true})
					that.options.cssPosition = pathDetails.newPercentages
					that.$el.css(that.options.cssPosition)

					var pieceIsThere = blackPieces.findWhere({position: pathDetails.newId}) || whitePieces.findWhere({position: pathDetails.newId}) || false;
					if (pieceIsThere.get('player') === that.model.get('opponent')) {
						pieceIsThere.collection.remove(pieceIsThere)
					}			
				}


			} else {
				that.model.set('position', id)
				that.$el.css(that.options.cssPosition)
			}
		},100)
	},

	isKingInCheck: function(that) {
		if (that.model.get('opponent') === 'black') {
			var opponentPieces = blackPieces;
		} else {
			var opponentPieces = whitePieces;
		}

		// var queen = opponentPieces.findWhere({piece: 'queen'})
		// console.log(queen)

		var kingSquare = that.model.collection.findWhere({piece: 'king'})
		var kingFromPiece = that.model.collection.findWhere({position: kingSquare.get('position')})
		console.log('king position: ', kingSquare.get('position'))



		// var pathDetails = that.isAPath(that, id, newId)
		// that.isPathKnown(pathDetails)
		// var dependenciesPass = that.extraDependencies(pathDetails, newId)
		// dependenciesPass = that.generalDependencies(pathDetails, dependenciesPass, newId)

		return false;
	},

	bringToFront: function() {
		this.$el.css('z-index', '100')
	},

	displayPiece: function() {
		this.$el.css({
			background: 'url("../images/' + this.model.get('image') + '.png") no-repeat center center',
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




