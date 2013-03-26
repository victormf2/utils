if (typeof MutationObserver === 'undefined') {
    MutationObserver = WebKitMutationObserver;
}
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation);
        var $el = $(mutation.target);
        var type = mutation.type;
        if (type === 'attributes') {
            $el.trigger('attrMutation', [mutation.attributeName, mutation.oldValue]);
        }
        if (type === 'characterData') {
            $el.trigger('textMutation', [mutation]);
        }
        if (type === 'childList') {
            $el.trigger('nodeMutation', [mutation]);
        }
    });
});

observer.observe($('.main')[0], {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
});

//attr creation: if oldValue === null
//attr remove:   if typeof attrName === 'undefined'
$('.main').on('attrMutation', function(event, attrName, oldValue) {
    console.log('Before: ' + oldValue);
    console.log('Now: ' +$(this).attr(attrName));
});


$('select').on('change', function() {
    console.log('changed');
});

//see http://jsfiddle.net/nyhtm/1/