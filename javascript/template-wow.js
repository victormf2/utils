(function() {

    function getAllChildren(el) {
        var allChildren = [], children = el.children;
        for (var i = 0; i < children.length; i++) {
            allChildren.push(children[i]);
            allChildren = allChildren.concat(getAllChildren(children[i]));
        }
        return allChildren;
    }

    function getTemplate(el) {
        var template = {};
        return generateTemplate(el, template);
    }

    function getObjectFromHierarchy(hierarchy, object) {
        for (var i = 0; i < hierarchy.length; i++) {
            if (typeof object[hierarchy[i]] === 'undefined') {
                object[hierarchy[i]] = {};
            }
            object = object[hierarchy[i]];
        }
        return object;
    }

    function generateTemplate(el, obj) {
        var children = el.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i], name = child.getAttribute('bind') || '';
            if (name) {
                var hierarchy = name.split('.'),
                    object = generateTemplate(child, obj);
                object.__el = children[i];
            }


        }
    }

    TemplateWow = function(element) {
        this.el = element;
    };
    TemplateWow.prototype.getData = function() {

    };
})();