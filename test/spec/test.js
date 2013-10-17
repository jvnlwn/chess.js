/*global describe, it */
'use strict';
(function () {

	$('.square').each(function() {
		$(this).css({
    		position: 'absolute'
		})
	})

    describe('chess board', function () {

    	this.timeout(3000);

        describe('pieces when moved', function () {
            it('should snap to position', function (done) {
            	// no way to foce a jquery mousemove to mimic dragging. This is best attempt:
            	var a3 = {
            		left: '0%',
            		top: '62.5%'
            	}

            	$('#a2').css(
            		{
            			'left': '5%',
            			'top': '65%'
            		})

            	$('#a2').mouseup(function(){
            		var that = this;
            		setTimeout(function() {
            			var id = '#' + $(that).attr('id')

			        	var leftPercentage = parseInt($(id).css('left').slice(0, -1))
						var topPercentage = parseInt($(id).css('top').slice(0, -1))
            			
		            	var newPositionPercentages = {
		            		left: ((leftPercentage / $('.chess-board').width()) * 100).toString() + '%',
		            		top: ((topPercentage / $('.chess-board').width()) * 100).toString() + '%'
		            	}

		            	expect(newPositionPercentages.left).to.equal(a3.left);
		            	expect(newPositionPercentages.top).to.equal(a3.top);
            			done();
            		}, 200)
            	})

            	$('#a2').mouseup()
            });

			it('should have id reassigned to correctly notated position when move is valid', function (done) {
            	$('#b2').css(
            		{
            			'left': '15%',
            			'top': '65%'
            		})

            	$('#b2').mouseup(function(){
            		var that = this;
            		setTimeout(function() {
            			var id = $(that).attr('id')

		            	expect(id).to.equal('b3');
            			done();
            		}, 200)
            	})

            	$('#b2').mouseup()
			})
        });
    });
})();
