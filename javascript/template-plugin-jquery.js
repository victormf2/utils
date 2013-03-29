(function($) {
    var methods = {
        init: function(options) {
            var settings = $.extend({
            }, options);
            return this.each(function() {
                var $this = $(this);
            });
        }
    };

    $.fn.plugin = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.plugin');
        }
    };
})(jQuery);