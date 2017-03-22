'use strict';

var domQuery = require('min-dom/lib/query');

var entryFieldDescription = require('cmmn-js-properties-panel/lib/factory/EntryFieldDescription');

var dateInputPicker = function(options, defaultParameters) {
    // Default action for the button next to the input-field
    var defaultButtonAction = function(element, inputNode) {
        var amount    = document.querySelector('#camunda-amount');
        amount.value = null;
/*
        var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
        input.value = '';
*/

        return true;
    };

    var intervalButtonAction = function(element, inputNode) {
        var intervals = document.querySelector('#camunda-intervals');
        intervals.value = null;

        return true;
    };

    var amountButtonAction = function(element, inputNode) {
        var amount    = document.querySelector('#camunda-amount');
        amount.value = null;

        return true;
    };


    // default method to determine if the button should be visible
    var defaultButtonShow = function(element, inputNode) {
        var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
        return input? (input.value !== '') : true;
    };

    var intervalsButtonShow = function(element, inputNode) {
        var input = domQuery('input[name="intervals"]', inputNode);
        return input? (input.value !== '') : true;
    };

    var amountButtonShow = function(element, inputNode) {
        var input = domQuery('input[name="amount"]', inputNode);
        return input? (input.value !== '') : true;
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
        '<label for="camunda-date" >Start date:</label><br/>' +
        '<input id="camunda-date" type="datetime-local" name="date" ' +
        ' /><br/>' +
        '<label for="camunda-intervals" >Intervals</label><br/>' +
        '<input id="camunda-intervals" type="number" name="intervals" ' +
        ' /><br/>' +
        '<label for="camunda-time-unit" >Time unit</label><br/>' +
        '<select id="camunda-time-unit" name="timeUnit">' +
        '<option value="M">Minutes</option>' +
        '<option value="D">Days</option>' +
        '</select>' +
        '<label for="camunda-amount" >Amount</label><br/>' +
        '<input id="camunda-amount" type="number" name="amount" ' +
        ' />' +
        '<input id="camunda-' + resource.id + '" type="hidden" name="' + options.modelProperty+'" ' +
        ' />' +
        '<button class="intervals ' + actionName + '" data-action="intervals" data-show="showIntervals" ' +
        (canBeDisabled ? 'data-disabled="isDisabled"' : '') + '>' +
        '<span>' + buttonLabel + '</span>' +
        '</button>' +
        '<button class="amountCycle ' + actionName + '" data-action="amountCycle" data-show="showAmountCycle" ' +
        (canBeDisabled ? 'data-disabled="isDisabled"' : '') + '>' +
        '<span>' + buttonLabel + '</span>' +
        '</button>' +
        '</div>';

    resource[actionName] = actionMethod;
    resource[showName] = showMethod;

    resource["amountCycle"] = amountButtonAction;
    resource["showAmountCycle"] = amountButtonShow;

    resource["intervals"] = intervalButtonAction;
    resource["showIntervals"] = intervalsButtonShow;

    if (canBeDisabled) {
        resource.isDisabled = function() {
            return !options.disabled.apply(resource, arguments);
        };
    }

    resource.cssClasses = ['bpp-textfield'];

    return resource;
};

module.exports = dateInputPicker;
