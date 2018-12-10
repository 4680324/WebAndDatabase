//global variable socket
var socket = new WebSocket("ws://localhost");
var color = null;
var board = new logic.BoardState(); //creates begin state

var main = function(){ 
    "use strict";
	
	function send_message(){ //used to get the info from the chatbox and send it as a JSON to the server
		var payload = {};
		payload.message = $('#send_message_holder').val(); //take the value from the chatbox
		$('#send_message_holder').val("");

		console.log("*** Client Log Message: \" send_message \" payload: " + JSON.stringify(payload));
		socket.emit('send_message', payload);
	}

    socket.onopen = function(){ //when opening a connection, send a message with the name of the connecting party to the server.
        // socket.send("Hello from the client!");
        
        var user = prompt("Please enter your name");

        if(user !== ""){
            var startGame = new messages.O_GAME_START(user, null);
            socket.send(JSON.stringify(startGame));
            //show own name in the name tag in html
            

            $("#Name1").text(user);

        }else{
            var startGame = new messages.O_GAME_START('verlegen man', null);
            socket.send(JSON.stringify(startGame));

            $('#Name1').text('verlegen man');
        }
        update_interface(); //makes sure the classes get initialized.
    };

    socket.onmessage = function(event){
        var mess = JSON.parse(event.data);
        if(mess.type === messages.T_GAME_START){
            color = mess.color;
            //show name to the opponents tag in html
            $("#Name2").text(mess.name);
        }

        if(mess.type === messages.T_MOVE){
            move = mess.move;
            update = mess.update;

            var notColor = null;

            if(color === "white"){
                notColor = "black";
            }else{
                notColor = "white";
            }

            board.move(move.x, move.y, notColor);
            update_interface();
        }

        socket.send();
    };

    var update_interface = function(){
        Object.values(this.state).forEach(line => {
            Object.values(line).forEach(pos => {
                if (pos === 'black') {
                    $(/*==>desbetreffende tb */).removeClass();  //have to change selector!!
                    pos.addClass("active-Black");
                } else if (pos === 'white') {       
                    $(".tabs span").removeClass();  //have to change selector!!
                    pos.addClass("active-White");
                }
            });
        });
        return {black: black, white: white};
    };

    $("td").on("click", function (event) {
        var node = event.target;
        for (var column=0; (node=node.previousSibling); column++);
        column = (column + 1) / 2;
        var parent = event.target.parentNode;
        for (var row=0; (parent=parent.previousSibling); row++);
        row = row / 2 + 1;
        console.log("column %s, row %s", column, row);
        if(board.checkMove){
            var move = new messages.O_MOVE({x:column, y:row}, null);
            socket.send(JSON.stringify(move));
            board.move(column, row, color);
            update_interface();
        }
    });

    //send a JSON file to the server which gives a resign message
    $("#resignButton").on("click", function(event) {
        console.log("you resigned!");
        socket.close();

        $(".chat").attr("value", "You resigned, feelsbadman")
    });

    $("#offerDrawButton").on("click", function(event) {
        console.log("you offered a draw");
    });

};

$(document).ready(main);