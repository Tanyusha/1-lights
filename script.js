/**
 * Created by Таника on 10.12.14.
 */
// События
var Events = function () {
};

/**
 * Подписка на событие
 */
Events.prototype.on = function (eventName, handler) {
    if (!this._eventHandlers)this._eventHandlers = [];
    if (!this._eventHandlers[eventName]) {
        this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
};

/**
 * Прекращение подписки
 */
Events.prototype.off = function (eventName, handler) {
    var handlers = this._eventHandlers[eventName];
    if (!handlers) return;
    for (var i = 0; i < handlers.length; i++) {
        if (handlers[i] == handler) {
            handlers.splice(i--, 1);
        }
    }
};


/**
 * Генерация события с передачей данных
 *  this.trigger('select', item);
 */
Events.prototype.trigger = function (eventName) {

    if (!this._eventHandlers[eventName]) {
        return; // обработчиков для события нет
    }
    // вызвать обработчики
    var handlers = this._eventHandlers[eventName];
    for (var i = 0; i < handlers.length; i++) {
        handlers[i].apply(this, [].slice.call(arguments, 1));
    }

};


//Светофор
TrafficLight.prototype = new Events();

function TrafficLight() {
    this.count = 0;
    this.isStop = false;
    this.timeoutId;
    this.color;
    this.timeoutGreen = 6000;
    this.timeoutYellow = 6000;
    this.timeoutRed = 6000;
};

TrafficLight.prototype.beginWork = function (timeout) {
    if (!timeout) {
        timeout = 2000;
    }
    var _this = this;
    var print = function () {
        if (_this.count % 4 === 0) {
            _this.toGreen(_this.timeoutGreen);
        } else if (_this.count % 4 === 1) {
            _this.toYellow(_this.timeoutYellow);
        }
        else if (_this.count % 4 === 2) {
            _this.toRed(_this.timeoutRed);
        }
        else {
            _this.toYellow(_this.timeoutYellow);
        }
    };
    if (!_this.isStop) {
        _this.timeoutId = setTimeout(print, timeout);
    }
};

TrafficLight.prototype.start = function () {
    var _this = this;
    _this.isStop = false;
    _this.beginWork();
};
TrafficLight.prototype.stop = function () {
    var _this = this;
    _this.isStop = true;
    clearTimeout(_this.timeoutId);
};

TrafficLight.prototype.toGreen = function (timeout) {
    clearTimeout(this.timeoutId);
    this.color = 'green';
    console.log(this.color);
//    console.log(this.count);
    this.count = 1;
    this.beginWork(timeout);
};
TrafficLight.prototype.toRed = function (timeout) {
    clearTimeout(this.timeoutId);
    this.color = 'red';
    console.log(this.color);
//    console.log(this.count);
    this.count = 3;
    this.beginWork(timeout);

};
TrafficLight.prototype.toYellow = function (timeout) {
    clearTimeout(this.timeoutId);
    this.color = 'yellow';
    console.log(this.color);
//    console.log(this.count);
    if (this.count === 1) {
        this.count = 2;
    } else {
        this.count = 0;
    }
    this.beginWork(timeout);
};
TrafficLight.prototype.state = function () {
    return this.color;

};

var my = new TrafficLight();

//Событие трамвай
var tram = function () {
    var _this = this;
    var changeColorToGreen = function () {
        var color = _this.count - 1;
        if (color === -1) {
            color = 3
        }
        console.log(color);
        _this.toGreen(11000);
        var returnToPreviousColor = function () {
            clearTimeout(_this.timeoutId);
            if (color === 2) {
                _this.toRed();
            }
            else {
                _this.toYellow();
            }
        };
        setTimeout(returnToPreviousColor, 10000);
    };
    setTimeout(changeColorToGreen, 3000);

};
my.on('tram', tram);
my.start();
//запуск анимированного трамвая по нажатию на кнопку
$(document).ready(function () {
    $('.btn-tram-run').click(function () {
            my.trigger('tram');
            $('.btn-tram-run').css('display', 'none');
            $('.tram').addClass("tram-animation");

            var reloadTram = function(){
                $('.tram').removeClass("tram-animation");
                $('.btn-tram-run').css('display', 'block');
            };

//            var transitionEnd = transitionEndEventName();
//            $('.tram').get(0).addEventListener(transitionEnd, reloadTram, false);

            setTimeout(reloadTram, 20000);
        }
    )
});

//смена цветов на светофоре

$(document).ready(function () {
    var changeColor = function() {
        if(my.color==='green')
        {
            $('.traffic-light').addClass("traffic-light-green");
            $('.traffic-light').removeClass("traffic-light-yellow");
            $('.traffic-light').removeClass("traffic-light-red");
        }
        else if (my.color==='yellow')
        {
            $('.traffic-light').addClass("traffic-light-yellow");
            $('.traffic-light').removeClass("traffic-light-green");
            $('.traffic-light').removeClass("traffic-light-red");
        }
        else {
            $('.traffic-light').addClass("traffic-light-red");
            $('.traffic-light').removeClass("traffic-light-yellow");
            $('.traffic-light').removeClass("traffic-light-green");
        }
    }
    setInterval(changeColor, 100);
});
//function transitionEndEventName () {
//    var i,
//        undefined,
//        el = document.createElement('div'),
//        transitions = {
//            'transition':'transitionend',
//            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
//            'MozTransition':'transitionend',
//            'WebkitTransition':'webkitTransitionEnd'
//        };
//
//    for (i in transitions) {
//        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
//            return transitions[i];
//        }
//    }
//
//    //TODO: throw 'TransitionEnd event is not supported in this browser';
//}
