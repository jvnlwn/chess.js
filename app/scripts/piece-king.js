Pieces['king'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', 'K');
		this.set('piece', 'king');
		this.set('paths', ['file', 'rank', 'diagonal']);
		this.set('range', 1);
		this.set('moved', false);
	},

	instruct: function(options) {
		this.resetPawns();
		this.set('moved', true);
	},

	extraDependencies: function(pathDetails) {

		pathDetails.dependenciesPass = true;

		if (pathDetails.path) {
			// path is good but check these dependencies

			if (pathDetails.distance > this.get('range')) {
				var response = this.castle(pathDetails);

				if (response.dependenciesPass && !this.moved) {
					pathDetails.dependenciesPass = true;
					pathDetails.innerSquares = response.innerSquares;
				} else {
					pathDetails.dependenciesPass = false;
				}
			}
		}

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
			dependenciesPass = !rook.get('moved');	
		}

		var response = {
			dependenciesPass: dependenciesPass,
			innerSquares: innerSquares
		}

		return response;
	}
})
