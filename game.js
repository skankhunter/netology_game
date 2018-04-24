'use strict';
class Vector {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus (vector) {
        try {
        let newVector = {
            x : this.x + vector.x,
            y : this.y + vector.y
        };
            return newVector
        } catch (e) {
            if (vector instanceof TypeError) {
                throw new Error('Можно прибавлять к вектору только вектор типа Vector');
            }
            return e;
            }
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
    constructor (position = {x : 0, y : 0}, size = {a : 0, b : 0}, speed = {x : 0, y : 0}) {
        try {

            }
        catch (e) {
            if (position === null || size === null || speed === null ) {
                console.log(e.name + ': ' + e.message);
                console.log(`Можно передавать только вектор типа Vector`);
            }
        }
    }
}