(function(w) {
    "use strict";
    var $ = {
        isString: function(obj) {
            return typeof obj === 'string' || obj instanceof String;
        },
        relativePath: function(path) {
            if ($.isString(path)) {
                return $.trim(path).replace(/^[\\\/]+|[\\\/]+$/g, '').replace(/[\\\/]+/g, '/');
            }
            return '';
        }
    };
    if (typeof Array.isArray === 'function') {
        $.isArray = function(obj) {
            return Array.isArray(obj);
        };
    } else {
        $.isArray = function(obj) {
            return obj instanceof Array;
        };
    }
    if (String.prototype.trim) {
        $.trim = function(str) {
            return $.isString(str) ? str.trim() : '';
        };
    } else {
        $.trim = function(str) {
            return $.isString(str) ? str.replace(/^\s+|\s+$/g, '') : '';
        };
    }
    var AjaxNavMenu = w.AjaxNavMenu = function(config) {
        config = config || {};
        this.name = config.name;
        this.label = config.label;
        this.menuItems = [];
    };
    AjaxNavMenu.fromSimpleObject = function(obj) {
        var menu = new AjaxNavMenu(obj);
        if ($.isArray(obj.menuItems)) {
            for (var i = 0; i < obj.menuItems.length; i++) {
                menu.menuItems.push(AjaxNavMenu.fromSimpleObject(obj.menuItems[i]));
            }
        }
        return menu;
    };
    var AjaxNav = w.AjaxNav = function(config) {
        this.menu = AjaxNavMenu.fromSimpleObject(config.menu);
        this.baseUrl = location.protocol + '//' + location.host + '/' + $.relativePath(config.basePath) + '/';
        this.initialState = {};
        this.suffix = config.suffix;
    };
    AjaxNav.prototype.nav = function(url, params, hash) {
        if (/^https?:\/\//.test(url)) {
            location = url;
        } else {
            var levels = $.relativePath(url).split('/');
            var menuItems = this.menu.menuItems;
            for (var i = 0; i < levels.length; i++) {

            }
        }
    };
})(window);