(function($) {
    $.cookie = function(cookieName, cookieValue, options) {
        if (typeof cookieValue === 'undefined') {
            var match = new RegExp(cookieName + '=(.*?)\\s*(?:;|$)').exec(document.cookie);
            return match === null ? null : match[1];
        } else {
            var expiresStr = '';
            var pathStr = '';
            if (options) {
                if (options.expires) {
                    var expireDate = new Date();
                    expireDate.setTime(new Date().getTime() + 3600000 * options.expires);
                    expiresStr = '; expires=' + expireDate.toGMTString();
                }
                if (options.path) {
                    pathStr = '; path=' + path;
                }
            }
            document.cookie = cookieName + '=' + cookieValue + expiresStr + pathStr;
        }
    };
})(jQuery);