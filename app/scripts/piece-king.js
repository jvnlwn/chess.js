Pieces['king'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', 'K')
		this.set('piece', 'king')
		this.set('paths', ['file', 'rank', 'diagonal'])

		this.instruct = function(options) {
			this.moved = options.moved || false;

			if (this.moved) {
				this.range = 1;
			} else {
				this.range = 2;
			}

			this.castle = function(pathDetails) {
				var file = pathDetails.newId.slice(0, 1)
				var rank = pathDetails.newId.slice(1)

				if (file === 'g') {
					var targetRook = 'h' + rank
					var innerSquares = ['f' + rank];
				} else {
					var targetRook = 'a' + rank
					var innerSquares = ['c' + rank, 'd' + rank];
				}

				var rook = this.collection.findWhere({position: targetRook})

				var dependenciesPass = rook.moved;

				var response = [dependenciesPass, innerSquares]

				return response;
			}

			this.set('dependencies', {
				'file': {
					range: 1 
				},
				'rank': {
					range: this.range,
				},
				'diagonal': {
					range: 1
				}
			})
		}
		return this.instruct({});
	},

	extraDependencies: function(pathDetails) {
		var dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies
			var dependencies = this.get('dependencies')[pathDetails.path]

			if (pathDetails.distance > dependencies.range) {
				dependenciesPass = false;
				console.log('bad range')
			}

			// if (pathDetails.distance === 2) {
			// 	var response =  this.castle(pathDetails)
			// 	if (!response.dependenciesPass) {
			// 		dependenciesPass = false;
			// 	} else {
			// 		pathDetails.innerSquares = response.innerSquares;
			// 	}
			// }

			// gotta finish this idea. return pathDetails  . . get that working with other functions

		}

		pathDetails.dependenciesPass = dependenciesPass

		return pathDetails;
	}
})
