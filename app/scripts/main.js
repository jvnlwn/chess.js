;(function(){
	var rank = ['1', '2', '3', '4', '5', '6', '7', '8'];
	var file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	var darkSquare = 'rgb(255, 213, 139)';
	var lightSquare = 'rgb(87, 55, 0)';
	var colorCycles = {
		1: [darkSquare, lightSquare],
		2: [lightSquare, darkSquare],
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


	for (i = 0; i < 64; i++) {
		var rankValue = rank[Math.floor(i / 8)];
		var fileValue = file[i % 8];

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
		$('.container').prepend($(square).css(cssSquare))

		if (rankValue === '2') {

			new SquareView({
				model: new Square({piece: 'pawn'}),
				rank: rankValue,
				file: fileValue,
				cssPosition: cssPosition,
				id: fileValue + rankValue
			})
		} 
	}
})();
