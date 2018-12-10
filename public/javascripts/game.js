//global variable socket
var socket = new WebSocket("ws://localhost");
var color = null;
var board = new logic.BoardState(); //creates begin state
var current = false;
var opponent = null;
var user = null;

function send_message(){ //used to get the info from the chatbox and send it as a JSON to the server
    var payload = new messages.O_CHAT($('#send_message_holder').val()); //take the value from the chatbox
    $('#send_message_holder').val("");

    $('#messages').append('<p><b>'+user+' says:</b> '+payload.message+'</p>');

    console.log("*** Client Log Message: \" send_message \" payload: " + JSON.stringify(payload));
    socket.send(JSON.stringify(payload));
}

var main = function () {
    "use strict";

    socket.onopen = function () { //when opening a connection, send a message with the name of the connecting party to the server.
        // socket.send("Hello from the client!");

        user = prompt("Please enter your name");

        if (user == "") {
            user = 'verlegen man';
        }
        
        var startGame = new messages.O_GAME_START(user, null);
        socket.send(JSON.stringify(startGame));
        $('#Name1').text(user); //show own name in the name tag in html
        update_interface(); //makes sure the classes get initialized.
    };

    socket.onmessage = function (event) {
        let mess = JSON.parse(event.data);
        if (mess.type === messages.T_GAME_START) {
            color = mess.color;
            //show name to the opponents tag in html
            $("#Name2").text(mess.name);
            opponent = mess.name;
        }

        if (mess.type === messages.T_MOVE) {
            current = true;

            let move = mess.move;
            if (move === null) {
                return;
            }

            let notColor = null;
            if (color === "white") {
                notColor = "black";
            } else {
                notColor = "white";
            }

            board.move(move.x, move.y, notColor);
            update_interface();
            current = true;
        }

        if (mess.type === messages.T_GAME_END) {
            if (mess.winner) {
                alert("you win");
            } else {
                alert("you lose");
            }
        }

        if(mess.type === messages.T_CHAT){
        $('#messages').append('<p><b>'+opponent+' says:</b> '+mess.message+'</p>');
        }
    };

    var update_interface = function () {
        Object.entries(board.state).forEach(line => {
            Object.entries(line[1]).forEach(pos => {
                let node = $('#' + pos[0] + '_' + line[0])
                if (pos[1] === 'black') {
                    node.removeClass();
                    node.addClass("active-Black");
                } else if (pos[1] === 'white') {
                    node.removeClass();
                    node.addClass("active-White");
                }
            });
        });
    };

    $("td").on("click", function (event) {
        if (!current) {
            return;
        }
        var node = event.target;
        for (var column = 0;
            (node = node.previousSibling); column++);
        column = (column + 1) / 2;
        var parent = event.target.parentNode;
        for (var row = 0;
            (parent = parent.previousSibling); row++);
        row = row / 2 + 1;
        console.log("column %s, row %s", column, row);
        if (board.checkMove(column, row, color)) {
            var move = new messages.O_MOVE({
                x: column,
                y: row
            }, null);
            socket.send(JSON.stringify(move));
            board.move(column, row, color);
            update_interface();
            current = false;
        }
    });

    //send a JSON file to the server which gives a resign message
    $("#resignButton").on("click", function (event) {
        console.log("you resigned!");
        socket.close();

        $(".chat").attr("value", "You resigned, feelsbadman")
    });

    $("#offerDrawButton").on("click", function (event) {
        console.log("you offered a draw");
    });

};

$(document).ready(main);