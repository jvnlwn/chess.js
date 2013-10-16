;(function(){
	var rank = ['1', '2', '3', '4', '5', '6', '7', '8'];
	var file = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	var darkSquare = 'rgb(255, 213, 139)';
	var lightSquare = 'rgb(87, 55, 0)';
	var colorCycles = {
		1: [darkSquare, lightSquare],
		2: [lightSquare, darkSquare],
	}

	for (i = 0; i < 64; i++) {
		var rankValue = rank[Math.floor(i / 8)];
		var fileValue = file[i % 8];

		if (rankValue === '2') {
			var piece = 'pawn'
		} else {var piece = undefined}

		new SquareView({
			model: new Square({piece: piece}),
			rank: rankValue,
			file: fileValue,
			color: colorCycles[rankValue % 2 + 1][i % 2]
		})
	}
})();
