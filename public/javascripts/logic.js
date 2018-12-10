(function (exports) {

    exports.directions = [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1},
        {x:-1, y: 1},
        {x:-1, y: 0},
        {x:-1, y:-1},
        {x: 0, y:-1},
        {x: 1, y:-1},
    ]

    /* 
     * The BoardState object
     */       
    exports.BoardState = function () {
        this.state = {
            1: {}, 2: {}, 3: {},
            4: {4: 'black', 5: 'white'},
            5: {4: 'white', 5: 'black'},
            6: {}, 7: {}, 8: {}
        };
        board = this;

        this.moveInfluence = function (x, y, color) {
            let influence = [];

            exports.directions.forEach(function (delta) {
                let pos = {
                    x: x + delta.x,
                    y: y + delta.y
                };
                let line = [];

                while (0 < pos.x && pos.x <= 8 && 0 < pos.y && pos.y <= 8) {
                    if (!board.state[pos.x][pos.y]) {
                        return;
                    } else if (board.state[pos.x][pos.y] === color) {
                        influence = influence.concat(line);
                        return;
                    }

                    line.push({
                        x: pos.x,
                        y: pos.y
                    });
                    pos.x += delta.x;
                    pos.y += delta.y;
                }
            });
            return influence;
        }
        this.checkMove = function (x, y, color) {
            if (!board.state[x][y]) {
                return board.moveInfluence(x, y, color).length > 0;
            }
            return false;
        }
        this.move = function (x, y, color) {
            board.state[x][y] = color;
            let influence = board.moveInfluence(x, y, color);
            influence.forEach(pos => {
                board.state[pos.x][pos.y] = color;
            });
        }
        this.count = function () {
            let black = 0;
            let white = 0;

            Object.values(board.state).forEach(line => {
                Object.values(line).forEach(pos => {
                    if (pos === 'black') {
                        black += 1;
                    } else if (pos === 'white') {
                        white += 1;
                    }
                });
            });
            return {
                black: black,
                white: white
            };
        }
    }

}(typeof exports === 'undefined' ? this.logic = {} : exports));