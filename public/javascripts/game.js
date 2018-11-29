var main = function(){   //this is the main
    "use strict";
    
        $("div.row>div").on("click", function (event) {
            console.log("div click");
        });
    
        $("#resignButton").on("click", function(event) {
            console.log("you resigned!");
        });
    
        $("#offerDrawButton").on("click", function(event) {
            console.log("you offered a draw");
        });
    };

$(document).ready(main);