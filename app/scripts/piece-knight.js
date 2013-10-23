Pieces['knight'] = Piece.extend({
	initialize: function() {
		this.render()
	},

	render: function() {
		this.set('notation', 'N')
		this.set('piece', 'knight')
		this.set('paths', ['l-shape'])

		this.instruct = function() {
			this.paths = ['l-shape']
		}
		return this.instruct({});
	}
})