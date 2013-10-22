// these will probably move to a router . . . when I make one
var whitePieces = new WhitePieces();
var blackPieces = new BlackPieces();

;(function(){
	for (i = 0; i < 64; i++) {
		var rankValue = ChessUtilities.setup.rank[Math.floor(i / 8)];
		var fileValue = ChessUtilities.setup.file[i % 8];
		var id = fileValue + rankValue;

		var cssPosition = {
			top: ChessUtilities.setup.percentages.top[rankValue],
			left: ChessUtilities.setup.percentages.left[fileValue]
		}

		var cssSquare = $.extend({
			width: '12.5%',
			height: '12.5%',
			position: 'absolute',
			background: ChessUtilities.setup.colorCycles[rankValue % 2 + 1][i % 2]
		}, cssPosition) 

		var square = '<div class="board-square"></div>';
		$('.chess-board').prepend($(square).css(cssSquare))

		var piecePosition = ChessUtilities.setup.piecePosition
		var pieceType = ChessUtilities.setup.pieceType

		if (piecePosition[id] || piecePosition[rankValue]) {
			var pieceTypeAndColor = piecePosition[id] || piecePosition[rankValue];
			var pieceToken = pieceTypeAndColor.slice(1);
			var player = ChessUtilities.setup.color[pieceTypeAndColor.slice(0,1)];
			var opponent = ChessUtilities.setup.opponentColor[pieceTypeAndColor.slice(0,1)];

			// setting pawn notation to '' for notation purposes
			if(pieceToken === 'p') {
				var notation = '';
			} else {
				var notation = pieceToken.toUpperCase();
			}

			var piece = new Pieces[pieceType[pieceToken]]({
				piece: pieceType[pieceToken],
				image: pieceTypeAndColor,
				token: pieceToken.toUpperCase(),
				position: id,
				notation: notation,
				player: player,
				opponent: opponent
			})

			var pieceView = {
				rank: rankValue,
				file: fileValue,
				cssPosition: cssPosition,
				id: id,
				left: ChessUtilities.setup.percentages.left,
				top: ChessUtilities.setup.percentages.top,
				rankArray: ChessUtilities.setup.rank,
				fileArray: ChessUtilities.setup.file
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

