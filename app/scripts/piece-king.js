Pieces['king'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', 'K')
		this.set('piece', 'king')
		this.set('paths', ['file', 'rank', 'diagonal'])
		this.set('range', 1)

		this.instruct = function(options) {
			this.moved = options.moved || false;

			if (this.moved) {
				this.range = 1;
			} else {
				this.range = 2;
			}
		}
		return this.instruct({});
	},

	extraDependencies: function(pathDetails) {

		// console.log('king deps')

		var dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies

			if (pathDetails.distance > this.get('range')) {
				var response = this.castle(pathDetails);

				if (response.dependenciesPass && !this.moved) {
					dependenciesPass = true;
					pathDetails.innerSquares = response.innerSquares;
				} else {
					dependenciesPass = false;
				}
			}

		}

		pathDetails.dependenciesPass = dependenciesPass

		return pathDetails;
	},

	castle: function(pathDetails) {
		var file = pathDetails.newId.slice(0, 1)
		var rank = pathDetails.newId.slice(1)

		var dependenciesPass = false;

		if (file === 'g') {
			var targetRook = 'h' + rank
			var innerSquares = ['f' + rank];
		} else {
			var targetRook = 'a' + rank
			var innerSquares = ['b' + rank, 'c' + rank, 'd' + rank];
		}

		var rook = this.collection.findWhere({position: targetRook})

		if (rook) {
			dependenciesPass = !rook.moved;	
		}

		var response = {
			dependenciesPass: dependenciesPass,
			innerSquares: innerSquares
		}

		return response;
	}
})
