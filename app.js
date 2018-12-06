var express = require("express");
var http = require("http");
var websocket = require("ws");

var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");
var messages = require('./public/javascripts/messages')

app.use(indexRouter)
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app)
const wss = new websocket.Server({ server });

var waitingPlayer = null
var currentGames = []

function handleGameMessage(thisPlayer, otherPlayer, game, message) {
    message = JSON.parse(message);

    if (message.type === messages.T_OFFER_DRAW) {
        otherPlayer.send(messages.S_OFFER_DRAW);
    }
}

function Game(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    player1.game = this;
    player2.game = this;

    this.end = function(){}

    player1.onmessage = function(message) {
        handleGameMessage(player1, player2, this, message);
    };
    player2.onmessage = function(message) {
        handleGameMessage(player2, player1, this, message);
    };
    player1.send(JSON.stringify(messages.O_GAME_START(player2.name)));
    player2.send(JSON.stringify(messages.O_GAME_START(player1.name)));
    player2.send(JSON.stringify(messages.O_MOVE(null)));
    currentGames.push(this);
}

function addPlayer(ws) {
    if (waitingPlayer === null) {
        waitingPlayer = ws;
    } else {
        new Game(ws, waitingPlayer);
        waitingPlayer = null;
    }
}

wss.on("connection", function(ws) {
    console.log("[LOG] someone connected");
    ws.game = null
    
    ws.onmessage = function(message) {
        console.log("[LOG] " + message);

        var message = JSON.parse(message);

        if (message.type === messages.T_GAME_START) {
            ws.name = message.name;
            addPlayer(ws);
        }
    };

    ws.onclose = function() {
        if (waitingPlayer === ws) {
            waitingPlayer = null
        }
        if (ws.game !== null) {
            ws.game.end();
        }
    }
});

server.listen(port);