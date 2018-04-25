'use strict';
class Vector {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus (vector) {
        try {
            return new Vector(this.x + vector.x, this.y + vector.y);
        } catch (e) {
            if (vector instanceof TypeError) {
                throw new Error('Можно прибавлять к вектору только вектор типа Vector');
            }
            return e;
            }
        }

    times (num) {
        return new Vector(this.x * num, this.y * num);
    }
}


class  Actor {
    constructor (pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)) {
        try {
            this.pos = pos;
            this.size = size;
            this.speed = speed;
            /*this.left =;
            this.right =;
            this.top =;
            this.bottom =;
           */


           // Object.defineProperty(Actor, this.type, { value: "actor", configurable: false, writable: false, enumerable: true });
            }
        catch (e) {
            if (pos || size || speed instanceof TypeError) {
                throw new Error('Можно использовать объект типа Vector');
            }
            return e;
        }
    }
    get type() {
        return 'actor';
    }
    act() {

    };

    isIntersect(actor) {
        try {

        }
        catch (e) {
            if (actor === null || actor instanceof TypeError) {
                throw new Error('Можно использовать объект типа Actor');
            }
            return e;
        }
    }
}

const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
    return ['left', 'top', 'right', 'bottom']
        .map(side => `${side}: ${item[side]}`)
        .join(', ');
}

function movePlayer(x, y) {
    player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
    console.log(`${title}: ${position(item)}`);
    if (player.isIntersect(item)) {
        console.log(`Игрок подобрал ${title}`);
    }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);