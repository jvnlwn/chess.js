Pieces['bishop'] = Piece.extend({
	initialize: function() {
		this.render();
	},

	render: function() {
		this.set('notation', 'B');
		this.set('piece', 'bishop');
		this.set('paths', ['diagonal']);

	},
	
	instruct: function() {
		this.resetPawns();
	}
})