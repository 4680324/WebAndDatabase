//importing some libraries to work with.
var express = require("express");
var http = require("http");     
var websocket = require("ws");

//declares port and routing.
var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");
var messages = require('./public/javascripts/messages');
var logic = require('./public/javascripts/logic');

app.use(indexRouter);
app.use(express.static(__dirname + "/public")); //makes the directory a static directory (more efficient to work with, also easier.)

var server = http.createServer(app); //creates the actual server
const wss = new websocket.Server({ server });

var waitingPlayer = null;
var currentGames = [];  //an array of all the games that are currently being played

//constructor for game
function Game(black, white) {
    this.black = black;
    this.white = white;
    this.black.game = this;
    this.white.game = this;
    this.black.color = 'black';
    this.white.color = 'white';
    this.board = new logic.BoardState();
    let game = this;

    //determines who won the game and sends the appropriate message to the players
    this.end = function(winner, loser){
        if (winner.readyState === 1) {
            winner.send(JSON.stringify(new messages.O_GAME_END(true)));
        }
        if (loser.readyState === 1) {
            loser.send(JSON.stringify(new messages.O_GAME_END(false)));
        }
        currentGames.splice(currentGames.indexOf(this));
    }

    this.handleGameMessage = function(thisPlayer, otherPlayer, message) {
        message = JSON.parse(message);
    
        if (message.type === messages.T_OFFER_DRAW) {
            otherPlayer.send(messages.S_OFFER_DRAW);
        }
    
        if (message.type === messages.T_MOVE && thisPlayer.current) {   //if a move is recieved and its that players turn
            move = message.move;
            if (game.board.checkMove(move.x, move.y, thisPlayer.color)) {
                game.board.move(move.x, move.y, thisPlayer.color);
                otherPlayer.send(new messages.O_MOVE(move, null)); // maybe change
                //gives the move to the other player
                thisPlayer.current = false;
                otherPlayer.current = true;

                let count = game.board.count();
                if (count.black + count.white === 64) {
                    if (count.black > 32) {
                        game.end(game.black, game.white);
                    } else { // when two players have the same number of stones white wins
                        game.end(game.white, game.black);
                    }
                }
            }
        }
    }

    this.black.onmessage = function(event) {
        game.handleGameMessage(game.black, game.white, event.data);
    }
    this.white.onmessage = function(event) {
        game.handleGameMessage(game.white, game.black, event.data);
    }
    this.black.onclose = function() {
        game.end(game.white, game.black);
    }
    this.white.onclose = function() {
        game.end(game.black, game.white);
    }

    this.black.send(JSON.stringify(new messages.O_GAME_START(this.white.name, 'black')));
    this.white.send(JSON.stringify(new messages.O_GAME_START(this.black.name, 'white')));

    this.black.send(JSON.stringify(new messages.O_MOVE(null)));
    this.black.current = true;

    currentGames.push(this);
}


/*The first player will have to wait, the second player then automatically joins the first player*/
function addPlayer(ws) {
    if (waitingPlayer === null) {
        waitingPlayer = ws;

        ws.onclose = function() {
            if (waitingPlayer === ws) {
                waitingPlayer = null;
            }
        }
    } else {
        new Game(waitingPlayer, ws);
        waitingPlayer = null;
    }
}

wss.on("connection", function(ws) {
    console.log("[LOG] someone connected");
    ws.game = null;
    ws.current = false;
    


    ws.onmessage = function(event) {
        console.log("[LOG] " + event.data);

        var message = JSON.parse(event.data);

        if (message.type === messages.T_GAME_START) {
            ws.name = message.name;
            addPlayer(ws);
            // ws.emit('other player name', message.name); //shows the other player the name of their opponent
        }
    }
});

server.listen(port);