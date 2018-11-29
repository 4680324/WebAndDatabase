var main = function(){   //this is the main
    "use strict";
    
        $("div.row>div").on("click", function (event) {
            console.log(event.target);
            var node = event.target;
            for (var column=0; (node=node.previousSibling); column++);
            var parent = event.target.parentNode;
            for (var row=0; (parent=parent.previousSibling); row++);
            row = (row + 1) / 2;
            console.log("column: %s, row %s: div click", column, row);
        });
    
        $("#resignButton").on("click", function(event) {
            console.log("you resigned!");
        });
    
        $("#offerDrawButton").on("click", function(event) {
            console.log("you offered a draw");
        });
    };

$(document).ready(main);