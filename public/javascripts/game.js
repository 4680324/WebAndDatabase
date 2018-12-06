//global variable socket
var socket = new WebSocket("ws://localhost:3000");


var main = function(){ 
    "use strict";
    
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

        

    });

    $("#offerDrawButton").on("click", function(event) {
        console.log("you offered a draw");
    });


    /*
    * when a new pages opens on the socket (3000) do something on opening the page (1) and on recieving a message (2)
    */
    socket.onopen = function(){
        socket.send("Hello from the client!");
    };
    socket.onmessage = function(event){
        socket.send();
    };
};

$(document).ready(main);