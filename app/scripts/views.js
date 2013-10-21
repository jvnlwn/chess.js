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
			that.extraDependencies(pathDetails, newId)
		},100)

		// if (this.model.options.token === 'K' ) {
		// 	console.log(this.model.castle('g8'))
		// }
	},

	isAPath: function(that, id, newId) {
		var pathDetails = {
			path:     false,
			distance: 0
			// direction
		}

		var files = {
			original: id.slice(0, 1),
			target:   newId.slice(0, 1)
		}

		var ranks = {
			original: id.slice(1),
			target:   newId.slice(1)
		}

		var fileDiff = {}
		var rankDiff = {}

		that.options.fileArray.forEach(function(file, index){
			if (files.original === file) {
				fileDiff.original = index;
			}
			if (files.target === file) {
				fileDiff.target = index;
			}

		})

		that.options.rankArray.forEach(function(rank, index){
			if (ranks.original === rank) {
				rankDiff.original = index;
			}
			if (ranks.target === rank) {
				rankDiff.target = index;
			}
		})

		fileDiff.diff = Math.abs(fileDiff.original - fileDiff.target)
		rankDiff.diff = Math.abs(rankDiff.original - rankDiff.target)


		// cascades: a file or rank path with distance of 3 will overide this
		if ((fileDiff.diff + rankDiff.diff) === 3) {
			pathDetails.path = 'l-shape';
			pathDetails.distance = 3;
		}

		if (fileDiff.diff === 0) {
			pathDetails.path = 'file';
			pathDetails.distance = rankDiff.diff;
		}

		if (rankDiff.diff === 0) {
			pathDetails.path = 'rank';
			pathDetails.distance = fileDiff.diff;
		}

		if (Math.abs(fileDiff.diff - rankDiff.diff) === 0) {
			pathDetails.path = 'diagonal';
			pathDetails.distance = fileDiff.diff;
		}

		// piece wasn't moved from square
		if (pathDetails.distance === 0) {
			pathDetails.path = false;
		}

		// determine if move was forward direction
		if ((that.model.options.player === 'white' && (rankDiff.original - rankDiff.target) < 0) || (that.model.options.player === 'black' && (rankDiff.original - rankDiff.target) > 0)) {
			pathDetails.direction = 'forward';
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
		if (pathDetails.path && this.model.dependencies) {
			// path is good but check these dependencies
			var dependenciesPass = true;
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
						dependenciesPass = false;
					}
				}

				if (dependencies.occupied === this.model.options.opponent) {
					var pieceIsThere = blackPieces.findWhere({position: newId}) || whitePieces.findWhere({position: newId}) || false;

					if ((!pieceIsThere) || (pieceIsThere.player !== this.model.options.opponent)) {
						dependenciesPass = false;
					}
				}
			}

			return dependenciesPass;
		}
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




