chess.utilities = {};

chess.utilities.newGame = function() {
	var setup = chess.setup;

	for (i = 0; i < 64; i++) {
		var rankValue = setup.rank[Math.floor(i / 8)];
		var fileValue = setup.file[i % 8];
		var position = fileValue + rankValue;

		setup.squares.push(position);

		var cssPosition = {
			top: setup.percentages.top[rankValue],
			left: setup.percentages.left[fileValue]
		}

		var cssSquare = $.extend({
			width: '12.5%',
			height: '12.5%',
			position: 'absolute',
			background: setup.colorCycles[rankValue % 2 + 1][i % 2]
		}, cssPosition) 

		var square = '<div class="board-square ' + position + '"></div>';
		$('.chess-board').prepend($(square).css(cssSquare))

		// just for the board. For testing overlay colors when squares are targeted.
		var square = '<div></div>';
		$('.chess-board').prepend($(square).css(cssSquare))

		var collections = {
			'white': gameRouter.whitePieces,
			'black': gameRouter.blackPieces
		}

		var pieceWithColor = setup.piecePosition[position] || setup.piecePosition[rankValue];

		if (pieceWithColor) {
			var pieceToken = pieceWithColor.slice(1);
			var player = setup.color[pieceWithColor.slice(0,1)];
			var opponent = setup.opponentColor[pieceWithColor.slice(0,1)];

			var piece = new Piece({
				image:       pieceWithColor,
				position:    position,
				player:      player,
				opponent:    opponent,
				cssPosition: cssPosition
			})

			collections[player].add(piece)
		}
	}
}