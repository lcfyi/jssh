const ttt = {
  description: "plays tic-tac-toe",
  help: ["Usage", "", "ttt"],
  async function() {
    let board = null;
    let playing = false;
    let winner = null;
    this.terminal.writeln("Type 'play' to start a new game. 'quit' to exit.");
    this.terminal.writeln("----");
    while (true) {
      let input = await this.terminal.input();
      switch (input) {
        case "play":
          if (!playing) {
            // this.terminal.writeln("New game:");
            printHelpMessage(this.terminal);
            board = establishBoard();
            playing = true;
            winner = null;
          } else {
            this.terminal.writeln(
              "<a style='color:#ff5555'>Active game!</a>",
              true
            );
          }
          break;
        case "reset":
          if (playing) {
            // this.terminal.writeln("New game:");
            printHelpMessage(this.terminal);
            board = establishBoard();
          }
          break;
        case "help":
          printHelpMessage(this.terminal);
          break;
        case "quit":
          return;
        default:
          if (playing) {
            if (!isNaN(input) && !playMove(board, input, "X")) {
              this.terminal.writeln(
                "<a style='color:#ff5555'>Invalid move!</a>",
                true
              );
            } else {
              aiPlay(board);
              winner = getWinner(board);
            }
          }
      }
      if (playing) {
        if (winner) {
          this.terminal.writeln(
            "<a style='color:#50fa7b'>" + winner.player + " won!</a>",
            true
          );
          playing = false;
          printBoard(this.terminal, board, winner.condition);
        } else {
          this.terminal.writeln(
            "<a style='color:#ffb86c'>Current board</a>",
            true
          );
          printBoard(this.terminal, board, null);
        }
      } else {
        this.terminal.writeln(
          "No active game! Type 'play' to start a new game."
        );
      }
    }
  }
};

let winConds = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function establishBoard() {
  let board = [];
  for (let i = 0; i < 9; i++) {
    board.push(null);
  }
  return board;
}

function printHelpMessage(term) {
  term.writeln("--------");
  term.writeln("Use number 0-9 to play a move.");
  let helperBoard = [];
  for (let i = 0; i < 9; i++) {
    helperBoard.push(i);
  }
  printBoard(term, helperBoard, null);
  term.writeln("The above board is your guide.");
  term.writeln("--------");
}

function printBoard(term, board, winnerCondition) {
  let row = "";
  for (let i = 0; i < 9; i++) {
    if (i % 3 === 0) {
      term.writeln("<a style='color:#bd93f9'> -------------</a>", true);
      row += "<a style='color:#bd93f9'> | </a>";
    }
    // Beacause we have a 0 value for this check
    if (!winnerCondition) {
      row += board[i] === null ? " " : board[i];
    } else {
      row += board[i] === null ? " " : (winnerCondition.includes(i) ? `<a style='color:#50fa7b'>${board[i]}</a>` : board[i]);
    }
    row += "<a style='color:#bd93f9'> | </a>";
    if (i === 2 || i === 5 || i === 8) {
      term.writeln(row, true);
      row = "";
    }
  }
  term.writeln("<a style='color:#bd93f9'  > -------------</a>", true);
}

function getWinner(board) {
  // Check the win conditions
  for (let i = 0; i < winConds.length; i++) {
    if ( 
      board[winConds[i][0]] !== null &&
      board[winConds[i][0]] === board[winConds[i][1]] &&
      board[winConds[i][1]] === board[winConds[i][2]]
    ) {
      return {player: board[winConds[i][0]], condition: winConds[i]};
    }
  }
  // Check if the board is full
  let counter = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i]) {
      counter++;
    }
  }
  if (counter === 9) {
    return {player: "Nobody", condition: null};
  }
  // No winner
  return null;
}

function playMove(board, move, player) {
  // Check if it's a proper move if it is, return true.
  // Otherwise return false
  if (!board[move] && parseInt(move) >= 0 && parseInt(move) < 9) {
    board[move] = player;
    return true;
  } else {
    return false;
  }
}

function aiPlay(board) {
  let counter = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i]) counter++;
  }
  if (counter === 9) {
    return;
  }

  playMove(board, minimax(board, "O", 1).index, "O");
}

// Recursively searches entire state space assuming optimal moves,
// with terminal conditions providing final score values which roll back
function minimax (board, player, currentDepth) {

  // Terminal conditions for recursive calls
  let winnerInfo = getWinner(board);
  if (winnerInfo) {
    switch (winnerInfo.player) {
      case "O": 
        return {score: 10, depth: currentDepth};

      case "X":
        return {score: -10, depth: currentDepth};

      case "Nobody":
        return {score: 0, depth: currentDepth};

      default:
        break;
    }
  } 

  // Store information for all valid moves
  let moves = [];

  // Check the effects of all available moves recursively, 
  // (relatively) small finite state space makes it easy
  for (let i = 0; i < 9; i++) { 
    if (!board[i]) { 
      let updatedBoard = [...board];
      updatedBoard[i] = player; 
      let opponent = player === "O" ? "X" : "O";
      let resultInfo = minimax(updatedBoard, opponent, currentDepth + 1); 
      moves.push({index: i, score: resultInfo.score, depth: resultInfo.depth});
    }
  }

  // At top level, decide shortest path to victory
  if (currentDepth == 1) {
    let winMoves = moves.filter((move) => { return move.score > 0; });
    if (winMoves.length > 0) {
      let retMove = winMoves.reduce((a, b) => a.depth < b.depth ? a : b);
      return retMove;
    } 
  }
  
  // AI Player stores largest values (ideally +ve), Human player stores smallest values (ideally -ve)
  return player === "O" ? moves.reduce((a, b) => a.score > b.score ? a : b) : moves.reduce((a, b) => a.score < b.score ? a : b);
}

export default ttt;
