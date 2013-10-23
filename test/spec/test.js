/*global describe, it */

// What to test:

// 1. pawn
// 	a) can do
// 		1. move one space forward pending no inhibition
// 		2. move two space forward pending pawn has never moved previously and no inhibition
// 		3. move diagonaly capture pending opponent occupies target square
// 		4. perform en passant pending opponent just moved pawn two spaces on his last move and attacking pawn is in correct space to perform en passant
// 		5. promote to a knight, bishop, rook, or queen when advanced to end of baord
// 	b) cannot do
// 		1. perform a forward capture
// 		2. move diagonal if no opponent piece possesses target square
// 		3. perform a two space forward move if pawn has already been moved
// 		4. perform a two space forward move if oppenent piece is directly in front
// 		5. perform a two space forward move if oppenent piece possesses target square
// 		6. move backward

// 2. rook
// 	a) can do
// 		1. move as many vacant spaces along a file + square if opponent piece possesses said square
// 		2. move as many vacant spaces along a rank + square if opponent piece possesses said square
// 		3. perform castle pending rook has not been moved
// 	b) cannot do
// 		1. move diagonally
// 		2. move past an opponent piece along a file
// 		3. move past an opponent piece along a rank
// 		4. perform castle if rook has been moved

// 3. knight
// 	a) can do
// 		1. move two spaces from square along a file and 1 space from THERE along a rank
// 		2. move two spaces from square along a rank and 1 space from THERE along a file
// 	b) cannot do
// 		1. any move other than specified

// 4. bishop
// 	a) can do
// 		1. move as many vacant spaces along a diagonal in any direction + 1 square pending opponent piece possesses said square
//  b) cannot do
// 		1. move past an opponent piece along any diagonal
// 		2. move along a file
// 		3. move along a rank

// 5. queen
// 	a) can do
// 		1. move as many vacant spaces along a file + square if opponent piece possesses said square
// 		2. move as many vacant spaces along a rank + square if opponent piece possesses said square
// 		3. move as many vacant spaces along a diagonal in any direction + 1 square pending opponent piece possesses said square
// 	b) cannot do
// 		1. move past an opponent piece along a file
// 		2. move past an opponent piece along a rank
// 		3. move past an opponent piece along any diagonal

// 6. king
//  a) can do pending check
// 		1. move one square along a file
// 		2. move one square along a rank
// 		3. move one square along a diagonal
// 		4. perform king's side castle pending many things
// 		5. perform queen's side castle pending many things
//  b) cannot do
// 		1. perform castle if king has been moved
// 		2. perform castle if target rook has been moved
// 		3. perform castle if any space inbetween king and rook are occupied
// 		4. perform castle if any space inbetween king and rook are targeted by any opponent piece
 
// 7. all
//  a) can do
//  b) cannot do
// 		1. move to square that is already possessed by same color
// 		2. move that puts own king in check
// 		3. move that keeps king in check








'use strict';
(function () {

	function findPosition(id, square) {
    	var leftPercentage = parseInt($(id).css('left').slice(0, -1))
		var topPercentage = parseInt($(id).css('top').slice(0, -1))
	
		return {
			left: ((leftPercentage / $('.chess-board').width()) * 100).toString() + '%',
			top: ((topPercentage / $('.chess-board').width()) * 100).toString() + '%'
		}
	}

	// no way to foce a jquery mousemove to mimic dragging. This is best attempt:
	function moveTest(pieceSquare, targetSquare, valid, done) {
		if (valid) {
			var targetId = targetSquare
		} else {
			var targetId = pieceSquare
		}

		var pieceId = pieceSquare


		$('#' + pieceId).css(
			{
				'left': left[targetSquare.slice(0, 1)],
				'top': top[targetSquare.slice(1)]
			})

		var that = $('#' + pieceId).mouseup();

		setTimeout(function() {
			var id = '#' + $(that).attr('id')

			var newPositionPercentages = findPosition(id)

	    	expect(id).to.equal('#' + targetId);
	    	expect(newPositionPercentages.left).to.equal(expectedLeft[targetId.slice(0, 1)]);
			expect(newPositionPercentages.top).to.equal(expectedTop[targetId.slice(1)]);
			done();
		}, 150)
	}

	// stubbing out positions that resemble a piece's position on player's mouseup. For easy use in testing.
	var top = {
		'8': '1%',
		'7': '12%',
		'6': '24%',
		'5': '37%',
		'4': '49%',
		'3': '62%',
		'2': '74%',
		'1': '87%'
	}

	var left = {
		'a': '1%',
		'b': '12%',
		'c': '24%',
		'd': '37%',
		'e': '49%',
		'f': '62%',
		'g': '74%',
		'h': '87%'
	}

	// for testing purposes
	var expectedTop = {
		'8': '0%',
		'7': '12.5%',
		'6': '25%',
		'5': '37.5%',
		'4': '50%',
		'3': '62.5%',
		'2': '75%',
		'1': '87.5%'
	}

	var expectedLeft = {
		'a': '0%',
		'b': '12.5%',
		'c': '25%',
		'd': '37.5%',
		'e': '50%',
		'f': '62.5%',
		'g': '75%',
		'h': '87.5%'
	}

	$('.square').each(function() {
		$(this).css({
    		position: 'absolute',
    		// '-webkit-transition': 'all .1s ease'
		})
	})

    describe('chess board', function () {

    	this.timeout(3000);

        describe('pieces when moved', function () {
            it('should snap to position', function (done) {
            	moveTest('e2', 'e4', true, done)
            });

			it('should have id reassigned to correctly notated position when move is valid', function (done) {
            	$('#e7').css(
            		{
            			'left': left['e'],
            			'top': top['5']
            		})

            	
            	var that = $('#e7').mouseup();

        		setTimeout(function() {
        			var id = $(that).attr('id')

	            	expect(id).to.equal('e5');
        			done();
        		}, 500)
			})
        });

		describe('pawn at e4', function() {

			it('forward capture 2. e5 ... should be unsuccessful', function (done) {
				moveTest('e4', 'e5', false, done)
			})

			it('diagonal pass 2. d5 ... should be unsuccessful', function (done) {
				moveTest('e4', 'd5', false, done)
			})

			it('arbitrary move 2. h5 ... should be unsuccessful', function (done) {
				moveTest('e4', 'h5', false, done)
			})
		})

		describe('knight at b1', function() {

			it('taking already possessed square 2. Nd2 ... should be unsuccessful', function(done) {
				moveTest('b1', 'd2', false, done)
			})

			it('moving a file "L" 2. Nc3 ... should be successful', function(done) {
				moveTest('b1', 'c3', true, done)
			})
		})

		describe('knight at g8', function() {

			it('moving arbitrary 2. ... Na4 should be unsuccessful', function(done) {
				moveTest('g8', 'a4', false, done)
			})

			it('moving a rank "L" 2. ... Ne7 should be successful', function(done) {
				moveTest('g8', 'e7', true, done)
			})
		})

		describe('bishop at f1', function() {

			it('diagonal jump 3. Bh3 ... should be unsuccessful', function(done) {
				moveTest('f1', 'h3', false, done)
			})

			it('diagonal move 3. Bc4 ... should be successful', function(done) {
					moveTest('f1', 'c4', true, done)
				})
			})

		describe('pawn at d7', function() {

			it('forward two spaces 3. ... d5 should be successful', function(done) {
				moveTest('d7', 'd5', true, done)
			})
		})

		describe('pawn at e4', function() {

			it('backward one space 4. e3 ... should be unsuccessful', function(done) {
				moveTest('e4', 'e3', false, done)
			})

			it('diagonal capture 4. exd5 ... should be successful', function(done) {
				moveTest('e4', 'd5', true, done)
			})

			// check for bp on d5 to be captured

		})

		describe('pawn at e5', function() {

			it('wierd en passant 4. ... d4 should be unsuccessful', function(done) {
				moveTest('e5', 'd4', false, done)
			})

			it('forward two spaces after been moved 4. ... e3 should be successful', function(done) {
				moveTest('e5', 'e3', false, done)
			})

			it('forward move 4. ... e4 should be successful', function(done) {
				moveTest('e5', 'e4', true, done)
			})
		})

		describe('en passant', function() {

			it('pawn at f2 forward two spaces 5. f4 ... should be successful', function(done) {
				moveTest('f2', 'f4', true, done)
			})

			it('pawn at e4 perform en passant 5. ... exf3 should be successful', function(done) {
				moveTest('e4', 'f3', true, done)
			})

			// check for wp on f4 to be captured
		})

		describe('move king into check', function() {

			it('6. Ke2 ... should be unsuccessful', function(done) {
				moveTest('e1', 'e2', false, done)
			})
		}) 

		describe('queen at d1 invalid moves and one good', function() {

			it('jump over piece on rank 6. Qf1 ... should be unsuccessful', function(done) {
				moveTest('d1', 'f1', false, done)
			})

			it('jump over piece on file 6. Qd3 ... should be unsuccessful', function(done) {
				moveTest('d1', 'd3', false, done)
			})

			it('jump over piece on diagonal 6. Qg4 ... should be unsuccessful', function(done) {
				moveTest('d1', 'g4', false, done)
			})

			it('move to own occupied square 6. Qe1 ... should be unsuccessful', function(done) {
				moveTest('d1', 'e1', false, done)
			})

			it('move diagonal one square 6. Qe2 ... should be successful', function(done) {
				moveTest('d1', 'e2', true, done)
			})
		})

		describe('piece pinned to king', function() {

			it('move pinned N 6. ... Nc6 should be unsuccessful', function(done) {
				moveTest('e7', 'c6', false, done)
			})

			it('move pinned N 6. ... Nxd5 should be unsuccessful', function(done) {
				moveTest('e7', 'd5', false, done)
			})
		})

		describe('6. ... Bh3, 7. Nxh3 ... AND pawn inhibited test', function() {

			it('B at c8 arbitrary move 6. ... Bd8 should be unsuccessful', function(done) {
				moveTest('c8', 'f6', false, done)
			})

			it('B at c8 move diagonal 6. ... Bh3 should be successful', function(done) {
				moveTest('c8', 'h3', true, done)
			})

			it('pawn at h2 move one forward 7. h3 ... should be successful', function(done) {
				moveTest('h2', 'h3', false, done)
			})

			it('pawn at h2 move two forward 7. h4 ... should be successful', function(done) {
				moveTest('h2', 'h4', false, done)
			})

			it('N at g1 move diagonal 7. Nxh3 ... should be successful', function(done) {
				moveTest('g1', 'h3', true, done)
			})

			// check for bb at h3 to be captured 
		})

		describe('failed en passant', function() {

			it('p at c7 move forward two squares 8. ... c5 should be successful', function(done) {
				moveTest('c7', 'c5', true, done)
			})

			it('p at d2 move forward one square 9. d3 ... should be successful', function(done) {
				moveTest('d2', 'd3', true, done)
			})

			it('p at g7 move forward one square 9. ... g8 should be successful', function(done) {
				moveTest('g7', 'g6', true, done)
			})

			it('p at d5 move forward one square 10. dxc6 ... should be unsuccessful', function(done) {
				moveTest('d5', 'c6', false, done)
			})
		})

		describe('bishop takes piece', function() {

			it('B at c1 diagaonal 10. Bh6 ... should be successful', function(done) {
				moveTest('c1', 'h6', true, done)
			})

			it('B at f8 rank move 10. ... Bh8 should be unsuccessful', function(done) {
				moveTest('f8', 'h6', false, done)
			})

			it('B at f8 diagaonal 10. ... Bxh6 should be successful', function(done) {
				moveTest('f8', 'h6', true, done)
			})

			// check for wb at h6 to be captured 
		})

		describe('pawn at d5', function() {

			it('move forward one 11. d6 ... should be successful', function(done) {
				moveTest('d5', 'd6', true, done)
			})
		})

		describe('castling attempts while in check', function() {

			it('p at f3, 11. ... f2+ should be successful', function(done) {
				moveTest('f3', 'f2', true, done)
			})

			it('king\'s side castle at g1, 12. O-O ... should be unsuccessful', function(done) {
				moveTest('e1', 'g1', false, done)
			})

			it('queen\'s sied castle at c1, 12. O-O-O ... should be unsuccessful', function(done) {
				moveTest('e1', 'c1', false, done)
			})

			it('queen takes pawn, 12. Qxf2 ... should be successful', function(done) {
				moveTest('e2', 'f2', true, done)
			})
		})

		describe('pinned knight free', function() {

			it('N at e7, 12. ... Nc6 should be successful', function(done) {
				moveTest('e7', 'c6', true, done)
			})
		})

		describe('move queens', function() {

			it('Q at f2 arbitrary move, 13. Qg4 ... should be unsuccessful', function(done) {
				moveTest('f2', 'g4', false, done)
			})

			it('Q at f2, 13. Qd2 ... should be successful', function(done) {
				moveTest('f2', 'd2', true, done)
			})

			it('Q at d8, 13. ... Qf6 should be successful', function(done) {
				moveTest('d8', 'f6', true, done)
			})
		})

		describe('castling attempts plus king moves', function() {

			it('king\'s side castle at g1 through check, 14. O-O ... should be unsuccessful', function(done) {
				moveTest('e1', 'g1', false, done)
			})

			it('rook move past piece on file, 14. Ra3 ... should be unsuccessful', function(done) {
				moveTest('a1', 'a3', false, done)
			})

			it('rook move past piece on rank, 14. Rg1 ... should be unsuccessful', function(done) {
				moveTest('a1', 'g1', false, done)
			})

			it('rook move on rank, 14. Rb1 ... should be successful', function(done) {
				moveTest('a1', 'b1', true, done)
			})

			it('queen\'s side castle at c8, 14. ... O-O-O should be unsuccessful', function(done) {
				moveTest('e8', 'c8', false, done)
			})

			it('king\'s side castle at g8, 14. ... O-O should be successful', function(done) {
				moveTest('e8', 'g8', true, done)
			})

			it('queen\'s side castle at c1, 15. O-O-O ... should be unsuccessful', function(done) {
				moveTest('e1', 'c1', false, done)
			})
		})

		describe('king moves', function() {

			it('K at e1, 15. Kd2 ... should be unsuccessful', function(done) {
				moveTest('e1', 'd2', false, done)
			})

			it('K at e1, 15. Kf2 ... should be unsuccessful', function(done) {
				moveTest('e1', 'f2', false, done)
			})

			it('K at e1, 15. Kf3 ... should be unsuccessful', function(done) {
				moveTest('e1', 'f3', false, done)
			})

			it('K at e1, 15. Ke2 ... should be successful', function(done) {
				moveTest('e1', 'e2', true, done)
			})

			it('K at g8, 15. ... Kf8 should be unsuccessful', function(done) {
				moveTest('g8', 'f8', false, done)
			})

			it('K at g8, 15. ... Kh8 should be successful', function(done) {
				moveTest('g8', 'h8', true, done)
			})

			it('K at e2, 16. Kd1 ... should be successful', function(done) {
				moveTest('e2', 'd1', true, done)
			})

			it('K at h8, 16. ... Kh7 should be unsuccessful', function(done) {
				moveTest('h8', 'h7', false, done)
			})

			it('K at h8, 16. ... Kg7 should be successful', function(done) {
				moveTest('h8', 'g7', true, done)
			})

			it('K at d1, 17. Ke1 ... should be successful', function(done) {
				moveTest('d1', 'e1', true, done)
			})

			it('K at g7, 17. ... Kg8 should be successful', function(done) {
				moveTest('g7', 'g8', true, done)
			})

			it('king\'s side castle at g1 after king been moved, 18. O-O ... should be unsuccessful', function(done) {
				moveTest('e1', 'g1', false, done)
			})
		})

		describe('pawn promote and queen carnage', function() {

			it('p at d5, 18. d6 ... should be successful', function(done) {
				moveTest('d5', 'd6', true, done)
			})

			it('Q at f6, 18. ... Qxc3 should be successful', function(done) {
				moveTest('f6', 'c3', true, done)
			})

			// check that wn at c3 was captured

			it('p at d6, 19. d7 ... should be successful', function(done) {
				moveTest('d6', 'd7', true, done)
			})

			it('Q at c3, 19. ... Qxd3 should be successful', function(done) {
				moveTest('c3', 'd3', true, done)
			})

			// check that wp at d3 was captured

			it('p at d7, 20. d8=? ... should be successful', function(done) {
				moveTest('d7', 'd8', true, done)
			})

			// check that pawn was promoted

			it('Q at d3, 20. ... Qxh3 should be successful', function(done) {
				moveTest('d3', 'h3', true, done)
			})

			// check that wn at h3 was captured
		})

		describe('check bishop rank and file move', function() {

			it('B at c4, 21. Bc3 ... should be unsuccessful', function(done) {
				moveTest('c4', 'c3', false, done)
			})

			it('B at c4, 21. Be4 ... should be unsuccessful', function(done) {
				moveTest('c4', 'e4', false, done)
			})
		})

		describe('rook moves', function() {

			it('R at h1, 21. Re1 ... should be unsuccessful', function(done) {
				moveTest('h1', 'e1', false, done)
			})

			it('R at h1, 21. Rf1 ... should be successful', function(done) {
				moveTest('h1', 'f1', true, done)
			})

			it('R at f8, 21. ... Rxd8 should be successful', function(done) {
				moveTest('f8', 'd8', true, done)
			})

			// check that w? at d8 was captured

			it('R at f1, 22. Rxf7 ... should be successful', function(done) {
				moveTest('f1', 'f7', true, done)
			})

			// check that bp at f7 was captured

			it('R at d8, 22. ... Rf6 should be unsuccessful', function(done) {
				moveTest('d8', 'f6', false, done)
			})

			it('R at d8, 22. ... Rxd2 should be successful', function(done) {
				moveTest('d8', 'd2', true, done)
			})

			// check that wq at d2 was captured

			it('R at f7, 23. Rxb7+ ... should be successful', function(done) {
				moveTest('f7', 'b7', true, done)
			})

			// check that bp at b7 was captured

			it('R at d2, 23. ... Rxg2 should be unsuccessful', function(done) {
				moveTest('d2', 'g2', false, done)
			})

			it('K at g8, 23. ... Kg7 should be unsuccessful', function(done) {
				moveTest('g8', 'g7', false, done)
			})

			it('K at g8, 23. ... Kf8 should be successful', function(done) {
				moveTest('g8', 'f8', true, done)
			})

			it('R at b7, 24. Rxa7 ... should be successful', function(done) {
				moveTest('b7', 'a7', true, done)
			})

			// check that bp at a2 was captured

			it('R at d2, 24. ... Rxh2 should be unsuccessful', function(done) {
				moveTest('d2', 'h2', false, done)
			})

			it('R at d2, 24. ... Rxg2 should be successful', function(done) {
				moveTest('d2', 'g2', true, done)
			})

			// check that wp at g2 was captured

			it('R at a7, 25. Rxa8 ... should be successful', function(done) {
				moveTest('a7', 'a8', true, done)
			})

			// check that br at a8 was captured

			it('Q at h3, 25. ... Qe3+ should be successful', function(done) {
				moveTest('h3', 'e3', true, done)
			})

			it('K at e1, 26. Kf1 ... should be successful', function(done) {
				moveTest('e1', 'f1', true, done)
			})

			it('Q at e3, 26. ... Qf2# should be successful', function(done) {
				moveTest('e3', 'f2', true, done)
			})

			it('K at f1, 27. Kxf2 ... should be unsuccessful', function(done) {
				moveTest('f1', 'f2', false, done)
			})

			it('p at h2, 27. h3 ... should be unsuccessful', function(done) {
				moveTest('h2', 'h3', false, done)
			})
		})
    });
})();

