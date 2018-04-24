'use strict';
class Vector {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus (vector) {
        try {
            vector;
        } catch (e) {
            if (e instanceof TypeError) {
                console.log(e.name + ': ' + e.message);
                console.log(`Можно прибавлять к вектору только вектор типа Vector`);
            }
        }
        let newVector = {
            x : this.x + vector.x,
            y : this.y + vector.y
        };
        return newVector
    }

    times (num) {
        let newVector = {
            x : this.x * num,
            y : this.y * num
        };
        return newVector
    }
}

class  Actor {
    constructor (position, size, speed) {

    }
}