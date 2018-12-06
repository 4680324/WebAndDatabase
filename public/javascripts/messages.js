(function(exports){

    /* 
     * Server to client: game is complete, the winner is ... 
     */       
    exports.T_GAME_END = "GAME-END"
    exports.O_GAME_END = function(winner) {
        this.type = exports.T_GAME_END;
        this.winner = null;
    };

    /*
     * Any to any: game has started
     */
    exports.T_GAME_START = "GAME-START";
    exports.O_GAME_START = function(name) {
        this.type = exports.T_GAME_START;
        this.name = name;
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
    exports.O_MOVE = function(move) {
        this.type = exports.T_MOVE;
        this.move = move;
    };
  
}(typeof exports === 'undefined' ? this.messages = {} : exports));