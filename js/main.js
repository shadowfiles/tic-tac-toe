window.onload = function () {
	var game = new GameInterface();
	game.start();
}

var SPACE = {
						  EMPTY : {value: 0, className: ""}, 
						  O : {value: 1, className: "o"}, 
						  X : {value: 2, className: "x"}
						};

function GameInterface () {
	var self = this;
	var boxes = document.getElementById("board").getElementsByTagName("td");
	var game = new Game();

	this.clear = function () {
		for (var i = 0; i < boxes.length; i++) {
			boxes[i].className = SPACE.EMPTY.className;
		}
	}

	this.render = function () {
		for (var i = 0; i < boxes.length; i++) {
			boxes[i].className = game.get(getRow(i), getCol(i)).className;
		}
	}

	this.start = function () {
		for (var i = 0; i < boxes.length; i++) {
			boxes[i].setAttribute("index", i);
			boxes[i].onclick = function () {
				var i = this.getAttribute("index") * 1;
				game.move(getRow(i), getCol(i));
				self.render();
			}
		}
	}

	function getIndex (row, col) {
		return row * 3 + col;
	}

	function getCol (i) {
		return i % 3;
	}

	function getRow (i) {
		return Math.floor(i / 3);
	}
}

function Game () {
	var board = [[SPACE.EMPTY, SPACE.EMPTY, SPACE.EMPTY], 
 							 [SPACE.EMPTY, SPACE.EMPTY, SPACE.EMPTY], 
							 [SPACE.EMPTY, SPACE.EMPTY, SPACE.EMPTY]];

	this.get = function (row, col) {
		return board[row][col];
	}

	this.move = function (row, col) {
		if (board[row][col] == SPACE.EMPTY) {
			board[row][col] = SPACE.O;
			moveAI();
		}
	}

	function causesWin (player, row, col) {
		var rowCount = colCount = diagCount = rdiagCount = 0;
		if (board[row][col] == SPACE.EMPTY) {
			for (var i = 0; i < board.length; i++) {
				if (board[row][i] == player) rowCount++;
				if (board[i][col] == player) colCount++;
				if (board[i][i] == player) diagCount++;
				if (board[i][board.length - 1 - i] == player) rdiagCount++;
			}
		}

		return rowCount >= 2 || colCount >= 2 || (row == col && diagCount >= 2) 
						|| (row == (board.length - 1 - i) && rdiagCount >= 2);
	}

	function createsFork (player, row, col) {
		var rowCount = colCount = diagCount = 0;
		if (board[row][col] == SPACE.EMPTY) {
			for (var i = 0; i < board.length; i++) {
				if (board[row][i] == player) rowCount++;
				if (board[i][col] == player) colCount++;
				if (board[i][i] == player) diagCount++;
			}
		}

		return rowCount >= 2 || colCount >= 2 || diagCount >= 2;
	}

	function moveAI () {
		var ai = SPACE.X;
		var player = SPACE.O;
		var playerWins = false;
		var forkMade = false; 

		var lastEmpty = false; 
		for (var i = 0; i < board.length; i++) {
			for (var j = 0; j < board.length;  j++) {
				if (causesWin(ai, i, j)) {
					board[i][j] = ai;
					return;
				} else if (causesWin(player, i, j)) {
					playerWins = [i, j];
				} else if (createsFork(ai, i, j)) {
					forkMade = [i, j];
				} else if (board[i][j] == SPACE.EMPTY) {
					lastEmpty = [i, j];
				}
			}
		}
		if (playerWins) {
			board[playerWins[0]][playerWins[1]] = ai;
			return;
		}

		if (forkMade) {
			board[forkMade[0]][forkMade[1]] = ai;
			return;
		}

		if (lastEmpty) {
			board[lastEmpty[0]][lastEmpty[1]] = ai;
			return;
		}
	}

}