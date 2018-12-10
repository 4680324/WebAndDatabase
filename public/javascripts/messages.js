(function (exports) {

    /* 
     * Server to client: game is complete, the winner is ... 
     */
    exports.T_GAME_END = "GAME-END"
    exports.O_GAME_END = function (winner) {
        this.type = exports.T_GAME_END;
        this.winner = winner; // this is true if the player is the winner, false otherwise
    };

    /*
     * Any to any: game has started
     */
    exports.T_GAME_START = "GAME-START";
    exports.O_GAME_START = function (name, color) {
        this.type = exports.T_GAME_START;
        this.name = name; // this is the string name, of course not sanitized or verified :P
        this.color = color;
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
    exports.O_MOVE = function (move, updates) {
        this.type = exports.T_MOVE;
        this.move = move; // this is an object with (x, y) of the moves location
        this.updates = updates; // this is a list of location-value objects
    };

    /* 
     * Any to any: chat message
     */
    exports.T_CHAT = "CHAT";
    exports.O_CHAT = function (message) {
        this.type = exports.T_CHAT;
        this.message = message;
    };

}(typeof exports === 'undefined' ? this.messages = {} : exports));