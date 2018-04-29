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
            if (vector !== Vector) {
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
            this.left = pos.x;
            this.right = pos.x + size.x;
            this.top = pos.y;
            this.bottom = pos.y + size.y;

        }
        catch (e) {
            if (pos || size || speed !== new Vector()) {
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
            let XColl = false;
            let YColl = false;

            if ((this.pos.x + this.size.x > actor.pos.x) && (this.pos.x < actor.pos.x + actor.size.x)) {
                XColl = true
            }
            if ((this.pos.y + this.size.y > actor.pos.y) && (this.pos.y < actor.pos.y + actor.size.y)) {
                YColl = true;
            }

            if ((actor.pos.x === this.pos.x) && (actor.pos.y === this.pos.y )) {
                return false;
            }
            if (XColl && YColl) {
                return true;
            }
            return false;
        }
        catch (e) {
            if (actor === null || actor instanceof TypeError) {
                throw new Error('Можно использовать объект типа Actor');
            }
            return e;
        }
    }
}

class Level {
    constructor(arrayGrids = [], arrayActors = []) {
        this.grid = arrayGrids;
        this.actors = arrayActors;
        this.player = this.actors.find( function (item) {
            return item.type === 'player'
        });
        this.height = this.grid.length;
        this.width = this.height > 0 ?  Math.max(...arrayGrids.map(el => el.length)) : 0;
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished() {
        if (this.status !== null && this.finishDelay < 0) {
            return true
        } else if (this.status !== null && this.finishDelay > 0) {
            return false
        }
        return false
    }

    actorAt(newActor) {
        try {
            if ((newActor instanceof Actor) || !(newActor === undefined)) {
                for (let actor of this.actors) {
                    if (actor.isIntersect(newActor)) {
                        return actor;
                    } else {
                        return undefined;
                    }
                }
                return undefined;
                // return this.actors.find(actor => actor.isIntersect(newActor));
            } else {
                throw new Error("actor is not instanceof Actor or undefined");
            }
        } catch (Error) {
            return error.message;
        }
    }

    obstacleAt(pos, size) {
        if ( pos.x < 0 || pos.x >= this.width || pos.y < 0) {
            return "wall"
        }
        else if (pos.y >= this.width) {
            return "lava"
        }

        return undefined
    }

    removeActor(actor) {
        for (let i = 0; i < this.actors.length; i++) {
            let ind = this.actors.indexOf(this.actors[i]);
            if (actor === this.actors[i]) {
                this.actors.splice(ind, 1);
            }
        }
    }

    noMoreActors(str) {
        for (let i = 0; i < this.actors.length; i++) {
            if (str === this.actors[i]) {
                return false
            }

                return true
        }
        if (this.actors === null) {
            return true
        }
    }

    playerTouched(str, actor) {
        if (str === 'lava' || str === 'fireball') {
            this.status = 'lost';
        }
        for (let i = 0; i < this.actors.length; i++) {
           if (str === 'coin' && actor === this.actors[i]) {
               let ind = this.actors.indexOf(this.actors[i]);
               this.actors.splice(ind, 1)
           }
            /*if (this.actors.length = 0) {
                this.status = 'won';
            }*/
        }
    }
}

const grid = [
    [undefined, undefined],
    ['wall', 'wall']
];

function MyCoin(title) {
    this.type = 'coin';
    this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);
/*
level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
    console.log('Все монеты собраны');
    console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
    console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
    console.log('Пользователь столкнулся с шаровой молнией');
}*/