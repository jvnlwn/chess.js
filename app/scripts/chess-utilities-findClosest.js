chess.utilities.findClosest = function(pathDetails) {
	var id = '#' + pathDetails.position;	

	var actual = {
		left: parseInt(($(id).css('left')).slice(0, -2)),
		top: parseInt(($(id).css('top')).slice(0, -2))
	}

	var boardDimensions = {
		width:  parseInt($('.chess-board').css('width').slice(0, -2)),
		height: parseInt($('.chess-board').css('height').slice(0, -2))
	}

	var closest = {
		left: boardDimensions.width,
		top: boardDimensions.height
	}

	var newPercentages = {};

	$('.board-square').each(function(){
	    var possible = {
	    	left: parseInt(($(this).css('left')).slice(0, -2)),
	    	top: parseInt(($(this).css('top')).slice(0, -2))
	    }

	    var diff = {
	    	left: Math.abs(actual.left - possible.left),
	    	top: Math.abs(actual.top - possible.top)
	    }

	    if (diff.left <= closest.left && diff.top <= closest.top) {
	    	closest = {
	    		left: diff.left,
	    		top: diff.top
	    	}

	    	newPercentages = {
	    		left: possible.left,
	    		top: possible.top
	    	}
	    }
	})

	newPercentages = {
		left: ((newPercentages.left / boardDimensions.width) * 100).toString() + '%',
		top: ((newPercentages.top / boardDimensions.height) * 100).toString() + '%'
	}

	return newPercentages;
}
	