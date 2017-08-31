/**
 * 节奏线(三种节奏)
 * @属性: DOM, 宽, 高, 定位(上, 左), 透视变化
 * @方法: 出现, 运动, 死亡 
 */
function Line(width, left, targetWidth, targetLeft, container) {
    this.container = document.getElementById(container);
    this.domBox = null;
    this.domLine = null;
    this.width = width;
    this.height = 9;
    this.top = 0;
    this.left = left;
    this.targetWidth = targetWidth;
    this.targetHeight = 42;
    this.targetTop = 527;
    this.targetLeft = targetLeft;
    this.speed = 3000;
    this.animate = null;

    this.init();
    this.move();
}

Line.prototype.init = function() {
    this.dom = document.createElement('img');
    this.dom.src = './images/line.png';
    this.dom.style.position = 'absolute';
    this.dom.style.width = this.width + 'px';
    this.dom.style.height = this.height + 'px';
    this.dom.style.top = this.top + 'px';
    this.dom.style.left = this.left + 'px';
    this.container.appendChild(this.dom);
}

Line.prototype.move = function() {
    var self = this;
    this.animate = new animate(this.dom, {
        'width': this.targetWidth, 
        'height': this.targetHeight, 
        'top': this.targetTop, 
        'left': this.targetLeft
    }, this.speed, function() {
       self.container.removeChild(self.dom);
       GameOn.game.score -= 5;
       GameOn.game.scoreboardChange();
    });

    // 事件绑定
    // onmouseover 和 onmouseenter 都存在有时候消不掉节奏线的bug
    this.dom.onmouseenter = function() {
        GameOn.game.effect.style.opacity = 1;
        self.die();
        GameOn.game.score += 10;
        GameOn.game.scoreboardChange();
    }
}

Line.prototype.die = function() {
    var self = this;
    setTimeout(function() {
        GameOn.game.effect.style.opacity = 0
    }, 300);
    clearInterval(this.animate.timer);
    this.container.removeChild(this.dom);
}

/**
 * 游戏
 * @ 随机创建line对象, 分数
 */
function Game() {
    this.timer = null;
    this.score = 0;
    this.leftLines = [];
    this.middleLines = [];
    this.rightLines = [];
    this.ranLines = function () {return parseInt(Math.random() * 3) + 1};
    this.ranTime = function() {return Math.random() * 1000 + 1000};
    this.scoreboard = document.getElementById('scoreboard');
    this.effect = document.getElementById('light');

    this.init();
    this.createLine();
}

Game.prototype.init = function() {
    this.scoreboard.innerText = 0;
}

Game.prototype.createLine = function() {
    var self = this;
    this.timer = setInterval(function() {
        var tempRan = self.ranLines();
        var tempRanTime = self.ranTime();
        setTimeout(function() {
            if (tempRan == 1) {
                var line = new Line(150, 300, 320, -28, 'linebox');
            } else if(tempRan == 2) {
                var line = new Line(173, 450, 500, 287, 'linebox');
            } else {
                var line = new Line(150, 623, 320, 777, 'linebox');
            }
        }, tempRanTime);
    }, 500)
}

Game.prototype.scoreboardChange = function() {
    if(this.score < 0) this.score = 0;
    this.scoreboard.innerText = this.score;
}

Game.prototype.die = function() {
    clearInterval(this.timer);
}

/**
 * 菜单
 */
function Menu() {
    this.startmenu = document.getElementById('startmenu');
    this.endmenu = document.getElementById('endmenu');
    this.bg = document.getElementById('bg');
    this.totalscore = document.getElementById('totalscore');
    this.timer = null;
    this.count = 0;

    var self = this;
    this.startmenu.onclick = function() {
        self.menuDisappear();
    }
    this.endmenu.onclick = function() {
        new animate(self.endmenu, {'top': -400}, 200, function() {
            self.endmenu.style.display = 'none';
            self.startmenu.style.display = 'block';
            new animate(self.startmenu, {'top': 150}, 200);
        });
    }
    this.end = function() {
        self.endmenu.style.display = 'block';
        self.bg.style.display = 'block';
        new animate(self.endmenu, {'top': 150}, 200);
        new animate(self.bg, {'opacity': 1}, 300);
    }
}

Menu.prototype.menuDisappear = function() {
    var self = this;
    new animate(self.startmenu, {'top': -400}, 200, function() {
        self.startmenu.style.display = 'none';
    });
    new animate(self.bg, {'opacity': 0}, 300, function() {
        self.bg.style.display = 'none';
        GameOn.game = new Game();
        self.timer = setInterval(function() {
            self.count ++;
            if (self.count == 20) {
                clearInterval(self.timer);
                self.count = 0;
                GameOn.game.die();
                self.totalscore.innerText = GameOn.game.score;
                self.end();
            }
        }, 1000);
    });
}

/**
 * 总开关
 */
function GameOn() {
    this.game = null;
    this.menu = new Menu();
}

var gameOn = new GameOn();