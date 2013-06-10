// regex de data
// /^(?:(?:0[1-9]|1[0-9]|2[0-8])\/(?:0[1-9]|1[0-2])|(?:29|30)\/(?:0[13-9]|1[0-2])|(?:31)\/(?:0[13578]|1[02]))\/(?:\d{4})$|^29\/02\/(?:\d{2}(?:[13579][26]|[02468][48]|[2468]0)|(?:[13579][26]|[02468][048])00)$/

(function($) {
    $.expr[':'].editable = function(el) {
        return $(el).not('[disabled]').is('input[type!="hidden"][type!="button"][type!="submit"][type!="image"],textarea,select');
    };
    $.validate = {
        //Validation will be called on form submit
        submit: true,
        //Validation will be called on field change event
        change: true,
        //Validation will be called on field input event
        input: false,
        //Delay to be used on validation after input event
        inputTimeout: 500,
        //Validation will be called on field keypress event
        keypress: false,
        //Validation will be called on field blur event
        blur: false,
        //Validation will be called on field focus event
        focus: false,
        //Form will be submited via ajax (onValid), so event is default prevented
        ajax: false,
        //stopImmediatePropagation for submit event
        stopImmediatePropagation: true,
        //stopPropagation for submit event
        stopPropagation: true,
        //Class used for error messages
        errorMessageClass: 'error-message',
        //Tag name used to create error messages
        errorMessageTagName: 'span',
        //Boolean indicating whether errors will be shown,
        //or custom function to show errors
        //The parameters for this function will be:
        // - errors: array with error messages
        // - settings: the options passed within the validate method
        showErrors: true,
        //Boolean indicating whether errors will be removed,
        //or custom function to remove errors
        //The parameters for this function will be:
        // - settings: the options passed within the validate method
        removeErrors: true,
        //Function to be executed after a field is validated
        eachValidField: $.noop,
        //Function to be executed after a field is invalidated
        eachInvalidField: $.noop,
        //Function to be executed after a field validation, regardless it's valid or not
        eachField: $.noop,
        //Function to be executed after a field group (usually a form) is validated
        onValid: $.noop,
        //Function to be executed after a field group (usually a form) is invalidated
        onInvalid: $.noop,
        //Wheter event handlers will be delegated or not (less performance)
        //It's good to use this option if you wish to validate on every field change,
        //but the form fields are generated dinamically, so you don't have to recall
        //the validate method everytime
        delegate: false,
        rules: {},
        messages: {
            required: 'Required field',
            "required-if": 'Required field when:'
        },
        setupSettings: function(options) {
            return $.extend(true, $.validate, options);
        }
    };
    var methods = {
        init: function(options) {
            var settings = $.validate.setupSettings(options);
            return this.each(function() {
                var $fieldGroup = $(this), $form = $fieldGroup.closest('form');
                if (settings.submit) {
                    $form.on('submit', function(event) {
                        if ($fieldGroup.validate('validateFieldGroup', settings) || settings.ajax) {
                            event.preventDefault();
                            if (settings.stopImmediatePropagation) {
                                event.stopImmediatePropagation();
                            } else if (settings.stopPropagation) {
                                event.stopPropagation();
                            }
                        }
                    });
                }
                if (settings.delegate) {
                    if (settings.change) {
                        $fieldGroup.on('change', ':editable', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.input) {
                        //TODO implement inputTimeout
                        $fieldGroup.on('input', ':editable', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.keypress) {
                        $fieldGroup.on('keypress', ':editable', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.blur) {
                        $fieldGroup.on('blur', ':editable', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.focus) {
                        $fieldGroup.on('focus', ':editable', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                } else {
                    if (settings.change) {
                        $fieldGroup.find(':editable').on('change', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.input) {
                        $fieldGroup.find(':editable').on('input', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.keypress) {
                        $fieldGroup.find(':editable').on('keypress', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.blur) {
                        $fieldGroup.find(':editable').on('blur', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.focus) {
                        $fieldGroup.find(':editable').on('focus', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                }
            });
        },
        validateFieldGroup: function(options) {
            var settings = $.validate.setupSettings(options);
            var validated = true;
            this.each(function() {
                var $fieldGroup = $(this), validFieldGroup = true;
                $fieldGroup.find(':editable').each(function() {
                    var $field = $(this);
                    if ($field.validate('doValidation', settings)) {
                    } else {
                        validated = false;
                        validFieldGroup = false;
                    }
                });
                if (validFieldGroup) {
                    settings.onValid.call($fieldGroup);
                } else {
                    settings.onInvalid.call($fieldGroup);
                }
            });
            return validated;
        },
        doValidation: function(options) {
            var validated = true;
            var settings = $.validate.setupSettings(options);
            this.each(function() {
                var validField = true;
                var $field = $(this);
                var errors = [];
                var dataValidate = $.trim($field.data('validate'));
                var validationRules = dataValidate.split(/[, ;]+/);
                if (/\brequired\b/.test(dataValidate) && !$field.val()) {
                    validated = false;
                    validField = false;
                    errors.push(settings.messages.required);
                }
                var match;
                if (match = dataValidate.match(/\brequired-if\[(.*?)\]/)) {
                    var conditionals = match[1].split(/[, ;]+/);
                    var mustBeRequired = true;
                    var conditionalMessages = [];
                    $.each(conditionals, function(index, conditional) {
                        if (typeof settings.rules[conditional] === 'function') {
                            conditionalMessages.push(settings.messages[conditional]);
                            if (!settings.rules[conditional].call($field[0])) {
                                mustBeRequired = false;
                                return false;
                            }
                        }
                    });
                    if (mustBeRequired && !$field.val()) {
                        validated = false;
                        validField = false;
                        errors.push(settings.messages['required-if']).concat(conditionalMessages);
                    }
                }
                $.each(validationRules, function(index, validationRule) {
                    if (typeof settings.rules[validationRule] === 'function') {
                        if (!settings.rules[validationRule].call($field[0])) {
                            validated = false;
                            validField = false;
                            errors.push(settings.messages[validationRule]);
                        }
                    }
                });
                settings.eachField();
                if (validField) {
                    if (settings.removeErrors) {
                        $field.validate('removeErrors', settings);
                    }
                    settings.eachValidField();
                } else {
                    if (settings.showErrors) {
                        $field.validate('showErrors', errors, settings);
                    }
                    settings.eachInvalidField();
                }
            });
            return validated;
        },
        showErrors: function(errors, options) {
            var settings = $.validate.setupSettings(options);
            if (typeof settings.showErrors === 'function') {
                return this.each(function() {
                    settings.showErrors.call(this, errors, settings);
                });
            }
            return this.each(function() {
                var $field = $(this);
                $.each(errors, function(index, error) {
                    if (error) {
                        $field.after('<' + settings.errorMessageTagName + ' class="' + settings.errorMessageClass + '">' + error + '</' + settings.errorMessageTagName + '>');
                    }
                });
            });
        },
        removeErrors: function(options) {
            var settings = $.validate.setupSettings(options);
            if (typeof settings.removeErrors === 'function') {
                return this.each(function() {
                    settings.removeErrors.call(this, settings);
                });
            }
            return this.each(function() {
                var $field = $(this);
                $field.nextAll(settings.errorMessageTagName + '.' + settings.errorMessageClass).remove();
            });
        }
    };

    $.fn.validate = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.validate');
        }
    };
})(jQuery);