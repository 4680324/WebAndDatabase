var main = function(){
"use strict";

    $("#Stranger button").on("click", function (event) {
        console.log("connecting to stranger!");
        

    });

    $("#Friend button").on("click", function(event) {
        console.log("generating custom url");
    });

    
};

$(document).ready(main);