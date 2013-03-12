(function($) {
    $.fn.reset = function() {
        return this.each(function() {
            var $form = $(this);
            $('<input type="reset"/>').hide().appendTo($form).click().remove();
        });
    }
})(jQuery);