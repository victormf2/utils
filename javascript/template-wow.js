(function() {

    function getAllChildren(el) {
        var allChildren = [], children = el.children;
        for (var i = 0; i < children.length; i++) {
            allChildren.push(children[i]);
            allChildren = allChildren.concat(getAllChildren(children[i]));
        }
        return allChildren;
    }

    function generateTemplate(el) {
        var template = {}, children = el.children;
        for (var i = 0; i < children.length; i++) {
            var name = children[i].getAttribute('data-bind'),
                hierarchy = name.split('.'),
                obj = template;
            for (var j = 0; j < hierarchy.length; j++) {
                if (typeof obj[hierarchy[i]] === 'undefined') {
                    obj[hierarchy[i]] = {};
                }
                obj = obj[hierarchy[i]];
            }
            obj.__el = children[i];
        }
    }

    TemplateWow = function(element) {
        this.el = element;
    };
    TemplateWow.prototype.getData = function() {

    };
})();