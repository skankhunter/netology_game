'use strict';
class Vector {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plus (vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Можно прибавлять к вектору только вектор типа Vector');
        }
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    times (num) {
        return new Vector(this.x * num, this.y * num);
    }
}


class  Actor {
    constructor (pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)) {
        if (!(pos instanceof Vector)) {
            throw new Error('Расположение не является объектом типа Vector');
        }
        if (!(size instanceof Vector)) {
            throw new Error('Размер не является объектом типа Vector');
        }
        if (!(speed instanceof Vector)) {
            throw new Error('Скорость не является объектом типа Vector');
        }
        this.pos = pos;
        this.size = size;
        this.speed = speed;

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

    isIntersect(obj) {
        if (!(obj instanceof Actor) ) {
            throw new Error('Нужен объект типа Actor');
        }
        if (obj === this) {
            return false;
        }
        return this.left < obj.right && this.right > obj.left && this.top < obj.bottom && this.bottom > obj.top;
    }
}

class Level {
    constructor(arrayGrids = [], arrayActors = []) {
        this.grid = arrayGrids;
        this.actors = arrayActors;
        if (this.actors === undefined) { // эту проверку лучше сделать в конструкторе, чтобы нельзя было создать невалидный объект
            return undefined;
        }
        this.player = this.actors.find( item => {
            return item.type === 'player'
        });
        this.height = this.grid.length;
        // можно просто добавить 0

        this.width = this.height > 0 ?  Math.max(0,...this.grid.map(el => el.length)) : 0;
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished() {
        return this.status !== null && this.finishDelay < 0;
    }

    actorAt(obj) {
        if (!(obj instanceof(Actor)) ) {
            throw new Error('actor is not instanceof Actor or undefined')
        }

        return this.actors.find( (actor) => actor.isIntersect(obj));

    }
    obstacleAt(position, size) {
        if (!(position instanceof Vector) ||
            !(size instanceof Vector)) {
            throw new Error(`В метод obstacleAt передан не вектор`);
        }

        const borderLeft = Math.floor(position.x);
        const borderRight = Math.ceil(position.x + size.x);
        const borderTop = Math.floor(position.y);
        const borderBottom = Math.ceil(position.y + size.y);

        if (borderLeft < 0 || borderRight > this.width || borderTop < 0) {
            return 'wall';
        }
        if (borderBottom > this.height) {
            return 'lava';
        }

        for (let y = borderTop; y < borderBottom; y++) {
            for (let x = borderLeft; x < borderRight; x++) {
                const gridLevel = this.grid[y][x];
                if (gridLevel) {
                    return gridLevel;
                }
            }
        }
    }

    removeActor(actor) {
         const actorIndex = this.actors.indexOf(actor);
        if (actorIndex !== -1) {
            this.actors.splice(actorIndex, 1);
        }
    }

    noMoreActors(str) {
        return !this.actors.some((actor) => actor.type === str)
    }

    playerTouched(str, actor) {
        if (this.status !== null) {
            return;
        }
        if (['lava', 'fireball'].some((el) => el === str)) {
            return this.status = 'lost';
        }
        if (str === 'coin' && actor.type === 'coin') {
            this.removeActor(actor);
            if (this.noMoreActors('coin')) {
                return this.status = 'won'
            }
        }
    }
}

class LevelParser {
    constructor(letterDictionary = {}) {
        // здесь можно создать копию объекта чтобы избежать следующей ситуации
        // const dict = { some: 'dict'};
        // const levelParser = new LevelParser(dict);
        // console.log(levelParser.letterDictionary); -> { some: 'dict' }
        // dict.some = 'thingelse';
        // console.log(levelParser.letterDictionary); -> { some: 'thingelse' }
        // т.е. внутреннее поле объекта меняется извне, это может привести к труднонаходимым ошибкам
        // тоже самое касается массивов grid и actors в конструкторе класса Level
        this.letterDictionary = Object.assign({}, letterDictionary);
    }

    actorFromSymbol(letter) {
        return this.letterDictionary[letter];
    }

    obstacleFromSymbol (str) {
        if (str === 'x') {
            return "wall"
        }
        if (str === '!') {
            return "lava"
        }
    }

    createGrid (arrayStrings) {
        return arrayStrings.map(str => str.split('').map(symb => this.obstacleFromSymbol(symb)));
    }

    createActors(arrayStrings) {
        return arrayStrings.reduce((rez, itemY, y) => {
            itemY.split('').forEach((itemX, x) => {
                const constructor = this.actorFromSymbol(itemX);
                if (typeof constructor === 'function') {
                    const actor = new constructor(new Vector(x, y));
                    if (actor instanceof Actor) {
                        rez.push(actor);
                    }
                }
            });
            return rez;
        },[]);
    }


    parse (arrayStrings) {
        return new Level(this.createGrid(arrayStrings), this.createActors(arrayStrings));
    }
}

class Fireball  extends  Actor{
    constructor (pos = new Vector(0, 0), speed = new Vector(0, 0)) {
       super(pos, new Vector(1, 1), speed);
    }
    get type() {
        return 'fireball';
    }

    getNextPosition (num = 1) {
        return this.pos.plus(this.speed.times(num));
    }

    handleObstacle () {
        this.speed = this.speed.times(-1);
    }

    act(time, level) {
        // const <-
        
        const nextPosition = this.getNextPosition(time);
        if (level.obstacleAt(nextPosition, this.size)) {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    }
}

class HorizontalFireball extends Fireball {
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(2, 0));
    }
}

class VerticalFireball extends Fireball{
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(0, 2));

    }
}

class FireRain extends Fireball{
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(0, 3));
        this.startPos = this.pos;
    }

    handleObstacle() {
        this.pos = this.startPos;
    }
}

class Coin extends Actor{
    constructor(pos = new Vector(0, 0)) {
        super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
        this.spring = Math.random() * (Math.PI * 2);
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.startPos = this.pos;
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
    constructor(pos = new Vector(0, 0)) {
        super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
    }
    get type() {
        return 'player'
    }
}

const actorDict = {
    '@': Player,
    'v': FireRain,
    'o': Coin,
    '=': HorizontalFireball,
    '|': VerticalFireball

};
const parser = new LevelParser(actorDict);

loadLevels()
    .then((res) => {
        runGame(JSON.parse(res), parser, DOMDisplay)
            .then(() => alert('Вы выиграли!'))
    });