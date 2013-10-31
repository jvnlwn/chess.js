GameRouter = Backbone.Router.extend({

	routes: {
		'game'    : 'setup',
		'game/:id': 'newGame'
	},

	setup: function() {
		var rootRef = new Firebase('https://chess-js.firebaseio.com/')
		var gameRef = rootRef.child('game')

		var that = this;
		gameRef.once('child_added', function(dataSnapshot) {
			var id = dataSnapshot.bc.path.m[1]
			that.navigate("game/" + id, {trigger: true});
		})

		gameRef.push({game: Math.floor(Math.random()* 1000000)})
	},

	newGame: function(id) {
		var firebase = 'https://chess-js.firebaseio.com/game/' + id;
		this.whitePieces = new PiecesSet([], {firebase: firebase + '/white-pieces'})
		this.blackPieces = new PiecesSet([], {firebase: firebase + '/black-pieces'})
		chess.utilities.newGame();
	}
})

gameRouter = new GameRouter();

Backbone.history.start()