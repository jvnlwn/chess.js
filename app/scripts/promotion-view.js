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
		new QueenView(options)
		new RookView(options)
		new KnightView(options)
		new BishopView(options)
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
		var pawn = this.options.pawn;

		var oldAttributes = this.getAttributes(pawn);

		var collection = pawn.collection;

		pawn.destroy();

		var pieceToken = collection.add(this.chosen(oldAttributes)).get('notation').toUpperCase();

		this.options.notation.promote = true;
		this.options.notation.pieceToken = pieceToken;

		chess.utilities.checkmate(oldAttributes.opponent, this.options);
	},

	getAttributes: function(pawn) {
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

