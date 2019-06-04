var tictactoe = {
    description: "plays tic-tac-toe",
    help: [
        "Usage",
        "",
        "ttt"
    ],
    async function(e) {
        let board = undefined;
        let playing = false;
        let winner = undefined;
        this.parent.terminal.writeln("Type 'play' to start a new game. 'quit' to exit.");
        this.parent.terminal.writeln("----");
        while (true) {
            var input = await this.parent.terminal.input();
            switch (input) {
                case "play":
                    if (!playing) {
                        // this.parent.terminal.writeln("New game:");
                        printHelpMessage(this.parent.terminal);
                        board = establishBoard();
                        playing = true;
                        winner = undefined;
                    } else {
                        this.parent.terminal.writeln("<a style='color:#ff5555'>Active game!</a>");
                    }
                    break;
                case "reset":
                    if (playing) {
                        // this.parent.terminal.writeln("New game:");
                        printHelpMessage(this.parent.terminal);
                        board = establishBoard();
                    }
                    break;
                case "help":
                    printHelpMessage(this.parent.terminal);
                    break;
                case "quit":
                    return;
                default:
                    if (playing) {
                        if (!isNaN(input) && !playMove(board, input, "X")) {
                            this.parent.terminal.writeln("<a style='color:#ff5555'>Invalid move!</a>");
                        } else {
                            AIPlay(board);
                            winner = getWinner(board);
                        }
                    }
            }
            if (playing) {
                if (winner !== undefined) {
                    this.parent.terminal.writeln("<a style='color:#50fa7b'>" + winner + " won!</a>");
                    playing = false;
                } else {
                    this.parent.terminal.writeln("<a style='color:#ffb86c'>Current board</a>");
                    printBoard(this.parent.terminal, board);
                }
            } else {
                this.parent.terminal.writeln("No active game! Type 'play' to start a new game.");
            }
        }        
    }
};


let winConds = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], 
                [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function establishBoard() {
    let board = [];
    for (let i = 0; i < 9; i++) {
        board.push(undefined);
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
    printBoard(term, helperBoard);
    term.writeln("The above board is your guide.");
    term.writeln("--------");
}

function printBoard(term, board) {
    let row = "";
    for (let i = 0; i < 9; i++) {
        if (i % 3 === 0) {
            term.writeln("<a style='color:#bd93f9'> -------------</a>");
            row += "<a style='color:#bd93f9'> | </a>";
        }
        row += (board[i] === undefined) ? " " : board[i];
        row += "<a style='color:#bd93f9'> | </a>";
        if (i === 2 || i === 5 || i === 8) {
            term.writeln(row);
            row = "";
        }
    }
    term.writeln("<a style='color:#bd93f9'  > -------------</a>");
}

function getWinner(board) {
    // Check the win conditions
    for (let i = 0; i < winConds.length; i++) {
        if (board[winConds[i][0]] === board[winConds[i][1]] 
                && board[winConds[i][1]] === board[winConds[i][2]]) {
            return board[winConds[i][0]];
        }
    }
    // Check if the board is full
    let counter = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== undefined) counter++;
    }
    if (counter === 9) return "Nobody";
    // No winner
    return undefined;
}

function playMove(board, move, player) {
    // Check if it's a proper move if it is, return true.
    // Otherwise return false
    if (board[move] === undefined && parseInt(move) >= 0 && parseInt(move) <= 9) {
        board[move] = player;
        return true;
    } else {
        return false;
    }
}

function AIPlay(board) {
    // Give this an actual AI TODO
    let counter = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== undefined) counter++;
    }
    if (counter === 9) return;
    while (!playMove(board, Math.floor(Math.random() * 8), "O"));
}

export default tictactoe;