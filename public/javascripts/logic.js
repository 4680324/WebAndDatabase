(function(exports){

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
    exports.BoardState = function() {
        this.state = [{},{},{},{},{},{},{},{}];
        this.moveInfluence = function(x, y, color) {
            let influence = [];

            exports.directions.forEach(delta => {
                let pos = {x: x + delta.x, y: y + delta.y};
                let line = [];

                while ( 0 <= pos.x < 8 && 0 <= pos.y < 8) {
                    if (!this.state[pos.x][pos.y]) {
                        break;
                    } else if (this.state[pos.x][pos.y] === color) {
                        influence.concat(line);
                        break; 
                    }

                    line.push(pos);
                    pos.x += delta.x;
                    pos.y += delta.y;
                }
            });
            return influence;
        }
        this.checkMove = function(x, y, color) {
            if (!this.state[x][y]) {
                return this.moveInfluence(x, y, color).length > 0;
            }
            return false;
        }
        this.move = function(x, y, color) {
            this.state[x][y] = color;
            let influence = this.moveInfluence(x, y, color);
            influence.forEach(pos => {
                this.state[pos.x][pos.y] = color;
            });
        }
        this.count = function() {
            let black = 0;
            let white = 0;

            this.state.forEach(line => {
                Object.values(line).forEach(pos => {
                    if (pos === 'black') {
                        black += 1;
                    } else if (pos === 'white') {
                        white += 1;
                    }
                });
            });
            return {black: black, white: white};
        }
    }

}(typeof exports === 'undefined' ? this.messages = {} : exports));