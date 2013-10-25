Pieces['queen'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', 'Q');
		this.set('piece', 'queen');
		this.set('paths', ['file', 'rank', 'diagonal']);
	},

	instruct: function() {
		this.resetPawns();
	}
})