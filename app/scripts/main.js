// these will probably move to a router . . . when I make one
var whitePieces = new WhitePieces();
var blackPieces = new BlackPieces();

;(function(){

	var rank = ['1', '2', '3', '4', '5', '6', '7', '8'];
	var file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	var darkSquare = 'rgb(148, 109, 41)';
	var lightSquare = 'rgb(255, 213, 139)';
	var colorCycles = {
		1: [lightSquare, darkSquare],
		2: [darkSquare, lightSquare],
	}

	var top = {
		'8': '0%',
		'7': '12.5%',
		'6': '25%',
		'5': '37.5%',
		'4': '50%',
		'3': '62.5%',
		'2': '75%',
		'1': '87.5%'
	}

	var left = {
		'a': '0%',
		'b': '12.5%',
		'c': '25%',
		'd': '37.5%',
		'e': '50%',
		'f': '62.5%',
		'g': '75%',
		'h': '87.5%'
	}

	var pieceType = {
		'p': 'pawn',
		'r': 'rook',
		'n': 'knight',
		'b': 'bishop',
		'q': 'queen',
		'k': 'king'
	}	

	var piecePosition = {
		'2': 'wp',
		'a1': 'wr',
		'b1': 'wn',
		'c1': 'wb',
		'd1': 'wq',
		'e1': 'wk',
		'f1': 'wb',
		'g1': 'wn',
		'h1': 'wr',
		'7': 'bp',
		'a8': 'br',
		'b8': 'bn',
		'c8': 'bb',
		'd8': 'bq',
		'e8': 'bk',
		'f8': 'bb',
		'g8': 'bn',
		'h8': 'br'
	}

	var color = {
		'w': 'white',
		'b': 'black'
	}

	var opponentColor = {
		'b': 'white',
		'w': 'black'
	}

	for (i = 0; i < 64; i++) {
		var rankValue = rank[Math.floor(i / 8)];
		var fileValue = file[i % 8];
		var id = fileValue + rankValue;

		var cssPosition = {
			top: top[rankValue],
			left: left[fileValue]
		}

		var cssSquare = $.extend({
			width: '12.5%',
			height: '12.5%',
			position: 'absolute',
			background: colorCycles[rankValue % 2 + 1][i % 2]
		}, cssPosition) 

		var square = '<div class="board-square"></div>';
		$('.chess-board').prepend($(square).css(cssSquare))

		if (piecePosition[id] || piecePosition[rankValue]) {
			var pieceTypeAndColor = piecePosition[id] || piecePosition[rankValue];
			var pieceToken = pieceTypeAndColor.slice(1);
			var player = color[pieceTypeAndColor.slice(0,1)];
			var opponent = opponentColor[pieceTypeAndColor.slice(0,1)];

			// setting pawn notation to '' for notation purposes
			if(pieceToken === 'p') {
				var notation = '';
			} else {
				var notation = pieceToken.toUpperCase();
			}

			var piece = {
				piece: pieceType[pieceToken],
				image: pieceTypeAndColor,
				token: pieceToken.toUpperCase(),
				position: id,
				notation: notation,
				player: player,
				opponent: opponent
			}

			var pieceView = {
				rank: rankValue,
				file: fileValue,
				cssPosition: cssPosition,
				id: id,
				left: left,
				top: top,
				rankArray: rank,
				fileArray: file
			}

			if (player === 'white') {
				whitePieces.add(piece)
				pieceView.model = whitePieces.last();
			} else {
				blackPieces.add(piece)
				pieceView.model = blackPieces.last();
			}

			new PieceView(pieceView)
		}
	}
})();
