//basically setting up the server.
var express = require("express");
var http = require("http");     
var websocket = require("ws");

var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");
var messages = require('./public/javascripts/messages')

app.use(indexRouter);
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app)
const wss = new websocket.Server({ server });

var waitingPlayer = null
var currentGames = []

function handleGameMessage(thisPlayer, otherPlayer, message) {
    message = JSON.parse(message);

    if (message.type === messages.T_OFFER_DRAW) {
        otherPlayer.send(messages.S_OFFER_DRAW);
    }

    if (message.type === messages.T_MOVE && thisPlayer.current) {
        thisPlayer.game.move()
    }
}

function Game(black, white) {
    this.black = black;
    this.white = white;
    this.black.game = this;
    this.white.game = this;

    this.end = function(winner, loser){
        if (winner.readyState === 1) {
            winner.send(JSON.stringify(messages.O_GAME_END(true)));
        }
        if (loser.readyState === 1) {
            loser.send(JSON.stringify(messages.O_GAME_END(false)));
        }
    }

    this.black.onmessage = function(message) {
        handleGameMessage(this.black, this.white, message);
    }
    this.white.onmessage = function(message) {
        handleGameMessage(this.white, this.black, message);
    }
    this.black.onclose = function() {
        this.end(this.white, this.black);
    }
    this.white.onclose = function() {
        this.end(this.black, this.white);
    }

    this.black.send(JSON.stringify(messages.O_GAME_START(this.white.name)));
    this.white.send(JSON.stringify(messages.O_GAME_START(this.black.name)));

    this.black.send(JSON.stringify(messages.O_MOVE(null)));

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
    


    ws.onmessage = function(message) {
        console.log("[LOG] " + message);

        var message = JSON.parse(message);

        if (message.type === messages.T_GAME_START) {
            ws.name = message.name;
            addPlayer(ws);
            ws.emit('other player name', message.name); //shows the other player the name of their opponent
        }
        
    }
});

server.listen(port);