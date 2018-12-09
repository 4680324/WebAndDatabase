//basically setting up the server.
var express = require("express");
var http = require("http");     
var websocket = require("ws");

var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");
var messages = require('./public/javascripts/messages')
var logic = require('./public/javascripts/logic')

app.use(indexRouter);
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app)
const wss = new websocket.Server({ server });

var waitingPlayer = null
var currentGames = []

function Game(black, white) {
    this.black = black;
    this.white = white;
    this.black.game = this;
    this.white.game = this;
    this.black.color = 'black';
    this.white.color = 'white';
    this.board = new logic.BoardState();

    this.end = function(winner, loser){
        if (winner.readyState === 1) {
            winner.send(new JSON.stringify(messages.O_GAME_END(true)));
        }
        if (loser.readyState === 1) {
            loser.send(new JSON.stringify(messages.O_GAME_END(false)));
        }
        currentGames.splice(currentGames.indexOf(this));
    }

    this.handleGameMessage = function(thisPlayer, otherPlayer, message) {
        message = JSON.parse(message);
    
        if (message.type === messages.T_OFFER_DRAW) {
            otherPlayer.send(messages.S_OFFER_DRAW);
        }
    
        if (message.type === messages.T_MOVE && thisPlayer.current) {
            move = message.move;
            if (this.board.checkMove(move.x, move.y, thisPlayer.color)) {
                this.board.move(move.x, move.y, thisPlayer.color);
                otherPlayer.send(new messages.O_MOVE(move, null));
                thisPlayer.current = false;
                otherPlayer.current = true;
            }
        }
    }

    this.black.onmessage = function(event) {
        handleGameMessage(this.black, this.white, event.data);
    }
    this.white.onmessage = function(event) {
        handleGameMessage(this.white, this.black, event.data);
    }
    this.black.onclose = function() {
        this.end(this.white, this.black);
    }
    this.white.onclose = function() {
        this.end(this.black, this.white);
    }

    this.black.send(JSON.stringify(new messages.O_GAME_START(this.white.name, 'black')));
    this.white.send(JSON.stringify(new messages.O_GAME_START(this.black.name, 'white')));

    this.black.send(JSON.stringify(new messages.O_MOVE(null)));
    this.black.current = true;

    currentGames.push(this);
}

function addPlayer(ws) {
    if (waitingPlayer === null) {
        waitingPlayer = ws;

        ws.onclose = function() {
            if (waitingPlayer === ws) {
                waitingPlayer = null
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