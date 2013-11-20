"use strict";
function TemplateWow(el) {
    var _ = TemplateWow.utils,
        template = _.getTemplate(el);

}
TemplateWow.utils = (function() {
    var utils = {};
    var getElementData;
    if (document.documentElement.dataset) {
        getElementData = function(el, name) {
            return el.dataset[name];
        };
    } else {
        getElementData = function(el, name) {
            return el.getAttribute('data-' + name);
        };
    }
    function mergeObjects(o1, o2) {
        for (var attr in o2) {
            if (!attr) {
                continue;
            }
            if (typeof o1[attr] === 'object' && typeof o2[attr] === 'object') {
                if (o1[attr] instanceof Array && o2[attr] instanceof Array) {
                    o1[attr] = o1[attr].concat(o2[attr]);
                } else {
                    mergeObjects(o1[attr], o2[attr]);
                }
            } else {
                o1[attr] = o2[attr];
            }
        }
    }
    utils.getTemplate = function(el) {
        var template = {};
        buildTemplate(el, template);
        return template;
    };
    function getObjectFromHierarchy(hierarchy, object) {
        for (var i = 0; i < hierarchy.length; i++) {
            if (typeof object[hierarchy[i]] === 'undefined') {
                object[hierarchy[i]] = {};
            }
            object = object[hierarchy[i]];
        }
        return object;
    }
    function buildTemplate(el, template) {
        var children = el.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i], name = getElementData(child, 'bind');
            if (name) {
                var hierarchy = name.split('.'),
                    object = getObjectFromHierarchy(hierarchy, template),
                    info = object[''];
                if (info) {
                    var element = info.element;
                    if (element instanceof Array) {
                        element.push(child);
                    } else {
                        info.element = [element, child];
                    }
                } else {
                    object[''] = {element: child};
                }
                mergeObjects(template, object);
            }
            buildTemplate(child, template);
        }
    }
    function notNullUndefinedString(str) {
        return str === undefined || str === null ? '' : str;
    }
    utils.setDataWithTemplate = function(template, data) {
        for (var attr in template) {
            if (!attr) {
                var element = template[attr].element;
                if (element instanceof HTMLInputElement) {
                    if (element.type === 'checkbox') {
                        element.checked = data;
                    } else {
                        element.value = notNullUndefinedString(data);
                    }
                } else if (element instanceof  HTMLTextAreaElement) {
                    element.value = notNullUndefinedString(data);
                } else if (element instanceof HTMLSelectElement) {
                    for (var option, i = 0; option = element.options[i]; i++) {
                        if (option.value == data) {
                            element.selectedIndex = i;
                            break;
                        }
                    }
                } else if (element instanceof Array) {
                    for (var radio, i = 0; radio = element[i]; i++) {
                        if (radio.value == data) {
                            radio.checked = true;
                            break;
                        }
                    }
                }
                continue;
            }
            this.setDataWithTemplate(template[attr], (data || {})[attr]);
        }
    };

    function DynamicObject(template) {
        for (var name in template) {
            Object.defineProperty(this, '_' + name, {
                enumerable: false,
                value: new DynamicObject(template[name])
            });
            Object.defineProperty(this, name, {
                enumerable: true,
                get: function() {
                    return this.get(name);
                },
                set: function(value) {
                    this.set(name, value);
                }
            });
        }
    }
    DynamicObject.TYPE_VALUE = 1;
    DynamicObject.prototype.get = function(name) {
        return this['_' + name];
    };
    DynamicObject.prototype.set = function(name, value) {
        if (this.type === DynamicObject.TYPE_VALUE)
    };

    utils.createDynamicObjectWithTemplate = function(template) {

        for (var name in template) {
            obj['_' + name] = {};
        }
    };
    return utils;
})();

TemplateWow.prototype.setData = function(el, data) {
    var _ = TemplateWow.utils;
    var template = _.getTemplate(el);
    _.setDataWithTemplate(template, data);
};

TemplateWow.prototype.bindData = function(el, data) {
    var template = TemplateWow.utils.getTemplate(el);
};


TemplateWow.prototype.getData = function(el) {
};