(function($) {
    $.fn.slider = function(options) {
        
        function slideNext($children) {
            var $current = $children.filter(':visible');
            var $next = $current.is(':last') ? $children.filter(':first') : $current.next();
            $current.fadeOut();
            $next.fadeIn();
        }

        var settings = $.extend({delay: 5000}, options);

        return this.each(function() {

            var $this = $(this);
            var $children = $this.addClass('slider').find('> *');
            $children.filter(':not(:first)').hide();
            var interval = setInterval(function() {
                slideNext($children);
            }, settings.delay);
            $children.on('click.slider', function() {
                clearInterval(interval);
                slideNext($children);
                interval = setInterval(function() {
                    slideNext($children);
                }, settings.delay);
            });
        });
    };
})(jQuery);