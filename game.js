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
            } else {
                throw new Error("vector is not instanceof Vector or undefined");
            }
        } catch (Error) {
            return error.message;
        }
    }
    get left() {
        return this.pos.x;
    }

    get top() {
        return this.pos.y;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y;
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
        let xLeft = Math.floor(pos.x);
        let xRight = Math.floor(pos.x + size.x);
        let yTop = Math.floor(pos.y);
        let yBottom = Math.floor(pos.y + size.y);

        if ( (xLeft < 0) || (xRight > this.width) || (yTop < 0) ) {
            return 'wall';
        }
        if (yBottom >= this.height) {
            return 'lava';
        }
        let x, y;
        for (x = xLeft; x <= xRight; x++) {
            for (y = yTop; y <= yBottom; y++) {
                if ( (this.grid[y][x] === 'wall') || (this.grid[y][x] === 'lava') ) {
                    return this.grid[y][x];
                }
            }
        }
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
    constructor(gridObjects = {}) {
        this.keysOfGrid = gridObjects;
    }
    actorFromSymbol(str) {
        if (str && this.keysOfGrid) {
            return this.keysOfGrid[str]
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
        let self = this;
        return arrayStrings.reduce(function(prev, row, Y) {
            [...row].forEach(function(c, X) {
                if (c) {
                    let Creator = self.actorFromSymbol(c);
                    if (Creator && typeof (Creator) === "function") {
                        let pos = new Vector(X, Y);
                        let maybeActor = new Creator(pos);
                        if (maybeActor instanceof Actor) {
                            prev.push(maybeActor);
                        }
                    }
                }
            });
            return prev;
        }, []);
    }

    parse (arrayStrings) {
        return new Level(this.createGrid(arrayStrings), this.createActors(arrayStrings));
    }
}

class Fireball  extends  Actor{
    constructor (pos = new Vector(0, 0), speed = new Vector(0, 0)) {
        super();
        this.pos = pos;
        this.speed = speed;
    }
    get type() {
        return 'fireball';
    }

    getNextPosition (num = 1) {
        if (this.speed.x === 0 && this.speed.y === 0) {
            return this.pos;
        }
        if (num) {
            return new Vector(this.pos.x += this.speed.x * num, this.pos.y += this.speed.y * num);
        }
        return new Vector(this.pos.x += this.speed.x, this.pos.y += this.speed.y);
    }

    handleObstacle () {
        this.speed.x = -this.speed.x;
        this.speed.y = -this.speed.y;
    }

    act(time, level) {
        let nextPosition = this.getNextPosition(time);
        if (level.obstacleAt(nextPosition, this.size)) {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    }
}

class HorizontalFireball extends Fireball {
    constructor(pos) {
        super();
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.speed = new Vector(2, 0);
    }
}

class VerticalFireball extends Fireball{
    constructor(pos) {
        super();
        this.pos = pos;
        this.size = new Vector(1,1);
        this.speed = new Vector(0,2);
    }
}

class FireRain extends Fireball{
    constructor(pos) {
        super();
        this.posRain = pos;
        this.size = new Vector(1,1);
        this.speed = new Vector(0,3);
    }

    handleObstacle() {
       this.pos = this.posRain
    }
}