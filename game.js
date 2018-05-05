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
        // второй раз аргументы проверять не нужно
        // если выше будет выброшено исключение, выполнение функции прекратится
        if ((pos instanceof Vector) && (size instanceof Vector) && (speed instanceof Vector)) {
            this.pos = pos;
            this.size = size;
            this.speed = speed;
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

    isIntersect(obj) {
        // первая половина проверки не нужна
        // undefined instanceof Actor === false
        if ( !obj || !(obj instanceof Actor) ) {
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
        // короче искользовать стрелочную функцию
        this.player = this.actors.find( function (item) {
            return item.type === 'player'
        });
        this.height = this.grid.length;
        // можно просто добавить 0 в аргументы Math.max
        this.width = this.height > 0 ?  Math.max(...arrayGrids.map(el => el.length)) : 0;
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished() {
        // здесь можно увпростить до одной строчки
        // return <выражение в if>
        if (this.status !== null && this.finishDelay < 0) {
            return true
          // лишний код
        } else if (this.status !== null && this.finishDelay > 0) {
            return false
        }
        return false
    }

    actorAt(obj) {
        if (!(obj instanceof(Actor)) || obj === undefined) {
            throw new Error('actor is not instanceof Actor or undefined')
        }
        // эту проверку лучше сделать в конструкторе, чтобы нельзя было создать невалидный объект
        if (this.actors === undefined) {
            return undefined;
        }

        // тут короче использовать метод find
        for (const actor of this.actors) {
            if (actor.isIntersect(obj)) {
                return actor;
            }
        }
        // эта строчка не нужна, функция и так возвращает undefined если не указано другое
        return undefined;
    }
    obstacleAt(pos, size) {
        if (!(pos instanceof(Vector)) || !(size instanceof(Vector))) {
            throw new Error("position or size is not instanceof Vector")
        }

        // тут можно не создавать объект,
        // а просто посчитать граничные значения и сохранить в переменных
        let actor = new Actor(pos, size);
        if (actor.top < 0 || actor.left < 0 || actor.right > this.width) {
            return 'wall';
        }
        if (actor.bottom > this.height) {
            return 'lava';
        }

        // округлить лучше до цикла, чтобы не округлять на каждой итерации
        for (let col = Math.floor(actor.top); col < Math.ceil(actor.bottom); col++) {
            for (let row = Math.floor(actor.left); row < Math.ceil(actor.right); row++) {
                // this.grid[col][row] лучше записать в переменную, чтобы 2 раза не писать
                // !== undefined можно убрать
                if (this.grid[col][row] !== undefined) {
                    return this.grid[col][row];
                }
            }
        }
        // лишняя строчка
        return undefined;
    }

    removeActor(actor) {
        // код нужно упростить (цикл лишний)
        for (let i = 0; i < this.actors.length; i++) {
            let ind = this.actors.indexOf(this.actors[i]);
            if (actor === this.actors[i]) {
                this.actors.splice(ind, 1);
            }
        }
    }

    noMoreActors(str) {
        // можно написать в одну строчку с помощью метода some
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

        // дублирование логики removeActor и noMoreActors
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
        // this.keysOfGrid лучше проверить в конструкторе,
        // если не будет задан - работать ничего не будет
        if (str && this.keysOfGrid) {
            return this.keysOfGrid[str]
        }
        // лишняя строчка
        return undefined
    }

    obstacleFromSymbol (str) {
        if (str === 'x') {
            return "wall"
        }
        if (str === '!') {
            return "lava"
        }
        // лишняя строка
        return undefined
    }

    createGrid (arrayStrings) {
        // лишяя проверка
        if (arrayStrings.length === 0) {
            return [];
        }
        return arrayStrings.map(str => str.split('').map(symb => this.obstacleFromSymbol(symb)));
    }

    createActors(arrayStrings) {
        // лучше использовать стрелочные функции и убрать эту строчку
        let self = this;
        return arrayStrings.reduce(function(prev, row, Y) {
            // строки обычно преобразуются в массив с помощью метода split
            // так понятно, что это строка
            [...row].forEach(function(c, X) {
                if (c) {
                    let Creator = self.actorFromSymbol(c);
                    if (Creator && typeof (Creator) === "function") {
                        // значение присваивается переменной 1 раз лучше использовать const
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
        // pos, speed и size должны задаваться через конструктор базового класса
        super();
        this.pos = pos;
        this.speed = speed;
    }
    get type() {
        return 'fireball';
    }

    getNextPosition (num = 1) {
        // проверка лишняя
        if (this.speed.x === 0 && this.speed.y === 0) {
            return this.pos;
        }
        // здесь лучше использовать метода plus и times
        if (num) {
            return new Vector(this.pos.x += this.speed.x * num, this.pos.y += this.speed.y * num);
        }
        return new Vector(this.pos.x += this.speed.x, this.pos.y += this.speed.y);
    }

    handleObstacle () {
        // здесь нужно исопльзовать метода times
        this.speed.x = -this.speed.x;
        this.speed.y = -this.speed.y;
    }

    act(time, level) {
        // const
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
      // pos, speed и size должны задаваться через конструктор базового класса
        super();
        this.pos = pos;
        this.size = new Vector(1, 1);
        this.speed = new Vector(2, 0);
    }
}

class VerticalFireball extends Fireball{
    constructor(pos) {
      // pos, speed и size должны задаваться через конструктор базового класса
        super();
        this.pos = pos;
        this.size = new Vector(1,1);
        this.speed = new Vector(0,2);
    }
}

class FireRain extends Fireball{
    constructor(pos) {
      // pos, speed и size должны задаваться через конструктор базового класса
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
      // pos, speed и size должны задаваться через конструктор базового класса
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
      // pos, speed и size должны задаваться через конструктор базового класса
        this.speed = new Vector(0, 0);
    }
    get type() {
        return 'player'
    }
}

class DOMDisplay {
    constructor() {

    }
}


const grid = [
    new Array(3),
    ['wall', 'wall', 'lava']
];
const level = new Level(grid);
runLevel(level, DOMDisplay);
const schema = [
    '         ',
    '         ',
    '         ',
    '         ',
    '     !xxx',
    '         ',
    'xxx!     ',
    '         '
];
const parser = new LevelParser();
const level = parser.parse(schema);
runLevel(level, DOMDisplay);

const schema = [
    '         ',
    '         ',
    '         ',
    '         ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
];
const actorDict = {
    '@': Player
}
const parser = new LevelParser(actorDict);
const level = parser.parse(schema);
runLevel(level, DOMDisplay);