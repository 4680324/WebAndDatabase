(function(exports){

    /* 
     * Server to client: game is complete, the winner is ... 
     */       
    exports.T_GAME_END = "GAME-END"
    exports.O_GAME_END = {
        type: exports.T_GAME_END,
        winner: null
    };

    /*
     * Server to client: game has started
     */
    exports.T_GAME_START = "GAME-START";
    exports.O_GAME_START = {
        type: exports.T_GAME_START,
        opponent: null
    };

    /*
     * Any to any: offer draw
     */
    exports.T_OFFER_DRAW = "OFFER-DRAW";
    exports.O_OFFER_DRAW = {
        type: exports.T_OFFER_DRAW,
    };
    exports.S_OFFER_DRAW = JSON.stringify(exports.O_OFFER_DRAW);

    /* 
     * Any to any: make move
     */
    exports.T_MOVE = "MOVE";
    exports.O_MOVE = {
        type: exports.T_MOVE,
        move: null
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_MOVE);
  
}(typeof exports === 'undefined' ? this.utilities = {} : exports));