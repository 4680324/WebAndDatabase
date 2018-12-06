var express = require("express");
var http = require("http");
var websocket = require("ws");

var port = process.argv[2];
var app = express();

var indexRouter = require("./routes/index");

app.use(indexRouter)
app.use(express.static(__dirname + "/public"));

var server = http.createServer(app)
const wss = new websocket.Server({ server });

wss.on("connection", function(ws) {
    console.log("[LOG] someone connected");
    
    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message);
    });
});

server.listen(port);