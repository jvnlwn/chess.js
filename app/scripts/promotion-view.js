PromotionView = Backbone.View.extend({
	className: 'promotion-view',

	initialize: function(options) {
		this.options = options;

		var that = this;
		this.listenTo(this.options.pawn, 'destroy', function() {
			that.remove();
		}) 

		$('.chess-board').append(this.$el);

		this.render(this.options);
	},

	render: function(options) {
		new QueenView($.extend(options,  {image: 'q'}))
		new RookView($.extend(options,   {image: 'r'}))
		new KnightView($.extend(options, {image: 'n'}))
		new BishopView($.extend(options, {image: 'b'}))
	}
})



PromotionPiecesView = Backbone.View.extend({

	className: 'promote',
	
	initialize: function(options) {
		this.options = options

		$('.promotion-view').append(this.$el);

		this.render();
	},

	promote: function() {
		console.log('hey your promoting')

		var pawn = this.options.pawn;

		var oldAttributes = this.getAttributes(pawn, this.options.image);

		var collection = pawn.collection

		pawn.destroy();

		var newPiece = this.chosen(oldAttributes)
		collection.add(newPiece)

		chess.utilities.checkmate(newPiece.get('opponent'), this.options)


	},

	getAttributes: function(pawn, image) {
		return {
			position:    pawn.get('position'),
			player:      pawn.get('player'),
			opponent:    pawn.get('opponent'),
			cssPosition: pawn.get('cssPosition')
		}
	}
})

QueenView = PromotionPiecesView.extend({

	events: {
		'click': 'promote'
	},

	render: function() {
		this.image = this.options.pawn.get('image').slice(0,1) + 'q';

		this.$el.css({
			'background': 'url("../images/' + this.image + '.png") no-repeat center center',
			'background-size': 'cover'
		})
	},

	chosen: function(oldAttributes) {
		return new Pieces['queen']($.extend(oldAttributes, {image: this.image}))
	}
})

RookView = PromotionPiecesView.extend({

	events: {
		'click': 'promote'
	},

	render: function() {
		this.image = this.options.pawn.get('image').slice(0,1) + 'r';

		this.$el.css({
			'background': 'url("../images/' + this.image + '.png") no-repeat center center',
			left: '20%',
			'background-size': 'cover'
		})
	},

	chosen: function(oldAttributes) {
		return new Pieces['rook']($.extend(oldAttributes, {image: this.image}))
	}
})

KnightView = PromotionPiecesView.extend({

	events: {
		'click': 'promote'
	},

	render: function() {
		this.image = this.options.pawn.get('image').slice(0,1) + 'n';

		this.$el.css({
			'background': 'url("../images/' + this.image + '.png") no-repeat center center',
			left: '42%',
			'background-size': 'cover'
		})
	},

	chosen: function(oldAttributes) {
		return new Pieces['knight']($.extend(oldAttributes, {image: this.image}))
	}
})

BishopView = PromotionPiecesView.extend({

	events: {
		'click': 'promote'
	},

	render: function() {
		this.image = this.options.pawn.get('image').slice(0,1) + 'b';

		this.$el.css({
			'background': 'url("../images/' + this.image + '.png") no-repeat center center',
			left: '65%',
			'background-size': 'cover'
		})
	},

	chosen: function(oldAttributes) {
		return new Pieces['bishop']($.extend(oldAttributes, {image: this.image}))
	}
})

