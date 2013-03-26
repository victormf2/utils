(function($) {
    $.fn.slideLeft = function() {
        return this.each(function() {
            $(this).animate({width: 'hide'});
        });
    };
    $.fn.slideRight = function() {
        return this.each(function() {
            $(this).animate({width: 'show'});
        });
    };
})(jQuery);