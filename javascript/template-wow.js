"use strict";
function TemplateWow(el) {
    var _ = TemplateWow.utils,
        template = _.getTemplate(el),
        dynaObj = new _.DynamicObject(template);
    Object.defineProperty(this, 'data', {
        enumerable: true,
        get: function() {
            return dynaObj;
        },
        set: function(data) {
            for (var name in data) {
                dynaObj[name] = data[name];
            }
        }
    });
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
    function dashToCamelCase(str) {
        return str.replace(/-(.)/g, function(_, s) {
            return s.toUpperCase();
        });
    }

    function defineDynamicObjectProperty(dynaObj, name, template) {
        Object.defineProperty(dynaObj, '_' + name, {
            enumerable: false,
            value: new DynamicObject(template[name])
        });
        Object.defineProperty(dynaObj, name, {
            enumerable: true,
            get: function() {
                return dynaObj[''].get(name);
            },
            set: function(value) {
                dynaObj[''].set(name, value);
            }
        });
    }

    function DynamicObject(template) {
        Object.defineProperty(this, '', {
            enumerable: false,
            value: new DynamicObjectProperties(this)
        });
        if (template['']) {
            var elementList, element = template[''].element;
            if (element instanceof Array) {
                elementList = element.map(function(el) {
                    return {
                        element: el,
                        templater: DynamicObject.templaterForElement(el)
                    };
                });
            } else {
                elementList = [{
                        element: element,
                        templater: DynamicObject.templaterForElement(element)
                    }];
            }
            this[''].elementList = elementList;
            this[''].type = DynamicObject.type.value;
            return;
        }
        this[''].type = DynamicObject.type.object;
        for (var name in template) {
            defineDynamicObjectProperty(this, name, template);
        }
    }
    DynamicObject.type = {
        object: 1,
        value: 2
    };
    DynamicObject.templaterForElement = function(element) {
        if (element instanceof HTMLInputElement) {
            if (element.type === 'checkbox') {
                return DynamicObject.templater.checkbox;
            } else if (element.type === 'radio') {
                return DynamicObject.templater.radio;
            } else {
                return DynamicObject.templater.text;
            }
        } else if (element instanceof  HTMLTextAreaElement) {
            return DynamicObject.templater.text;
        } else if (element instanceof HTMLSelectElement) {
            return DynamicObject.templater.select;
        } else {
            return DynamicObject.templater.html;
        }
    };
    DynamicObject.templater = {
        text: {
            render: function(value) {
                this.value = notNullUndefinedString(value);
            }
        },
        checkbox: {
            render: function(value) {
                this.checked = value;
            }
        },
        select: {
            render: function(value) {
                for (var option, i = 0; option = this.options[i]; i++) {
                    if (option.value == value) {
                        this.selectedIndex = i;
                        break;
                    }
                }
            }
        },
        radio: {
            render: function(value) {
                this.checked = this.value == value;
            }
        },
        html: {
            render: function(value) {
                this.innerHTML = value;
            }
        }
    };
    function DynamicObjectProperties(dynaObj) {
        this.dynaObj = dynaObj;
    }
    DynamicObjectProperties.prototype.get = function(name) {
        var prop = this.dynaObj['_' + name];
        return prop[''].isValue() ? prop[''].value : prop;
    };
    DynamicObjectProperties.prototype.set = function(name, value) {
        var prop = this.dynaObj['_' + name];
        if (prop[''].isValue()) {
            prop[''].value = value;
            prop[''].elementList.forEach(function(item) {
                item.templater.render.call(item.element, value);
            });
            return;
        }
        for (var n in value) {
            prop[n] = value[n];
        }
    };
    DynamicObjectProperties.prototype.isValue = function() {
        return this.type === DynamicObject.type.value;
    };
    DynamicObjectProperties.prototype.asSimpleObject = function() {
        var obj = {}, value;
        for (var name in this.dynaObj) {
            value = this.dynaObj[name];
            obj[name] = value instanceof DynamicObject ? value[''].asSimpleObject() : value;
        }
        return obj;
    };

    utils.DynamicObject = DynamicObject;

    return utils;
})();

TemplateWow.prototype.simpleObject = function() {
    return this.data[''].asSimpleObject();
};