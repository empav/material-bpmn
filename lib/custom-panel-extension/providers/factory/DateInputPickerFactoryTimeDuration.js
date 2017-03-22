'use strict';

var domQuery = require('min-dom/lib/query');

var entryFieldDescription = require('cmmn-js-properties-panel/lib/factory/EntryFieldDescription');

var dateInputPicker = function(options, defaultParameters) {

    // Default action for the button next to the input-field
    var defaultButtonAction = function(element, inputNode) {
        var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
        input.value = '';

        return true;
    };

    // default method to determine if the button should be visible
    var defaultButtonShow = function(element, inputNode) {
        var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
        return input.value !== '';
    };

    var resource = defaultParameters,
        label = options.label || resource.id,
        dataValueLabel = options.dataValueLabel,
        buttonLabel = ( options.buttonLabel || 'X' ),
        actionName = ( typeof options.buttonAction != 'undefined' ) ? options.buttonAction.name : 'clear',
        actionMethod = ( typeof options.buttonAction != 'undefined' ) ? options.buttonAction.method : defaultButtonAction,
        showName = ( typeof options.buttonShow != 'undefined' ) ? options.buttonShow.name : 'canClear',
        showMethod = ( typeof options.buttonShow != 'undefined' ) ? options.buttonShow.method : defaultButtonShow,
        canBeDisabled = !!options.disabled && typeof options.disabled === 'function';

    resource.html =
        '<label for="camunda-' + resource.id + '" ' +
        (canBeDisabled ? 'data-show="isDisabled" ' : '') +
        (dataValueLabel ? 'data-value="' + dataValueLabel + '"' : '') + '>'+ label +'</label>' +
        '<div class="bpp-field-wrapper" ' +
        (canBeDisabled ? 'data-show="isDisabled"' : '') +
        '>' +
        '<label for="camunda-' + resource.id + '" >Time unit</label><br/>' +
        '<select id="camunda-select-values" name="values">' +
        '<option value="M" selected="selected">Minutes</option>' +
        '<option value="D">Days</option>' +
        '</select>' +
        '<label for="camunda-' + resource.id + '">Amount</label><br>' +
        '<input id="camunda-' + resource.id + '" type="number" name="' + options.modelProperty+'" ' +
        ' />' +
        '<button class="amount ' + actionName + '" data-action="' + actionName + '" data-show="' + showName + '" ' +
        (canBeDisabled ? 'data-disabled="isDisabled"' : '') + '>' +
        '<span>' + buttonLabel + '</span>' +
        '</button>' +
        '</div>';

    resource[actionName] = actionMethod;
    resource[showName] = showMethod;

    if (canBeDisabled) {
        resource.isDisabled = function() {
            return !options.disabled.apply(resource, arguments);
        };
    }

    resource.cssClasses = ['bpp-textfield'];

    return resource;
};

module.exports = dateInputPicker;
