(function($) {
    $.unserialize = function(paramString) {
        var params = paramString.split('&');
        var obj = {};
        $.each(params, function(index, param) {
            var arr = param.split('=');
            var name = arr[0];
            var value = decodeURIComponent(arr[1]);
            obj[name] = value;
        });
        return obj;
    };
})(jQuery);