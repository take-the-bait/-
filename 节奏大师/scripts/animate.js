/**
 * 运动框架
 * @ 初始化, 运动, 结束
 */
function animate(elem, target, time, callback) {
    this.interval = 5;
    this.elem = elem;
    this.target = target;
    this.semaphore = {};
    this.step = {};
    this.count = 0;
    this.maxcount = time / this.interval;
    this.timer = null;
    this.callback = callback;

    // 运动系数
    this.coefficient = .8;

    this.init();
    this.move();
}

animate.prototype.init = function() {
    for (var k in this.target) {
        this.semaphore[k] = parseFloat(fetchComStyle(this.elem, k));
        this.step[k] = (this.target[k] - this.semaphore[k]) / this.maxcount;
    }
}

animate.prototype.move = function() {
    var self = this;
    this.timer = setInterval(function() {
        for (var k in self.semaphore) {
            self.semaphore[k] += self.step[k] * self.coefficient;
            if (k != 'opacity') {
                self.elem.style[k] = self.semaphore[k] + 'px';
            } else {
                self.elem.style[k] = self.semaphore[k];
                self.elem.style.filter = 'alpha(opacity=' + self.semaphore[k] * 100 +')';
            }
        }

        self.count++;
        self.coefficient *= 1.008;
        if (self.count == self.maxcount) {
            self.end();
            if (self.callback) {
                self.callback();
            }
        }
    }, self.interval);
}

animate.prototype.end = function() {
    clearInterval(this.timer);
}

/**
 * 兼容处理
 */
function fetchComStyle(elem, attr) {
    return window.getComputedStyle ? window.getComputedStyle(elem)[attr] : elem.currentStyle[attr];
}