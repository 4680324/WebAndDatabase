var main = function(){   //this is the main
"use strict";

    $(".Stranger button").on("click", function (event) {
        console.log("dit werkt 1");
    });

    $(".Friend button").on("click", function(event) {
        console.log("Dit werkt niet lol");
    });

    
};

$(document).ready(main);