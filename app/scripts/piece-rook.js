Pieces['rook'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function(){
		this.set('notation', 'R');
		this.set('piece', 'rook');
		this.set('paths', ['file', 'rank']);
		this.set('moved', false)
	},

	instruct: function() {
		this.resetPawns();
		this.set('moved', true);
	}
})