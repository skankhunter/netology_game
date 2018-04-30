'use strict';
class Vector {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus (vector) {
        try {
            if (vector instanceof Vector) {
                return new Vector(this.x + vector.x, this.y + vector.y);
            } else {
                throw new Error("vector is not instanceof Vector or undefined");
            }
        } catch (Error) {
            return error.message;
        }
    }

    times (num) {
        return new Vector(this.x * num, this.y * num);
    }
}


class  Actor {
    constructor (pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)) {
        try {
            if ((pos instanceof Vector) && (size instanceof Vector) && (speed instanceof Vector)) {
                this.pos = pos;
                this.size = size;
                this.speed = speed;
                this.left = pos.x;
                this.right = pos.x + size.x;
                this.top = pos.y;
                this.bottom = pos.y + size.y;
            } else {
                throw new Error("vector is not instanceof Vector or undefined");
            }
        } catch (Error) {
            return error.message;
        }
    }
    get type() {
        return 'actor';
    }
    act() {

    };

    isIntersect(actor) {
        try {
            if ((actor instanceof Actor) || !(actor === undefined)) {
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
            else {
                throw new Error("actor is not instanceof Actor or undefined");
            }

        }
        catch (Error) {
            return error.message;
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

    actorAt(actor) {
        try {
            if ((actor instanceof Actor) || !(actor === undefined)) {
                for (let item of this.actors) {
                    if (item.isIntersect(actor)) {
                        return item;
                    } else {
                        return undefined;
                    }
                }
                return undefined;
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
            if (str === this.actors[i].type) {
                return false
            }
                return true
        }
        if (this.actors.length === 0) {
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
            if (this.actors.length === 0) {
                this.status = 'won';
            }
        }
    }
}

class LevelParser {
    constructor(gridObjects = []) {
        this.obj = gridObjects;
    }
    actorFromSymbol(str) {
        if (str) {

        }
        return undefined
    }

    obstacleFromSymbol (str) {
        if (str === 'x') {
            return "wall"
        }
        if (str === '!') {
            return "lava"
        }
        return undefined
    }

    createGrid (arrayStrings) {
        if (arrayStrings.length === 0) {
            return [];
        }

        return arrayStrings.map(str => str.split('').map(symb => this.obstacleFromSymbol(symb)));

    }

    createActors(arrayStrings) {
        if (arrayStrings.length === 0) {
            return [];
        }
    }
}