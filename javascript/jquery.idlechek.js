/**
 * Verificará se o usuário está inativo por um tempo
 * determinado em milissegundos.
 * É considerado inativo se o usuário não fizer ação
 * com o teclado ou o mouse.
 * Quando ficar inativo uma função de callback é
 * acionada, e quando voltar a ficar ativo uma
 * função também é acionada.
 * 
 * Uso: 
 * $('selector').idleCheck({
 *     timeout: 60000, //tempo em milissegundos até o usuário
 *                     //ficar inativo (padrão 30000)
 * 
 *     onIdle: function() { //função disparada assim que o usuário
 *         alert('inativo');//ficar inativo
 *     },  
 * 
 *     onActive: function() { //função disparada assim que o usuário
 *         alert('ativo');    //voltar a ficar ativo
 *     }
 * });
 * 
 * Dica:
 * Use $.idleCheck() para verificar inatividade no documento
 * inteiro. Use $('selector').idleCheck() para verificar
 * inatividade num elemento específico
 */

(function($) {

    $.fn.idleCheck = function(options) {  

        var settings = $.extend({
            timeout: 30000
        }, options);
        return this.each(function() {

            var $this = $(this);
            $this.data('idleCheck', false);
            var onIdle = function() {
                $this.data('idleCheck', true);
                if (typeof settings.onIdle === 'function') {
                    settings.onIdle();
                }
            }
            var idleTimeout = setTimeout(onIdle, settings.timeout);
            $this.on('mousemove.idleCheck keydown.idleCheck', function() {
                clearTimeout(idleTimeout);
                if ($this.data('idleCheck')) {
                    if (typeof settings.onActive === 'function') {
                        settings.onActive();
                    }
                }
                $this.data('idleCheck', false);
                idleTimeout = setTimeout(onIdle, settings.timeout);
            });
        });

    };

    $.idleCheck = function(options) {
        $(document).idleCheck(options);
    }
})(jQuery);