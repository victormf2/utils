function leftPad(str, length, char) {
    var padded = str + '';
    if (!char) {
        char = ' ';
    }
    while (padded.length < length) {
        padded = char + padded;
    }
    return padded;
}

function millisToTime(millis, show) {
    show = $.extend({
        hours: false,
        seconds: true,
        millis: false
    }, show);
    var seconds = 0 | (millis / 1000);
    millis = millis - seconds * 1000;
    var minutes = 0 | (seconds / 60);
    seconds = seconds - minutes * 60;
    var hours = 0;
    if (show.hours) {
        hours = 0 | (minutes / 60);
        minutes = minutes - hours * 60;
    }
    var time = '';
    if (show.hours) {
        time = leftPad(hours, 2, '0') + ':';
    }
    time += leftPad(minutes, 2, '0');
    if (show.seconds) {
        time += ':' + leftPad(seconds, 2, '0');
        if (show.millis) {
            time += '.' + leftPad(millis, 3, '0');
        }
    }
    return time;
}


var clockMethods = {
    restart: function() {
        return this.each(function() {
            var $this = $(this);
            var clock = $this.data('clock');
            clock.elapsed = 0;
            clock.start = new Date().getTime();
            console.log('sdadassd');
        });
    },
    init: function(options) {
        var settings = $.extend({
            type: 'chronometer', //chronometer or timer
            time: 300000, //5 minutes (for timer only)
            autoStart: true,
            onStop: $.noop,
            onUpdate: $.noop,
            updateInterval: 500,
            displayConfig: {
                hours: false,
                seconds: true,
                millis: false
            }
        }, options);
        var onUpdate = settings.onUpdate;
        settings.onUpdate = function() {
            onUpdate.call(this, $(this).data('clock'));
        };
        this.data('clock', {}).clock('stop').each(function() {
            $(this).data('clock', $.extend({
                elapsed: 0,
                start: 0,
                stopped: true
            }, settings));
        });
        if (settings.autoStart) {
            this.clock('start');
        }
        return this;
    },
    start: function() {
        var now = new Date().getTime();
        return this.each(function() {
            var $this = $(this);
            var clock = $this.data('clock');
            if (!clock.stopped) {
                return;
            }
            clock.stopped = false;
            clock.start = now - clock.elapsed;
            clock.intervalId = setInterval(function() {
                var now = new Date().getTime();
                clock.elapsed = now - clock.start;
                $this.clock('update');
            }, clock.updateInterval);
        });
    },
    update: function() {
        return this.each(function() {
            var $this = $(this);
            var clock = $this.data('clock');
            switch (clock.type) {
                case 'timer':
                    var remaining = clock.time - clock.elapsed;
                    if (remaining > 0) {
                        $this.html(millisToTime(remaining, clock.displayConfig));
                    } else {
                        $this.clock('stop');
                        $this.html(millisToTime(0, clock.displayConfig));
                        clock.onStop(true);
                    }
                    break;
                case 'chronometer':
                    $this.html(millisToTime(clock.elapsed, clock.displayConfig));
                    break;
            }
            clock.onUpdate.call(this, clock);
        });
    },
    stop: function() {
        return this.each(function() {
            var clock = $(this).data('clock');
            if (clock.stopped) {
                return;
            }
            clock.stopped = true;
            clearInterval(clock.intervalId);
        });
    }
};

$.fn.clock = function(method) {
    if (clockMethods[method]) {
        return clockMethods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
        return clockMethods.init.apply(this, arguments);
    } else {
        $.error('Method ' + method + ' does not exist on jQuery.clock');
    }
};


$('.tempo').clock({
    type: 'timer',
    time: 10000
});


setInterval(function() {
    if ($('.tempo').text() == '00:02' && $('.user').text() != 'pc') {
        $('.tempo').clock('restart');
        $('.user').html('pc');
    }
}, 20);

$('button').on('click', function() {
    $('.tempo').clock('restart');
    $('.user').html('Humano');
});
