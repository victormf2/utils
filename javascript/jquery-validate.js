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
        //Function to be executed on form submit when field group is valid
        onValid: $.noop,
        //Function to be executed on form submit when field group is invalid
        onInvalid: $.noop,
        //Wheter event handlers will be delegated or not (less performance)
        //It's good to use this option if you wish to validate on every field change,
        //but the form fields are generated dinamically, so you don't have to recall
        //the validate method everytime
        delegate: false,
        rules: {
            digit: function() {
                return /^\d+$/.test($(this).val());
            },
            email: function() {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
                        .test($(this).val());
            }
        },
        messages: {
            "(default)": 'Invalid field',
            required: 'Required field',
            "required-if": 'Required field when: '
        },
        setupSettings: function(options) {
            return $.extend(true, {}, $.validate, options);
        },
        message: function(message, field, params) {
            if (typeof message === 'function') {
                return message.call(field, params);
            }
            return message || this.messages['(default)'];
        }
    };
    var methods = {
        init: function(options) {
            var settings = $.validate.setupSettings(options);
            return this.each(function() {
                var $fieldGroup = $(this), $form = $fieldGroup.closest('form');
                if (settings.submit) {
                    $form.off('submit.validate');
                    $form.on('submit.validate', function(event) {

                        if ($fieldGroup.validate('validateFieldGroup', settings)) {
                            if (settings.ajax) {
                                event.preventDefault();
                                if (settings.stopImmediatePropagation) {
                                    event.stopImmediatePropagation();
                                } else if (settings.stopPropagation) {
                                    event.stopPropagation();
                                }
                            }
                            settings.onValid.call($fieldGroup);
                        } else {
                            event.preventDefault();
                            if (settings.stopImmediatePropagation) {
                                event.stopImmediatePropagation();
                            } else if (settings.stopPropagation) {
                                event.stopPropagation();
                            }
                            settings.onInvalid.call($fieldGroup);
                        }
                    });
                }
                var $fields = $fieldGroup.validate('getFields', settings);
                if (settings.delegate) {
                    if (settings.change) {
                        $fieldGroup.off('change.validate');
                        $fieldGroup.on('change.validate', $fields, function(event) {
                            $(event.target).validate('doValidation', settings);
                        });
                    }
                    if (settings.input) {
                        //TODO implement inputTimeout
                        $fieldGroup.off('input.validate');
                        $fieldGroup.on('input.validate', $fields, function(event) {
                            $(event.target).validate('doValidation', settings);
                        });
                    }
                    if (settings.keypress) {
                        $fieldGroup.off('keypress.validate');
                        $fieldGroup.on('keypress.validate', $fields, function(event) {
                            $(event.target).validate('doValidation', settings);
                        });
                    }
                    if (settings.blur) {
                        $fieldGroup.off('blur.validate');
                        $fieldGroup.on('blur.validate', $fields, function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.focus) {
                        $fieldGroup.off('focus.validate');
                        $fieldGroup.on('focus.validate', $fields, function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                } else {
                    if (settings.change) {
                        $fields.off('change.validate');
                        $fields.on('change.validate', function() {
                            $(this).validate('doValidation', settings);
                        });
                    }
                    if (settings.input) {
                        $fields.off('input.validate');
                        $fields.on('input.validate', function() {
                            $(this).validate('doValidation', settings);
                        });
                    }
                    if (settings.keypress) {
                        $fields.off('keypress.validate');
                        $fields.on('keypress.validate', function() {
                            $(this).validate('doValidation', settings);
                        });
                    }
                    if (settings.blur) {
                        $fields.off('blur.validate');
                        $fields.on('blur.validate', function() {
                            $fieldGroup.validate('validateFieldGroup', settings);
                        });
                    }
                    if (settings.focus) {
                        $fields.off('focus.validate');
                        $fields.on('focus.validate', function() {
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
                var $fieldGroup = $(this)
                $fieldGroup.validate('getFields', settings).each(function() {
                    var $field = $(this);
                    if ($field.validate('doValidation', settings)) {
                    } else {
                        validated = false;
                    }
                });
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
                var validationRules = [];
                var reg = /[\w-]+(?:\(.*?\))?/g;
                var result = '';
                while ((result = reg.exec(dataValidate)) !== null) {
                    validationRules.push(result[0]);
                }
                if (/(?:\s|^)required(?:\s|$)/.test(dataValidate) && $field.validate('empty')) {
                    validated = false;
                    validField = false;
                    errors.unshift(settings.messages.required);
                }
                var match;
                if (match = dataValidate.match(/(?:\s|^)required-if\((.*?)\)/)) {
                    var conditionals = match[1].split(/[, ;]+/);
                    var mustBeRequired = true;
                    var conditionalMessages = [];
                    $.each(conditionals, function(index, conditional) {
                        if (typeof settings.rules[conditional] === 'function') {
                            conditionalMessages.unshift($.validate.message.call(settings, settings.messages[conditional], $field[0]));
                            if (!settings.rules[conditional].call($field[0])) {
                                mustBeRequired = false;
                                return false;
                            }
                        }
                    });
                    if (mustBeRequired && $field.validate('empty')) {
                        validated = false;
                        validField = false;
                        errors.unshift(settings.messages['required-if']);
                        errors = conditionalMessages.concat(errors);
                    }
                }
                if (validField && !$field.validate('empty')) {
                    $.each(validationRules, function(index, validationRule) {
                        var params = [];
                        var match = validationRule.match(/([^()]*)(?:\((.*)\))?/);
                        validationRule = match[1];
                        var params = match[2];
                        if (typeof settings.rules[validationRule] === 'string') {
                            validationRule = settings.rules[validationRule];
                        }
                        if (typeof settings.rules[validationRule] === 'function') {
                            if (!settings.rules[validationRule].call($field[0], params)) {
                                validated = false;
                                validField = false;
                                errors.unshift($.validate.message.call(settings, settings.messages[validationRule], $field[0], params));
                            }
                        }
                    });
                }
                settings.eachField();
                if (validField) {
                    $field.validate('removeErrors', settings);
                    settings.eachValidField.call($field[0]);
                } else {
                    $field.validate('showErrors', errors, settings);
                    settings.eachInvalidField.call($field[0]);
                }
            });
            return validated;
        },
        showErrors: function(errors, options) {
            this.validate('removeErrors', options);
            var settings = $.validate.setupSettings(options);
            if (!settings.showErrors) {
                return;
            }
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
            if (!settings.removeErrors) {
                return;
            }
            if (typeof settings.removeErrors === 'function') {
                return this.each(function() {
                    settings.removeErrors.call(this, settings);
                });
            }
            return this.each(function() {
                var $field = $(this);
                $field.nextAll(settings.errorMessageTagName + '.' + settings.errorMessageClass).remove();
            });
        },
        getFields: function(options) {
            var settings = $.validate.setupSettings(options);
            var $fields = this.find(':editable');
            if (settings.filter) {
                $fields = $fields.filter(settings.filter);
            }
            return $fields;
        },
        empty: function() {
            return !this.val();
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