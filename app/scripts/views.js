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
			// that.reassignId(that, that.findClosest(id))
			var newPercentages = that.findClosest(id)
			var newId = that.reassignId(that, newPercentages)
			var pathDetails = that.isAPath(that, id, newId)
			that.isPathKnown(pathDetails)
			var dependenciesPass = that.extraDependencies(pathDetails, newId)
			dependenciesPass = that.generalDependencies(pathDetails, dependenciesPass, newId)


			if (dependenciesPass) {

				// console.log('you moved')


				that.model.set('position', newId)

				// potential but not probable code:
				// that.options.cssPosition = newPercentages
				// that.$el.css(that.options.cssPosition)

				// var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;
				// if (pieceIsThere) {
				// 	pieceIsThere.collection.remove(pieceIsThere)
				// }	

				if (!that.isKingInCheck(that)) {
					// the css and capture will resolve after king is determined safe
					that.$el.attr('id', newId)
					that.model.instruct({moved: true})
					that.options.cssPosition = newPercentages
					that.$el.css(that.options.cssPosition)

					var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;
					if (pieceIsThere.get('player') === that.model.get('opponent')) {
						pieceIsThere.collection.remove(pieceIsThere)
					}			
				}


			} else {
				that.model.set('position', id)
				that.$el.css(that.options.cssPosition)
			}
		},100)

		// if (this.model.options.token === 'K' ) {
		// 	console.log(this.model.castle('g8'))
		// }
	},

	isAPath: function(that, id, newId) {
		var pathDetails = {
			path:     false,
			distance: 0,
			fileDiff: {},
			rankDiff: {}
		}

		var files = {
			original: id.slice(0, 1),
			target:   newId.slice(0, 1)
		}

		var ranks = {
			original: id.slice(1),
			target:   newId.slice(1)
		}

		var fileDiff = {
			original: that.options.fileArray.indexOf(files.original),
			target:   that.options.fileArray.indexOf(files.target)
		}

		var rankDiff = {
			original: that.options.rankArray.indexOf(ranks.original),
			target:   that.options.rankArray.indexOf(ranks.target)
		}

		fileDiff.diff = Math.abs(fileDiff.original - fileDiff.target)
		rankDiff.diff = Math.abs(rankDiff.original - rankDiff.target)

		pathDetails.fileDiff = fileDiff;
		pathDetails.rankDiff = rankDiff;


		// cascades: a file or rank path with distance of 3 will overide this
		if ((fileDiff.diff + rankDiff.diff) === 3) {
			pathDetails.path = 'l-shape';
			pathDetails.distance = 3;
		}

		if (fileDiff.diff === 0) {
			pathDetails.path = 'file';
			pathDetails.distance = rankDiff.diff;
			pathDetails.innerSquares = innerSquares(that.options.rankArray, rankDiff, files).squares
		}

		if (rankDiff.diff === 0) {
			pathDetails.path = 'rank';
			pathDetails.distance = fileDiff.diff;
			pathDetails.innerSquares = innerSquares(that.options.fileArray, fileDiff, ranks).squares
		}

		if (Math.abs(fileDiff.diff - rankDiff.diff) === 0) {
			pathDetails.path = 'diagonal';
			pathDetails.distance = fileDiff.diff;

			var rankSlice = innerSquares(that.options.rankArray, rankDiff, files)
			var fileSlice = innerSquares(that.options.fileArray, fileDiff, ranks)

			var combinedSlices = [];
			var x = rankSlice.squares.length

			if (rankSlice.direction === fileSlice.direction) {
				for (i = 0; i < x; i++) {
					combinedSlices.push(fileSlice.squares[i] + rankSlice.squares[i])
				}
			} else {
				for (i = 0; i < x; i++) {
					combinedSlices.push(fileSlice.squares[i] + rankSlice.squares[Math.abs(i - (x - 1))])
				}		
			}

			pathDetails.innerSquares = combinedSlices;
		}

		// piece wasn't moved from square
		if (pathDetails.distance === 0) {
			pathDetails.path = false;
		}

		// determine if move was forward direction
		if ((that.model.get('player') === 'white' && (rankDiff.original - rankDiff.target) < 0) || (that.model.get('player') === 'black' && (rankDiff.original - rankDiff.target) > 0)) {
			pathDetails.direction = 'forward';
		}

		function innerSquares(array, change, unchanged) {
			var startingSquare;
			var endingSquare;
			var inBetween = {
				squares: [],
				direction: 'greater'
			};

			if (pathDetails.distance > 1) {
				if (change.original < change.target) {
					startingSquare = change.original + 1;
					endingSquare = change.target;
				} else {
					startingSquare = change.target + 1;
					endingSquare = change.original;
					inBetween.direction = 'lesser';
				}		
			}

			for(i = startingSquare; i < endingSquare; i++) {
				if (pathDetails.path === 'rank') {
					inBetween.squares.push(array[i].toString() + unchanged.original)
				}

				if (pathDetails.path === 'file') {
					inBetween.squares.push(unchanged.original + array[i].toString())
				}

				if (pathDetails.path === 'diagonal') {
					inBetween.squares.push(array[i])
				}
			}

			return inBetween
		}
		
		return pathDetails;
	},

	isPathKnown: function(pathDetails) {
		var pathIsKnown = false;
		if (pathDetails) {
			this.model.paths.forEach(function(path) {
				if (path === pathDetails.path) {
					pathIsKnown = true;
				}
			})
		}

		if(!pathIsKnown) {
			pathDetails.path = false
		}
	},

	extraDependencies: function(pathDetails, newId) {
		var dependenciesPass;

		if (pathDetails.path) {
			dependenciesPass = true;	
		} else {
			dependenciesPass = false;
		}
		if (pathDetails.path && this.model.dependencies) {
			// path is good but check these dependencies
			var dependencies = this.model.dependencies[pathDetails.path]

			if (dependencies.range < pathDetails.distance) {
				dependenciesPass = false;
				console.log('bad range')
			}

			if ((dependencies.direction !== undefined) && (dependencies.direction !== pathDetails.direction)) {
					dependenciesPass = false;
					console.log('bad direction')
			}
				

			if (dependencies.occupied !== undefined	) {
				if (dependencies.occupied === false) {
					// for time-being referring to global collections
					var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;

					if (pieceIsThere) {
						console.log('piece present')
						dependenciesPass = false;
					}
				}

				if (dependencies.occupied === this.model.get('opponent')) {
					var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;

					if ((!pieceIsThere) || (pieceIsThere.get('player') !== this.model.get('opponent'))) {
						console.log('no opponent present')
						dependenciesPass = false;
					}
				}
			}

		}

		return dependenciesPass;
	},

	generalDependencies: function(pathDetails, dependenciesPass, newId) {
		if (dependenciesPass) {
			var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;

			if ((pieceIsThere) && (pieceIsThere.get('player') !== this.model.get('opponent'))) {
				// player already occupies target square
				dependenciesPass = false;
				console.log('you already here dude')
			} else if (pathDetails.path !== 'l-shape') {
				pathDetails.innerSquares.forEach(function(square) {
					var pieceIsThere = blackPieces.findWhere({position: square}) || whitePieces.findWhere({position: square}) || false;

					if (pieceIsThere) {
						// path is blocked
						dependenciesPass = false;
						console.log('dude a piece is in your way')
					}
				})
			}
		}
		return dependenciesPass;
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
		console.log('king gotten by piece: ', kingSquare)
		console.log('king gotten by position from piece: ', kingFromPiece)


		// var pathDetails = that.isAPath(that, id, newId)
		// that.isPathKnown(pathDetails)
		// var dependenciesPass = that.extraDependencies(pathDetails, newId)
		// dependenciesPass = that.generalDependencies(pathDetails, dependenciesPass, newId)

		return false;
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

	displayPiece: function() {
		if (this.model !== undefined) {
			this.$el.css({
				background: 'url("../images/' + this.model.get('image') + '.png") no-repeat center center',
				// background: 'url("../app/images/' + this.model.get('image') + '.png") no-repeat center center',
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




