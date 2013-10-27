var chess = {};

chess.setup = {

	rank: ['1', '2', '3', '4', '5', '6', '7', '8'],
	file: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],

	squares: [],

	attackedSquares: [],

	blockOrCapture: [],

	PathDetails: function(options) {
		this.path =             false,
		this.distance =         0,
		this.fileDiff =         {},
		this.rankDiff =         {},
		this.id =               options.id,
		this.newId =            options.newId || '',
		this.castle =           {squares: []},
		this.dependenciesPass = true,
		this.player =           false || options.player,
		this.targeting =        false || options.targeting,
		this.canTarget =        false || options.canTarget,
		this.promotion =        {promote: false}
	},

	darkSquare: 'rgb(148, 109, 41)',
	lightSquare:'rgb(255, 213, 139)',

	percentages: {
		top: {
			'8': '0%',
			'7': '12.5%',
			'6': '25%',
			'5': '37.5%',
			'4': '50%',
			'3': '62.5%',
			'2': '75%',
			'1': '87.5%'
		},

		left: {
			'a': '0%',
			'b': '12.5%',
			'c': '25%',
			'd': '37.5%',
			'e': '50%',
			'f': '62.5%',
			'g': '75%',
			'h': '87.5%'
		}
	},

	pieceType: {
		'p': 'pawn',
		'r': 'rook',
		'n': 'knight',
		'b': 'bishop',
		'q': 'queen',
		'k': 'king'
	},	

	piecePosition: {
		'2' : 'wp',
		'a1': 'wr',
		'b1': 'wn',
		'c1': 'wb',
		'd1': 'wq',
		'e1': 'wk',
		'f1': 'wb',
		'g1': 'wn',
		'h1': 'wr',
		'7' : 'bp',
		'a8': 'br',
		'b8': 'bn',
		'c8': 'bb',
		'd8': 'bq',
		'e8': 'bk',
		'f8': 'bb',
		'g8': 'bn',
		'h8': 'br'
	},

	color: {
		'w': 'white',
		'b': 'black'
	},

	opponentColor: {
		'b': 'white',
		'w': 'black'
	}
}

chess.setup.colorCycles = {
	1: [chess.setup.lightSquare, chess.setup.darkSquare],
	2: [chess.setup.darkSquare, chess.setup.lightSquare],
}
