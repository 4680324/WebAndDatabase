//global variable socket
var socket = new WebSocket("ws://localhost");


var main = function(){ 
    "use strict";

    socket.onopen = function(){ //when opening a connection, send a message with the name of the connecting party to the server.
        socket.send("Hello from the client!");

        var user = prompt("Please enter your name");

        if(user !== ""){
            socket.send(JSON.stringify(messages.O_GAME_START(user)));   //send a msg to the server with the name of the player
            $("aside #Name1").append(user);            //show own name in the name tag in html

            socket.on('other player name', function(msg){   //show opponent name in name tag
                $('aside #Name2').append(msg);
            });

            

        }else{
            console.log("disconnect!");
         //   returntosplash();
        }
    };

    socket.onmessage = function(event){
        var mess = JSON.parse(event);
        if(mess.type === messages.T_GAME_START){
            //show name to the opponents tag in html

            var $opponentName;

        }
        socket.send();
    };

    var returnToSplash = function(){

    };


    $("div.row>div").on("click", function (event) {
        var node = event.target;
        for (var column=0; (node=node.previousSibling); column++);
        var parent = event.target.parentNode;
        for (var row=0; (parent=parent.previousSibling); row++);
        row = (row + 1) / 2;
        console.log("column %s, row %s", column, row);
    });

    //send a JSON file to the server which gives a resign message
    $("#resignButton").on("click", function(event) {
        console.log("you resigned!");
        socket.send("played disconnected");
        socket.close();

        $(".chat").attr("value", "You resigned, feelsbadman")
    });

    $("#offerDrawButton").on("click", function(event) {
        console.log("you offered a draw");
    });

};

$(document).ready(main);