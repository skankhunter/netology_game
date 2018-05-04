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

    actorAt(obj) {
        if (!(obj instanceof(Actor)) || obj === undefined) {
            throw new Error('actor is not instanceof Actor or undefined')
        }
        if (this.actors === undefined) {
            return undefined;
        }
        for (const actor of this.actors) {
            if (actor.isIntersect(obj)) {
                return actor;
            }
        }
        return undefined;
    }
    obstacleAt(pos, size) {
        if (!(pos instanceof(Vector)) || !(size instanceof(Vector))) {
            throw new Error("position or size is not instanceof Vector")
        }
        let actor = new Actor(pos, size);
        if (actor.top < 0 || actor.left < 0 || actor.right > this.width) {
            return 'wall';
        }
        if (actor.bottom > this.height) {
            return 'lava';
        }
        for (let col = Math.floor(actor.top); col < Math.ceil(actor.bottom); col++) {
            for (let row = Math.floor(actor.left); row < Math.ceil(actor.right); row++) {
                if (this.grid[col][row] !== undefined) {
                    return this.grid[col][row];
                }
            }
        }
        return undefined;
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
        this.size = new Vector(1, 1);
        this.speed = new Vector(0, 3);
    }

    handleObstacle() {
       this.pos = this.posRain
    }
}

class Coin extends Actor{
    constructor(pos = new Vector(0, 0)) {
        super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
        this.size = new Vector(0.6, 0.6);
        this.startPos = this.pos;
        this.spring = Math.random() * (Math.PI * 2);
        this.springSpeed = 8;
        this.springDist = 0.07;
    }
    get type () {
        return 'coin'
    }

    updateSpring (time = 1) {
        this.spring += this.springSpeed * time;
    }

    getSpringVector () {
        return new Vector (0, Math.sin(this.spring) * this.springDist);
    }

    getNextPosition (time = 1) {
        this.updateSpring(time);
        return this.startPos.plus(this.getSpringVector());
    }

    act (time = 1) {
        this.pos = this.getNextPosition(time);
    }
}

class Player extends Actor{
    constructor(pos = new Vector(0,0)) {
        super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
        this.speed = new Vector(0, 0);
    }
    get type() {
        return 'player'
    }
}