Pieces['rook'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function(){
		this.set('notation', 'R'),
		this.set('piece', 'rook'),
		this.set('paths', ['file', 'rank']),

		this.instruct = function(options) {
			this.moved = options.moved || false;
			this.paths = ['file', 'rank']
		}
		return this.instruct({});
	}	
})