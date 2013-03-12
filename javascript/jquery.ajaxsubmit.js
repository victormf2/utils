/**
 * Simplificação da função jQuery.ajax() para
 * submissão de forms via ajax
 * Exemplo:
 * $('form').ajaxSubmit({
 *     success: function(data) {
 *         alert('Server response is: ' + data);
 *     },
 *     dataType: 'text'
 * });
 * Possíveis parâmetros:
 * url:
 *    igual ao parâmetro url de jQuery.ajax()
 *    padrão action do from
 * data:
 *    igual ao parâmetro data de jQuery.ajax()
 *    padrão valores dos inputs, selects, ... do form
 * method:
 *    igual ao parâmetro type de jQuery.ajax()
 *    padrão method do form
 * dataType:
 *    igual ao parâmetro dataType de jQuery.ajax()
 *    padrão 'json'
 * success:
 *    igual ao parâmetro success de jQuery.ajax()
 * error:
 *    igual ao parâmetro error de jQuery.ajax()
 */
(function($) {
    $.fn.ajaxSubmit = function(options) {
		
        var settings = $.extend({
            dataType: 'json'
        }, options);
		
        return this.each(function() {
            var $this = $(this);
            $this.on('submit.ajaxSubmit', function() {
                $.ajax({
                    url: settings.url ? settings.url : $this.attr('action'),
                    data: typeof settings.data === 'function' ? settings.data() : $this.serialize(),
                    type: settings.method ? settings.method : $this.attr('method'),
                    dataType: settings.dataType,
                    success: settings.success,
                    error: settings.error
                });
                return false;
            });
        });
    };
})(jQuery);