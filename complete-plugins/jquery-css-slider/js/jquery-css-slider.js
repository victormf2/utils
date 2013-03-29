(function($) {
    var methods = {
        init: function(options) {
            var settings = $.extend({
                interval: 3000,
                duration: 500,
                step: 1,
                show: 4,
                itemHeight: 'guess',
                itemWidth: 'guess',
                cyclic: false
            }, options);
            return this.each(function() {
                var $ul = $(this);
                $ul.data('css-slider.settings', settings);
                var $lis = $ul.find('li').css('float', 'left');

                var height = settings.itemHeight;
                if (isNaN(height)) {
                    height = $lis.outerHeight(true);
                    settings.itemHeight = height;
                }
                var itemWidth = settings.itemWidth;
                var width = itemWidth * settings.show;
                if (isNaN(width)) {
                    itemWidth = $lis.outerWidth(true);
                    settings.itemWidth = itemWidth;
                    width = itemWidth * settings.show;
                }
                var duration = settings.duration / 1000;
                $ul.css({
                    height: height + 'px',
                    width: ($lis.length * itemWidth + 2 * itemWidth) + 'px',
                    transition: 'left ' + duration + 's, right ' + duration + 's'
                }).wrap('<div></div>').parent().addClass('css-slider').css('width', width + 'px');
                $ul.addClass('css-slider').show().css({visibility: 'visible'})
                        .data('css-slider.limit', $lis.length - settings.show);
                if (settings.interval) {
                    $ul.cssSlider('proceed');
                }
            });
        },
        slide: function(direction) {
            return this.each(function() {
                var $ul = $(this);
                var settings = $ul.data('css-slider.settings');
                var step = settings.step;
                var $lis = $ul.find('li');
                var length = $lis.length;
                if (step >= length)
                    return;
                switch (direction) {
                    case 'next':
                        if (!settings.cyclic) {
                            var limit = $ul.data('css-slider.limit');
                            var position = Math.abs($ul.position().left);
                            var hiddens = position / settings.itemWidth;
                            var nextPosition = hiddens >= limit ? 0 : position + settings.itemWidth;
                            $ul.css('left', '-' + nextPosition + 'px');
                        } else {
                            var $last = $lis.filter(':last');
                            var $firsts = $lis.slice(0, step);
                            $last.after($firsts);
                        }
                        break;
                    case 'prev':
                        if (!settings.cyclic) {
                            
                        } else {
                            var $first = $lis.filter(':last');
                            var $lasts = $lis.slice(length - step, length);
                            $first.before($lasts);
                        }
                        break;
                }

            });
        },
        stop: function() {
            return this.each(function() {
                var $ul = $(this);
                clearInterval($ul.data('css-slider.interval'));
            });
        },
        proceed: function() {
            return this.each(function() {
                var $ul = $(this);
                var settings = $ul.data('css-slider.settings');
                setTimeout(function() {
                    $ul.cssSlider('slide', 'next');
                    var interval = setInterval(function() {
                        $ul.cssSlider('slide', 'next');
                    }, settings.interval + settings.duration);
                    $ul.data('css-slider.interval', interval);
                }, settings.interval);
            });
        }
    };

    $.fn.cssSlider = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.cssSlider');
        }
    };
})(jQuery);