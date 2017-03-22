/**
 * Created by Bompadre on 09/02/2017.
 */

'use strict';
var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');
var JSON = require('json3');
var domQuery = require('min-dom/lib/query'),
    domify = require('min-dom/lib/domify'),
    propertiesBox = 'div[name=propertiesBox]',
    getExtensionElements = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements,
    forEach = require('lodash/collection/forEach'),
    find = require('lodash/collection/find');

var elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

/**
 * Get find position in getValue of element with given source .
 *
 * @param {source} the given source
 *
 * @return {value} the value of selectedElement
 */

function getValue(selectorElement) {
    return selectorElement.options[selectorElement.selectedIndex] ? selectorElement.options[selectorElement.selectedIndex].value : '';
}

/**
 * Create an entry to modify the reference to an element from an
 * event definition.
 *
 * @param  {djs.model.Base} element
 * @param  {BpmnFactory} bpmnFactory
 * @param  {Object} options
 * @param  {string} options.label the label of the entry
 * @param  {string} options.description the description of the entry
 * @param  {string} options.elementName the name of the element
 * @param  {string} options.elementType the type of the element
 * @param  {string} options.referenceProperty the name of referencing property
 * @param  {string} options.newElementIdPrefix the prefix of a new created element
 *
 * @return {Array<Object>} return an array containing the entries
 */

module.exports = function (element, bpmnFactory, options, workbench) {
    var elementName       = options.elementName || '',
        elementType       = options.elementType,
        referenceProperty = options.referenceProperty;
    var newElementIdPrefix = options.newElementIdPrefix || 'elem_';
    var label       = options.label || '',
        description = options.description || '';
    var entries = [];
    var parameters = [];


    entries.push({
        id: 'event-definitions-' + elementName,
        description: description,
        html: '<div class="bpp-row">' +
        '<div class="bpp-field-wrapper" name="propertiesBox">' +
        '</div>' +
        '</div>',

        get: function (element, entryNode) {
            var bo = getBusinessObject(element);
            if (bo.extensionElements && bo.extensionElements.values && bo.extensionElements.values[0] && bo.extensionElements.values[0].values[3] && bo.extensionElements.values[0].values[3].value) {
                // bo.extensionElements.values[0].values[3] correspond to source method
                var sourceMethod = bo.extensionElements.values[0].values[3].value;

                var selectedMethod = document.querySelector('#camunda-method-select');
                var sourceMethodForm = selectedMethod ? getValue(selectedMethod) : '';

                sourceMethod = (sourceMethodForm != '') ? sourceMethodForm : sourceMethod;

                // Se il metodo è vuota non serve richiamare il servizio
                if ( !sourceMethod || sourceMethod == '' ){
                    return;
                }

                //Getting active sections
                workbench.portfolioServices.getParameters(bo.extensionElements.values[0].values[2].value + '/' + sourceMethod).then(function (response) {
                    // var methods = activePortfolios[i].methods;
                    parameters = response.parameters;
                    var parametersFromXML = [];
                    var box = domQuery(propertiesBox, entryNode.parentElement);
                    box.innerHTML = "";
                    box.returnValues = {};

                    if (parameters && parameters.length > 0) {
                        var optionString = '<label for="camunda-' + elementName + '">' + label + '</label>';
                        var optionTemplate = domify(optionString);
                        box.append(optionTemplate);

                        for (var j in parameters) {
                            optionString =
                                '<div class="bpp-field-wrapper bpp-table-row" data-index="0">' +
                                '<div class="bpp-field-wrapper bpp-table-row">' +
                                '<label class="bpp-table-row-columns-1">' + parameters[j].label + '</label>' +
                                '</div>' +
                                '<div class="bpp-field-wrapper bpp-table-row">' +
                                '<input class="bpp-table-row-columns-1" id="camunda-table-row-cell-input-value" type="text" name="' + parameters[j].name + '" data-value="" />' +
                                '</div>' +
                                '</div>';
                            optionTemplate = domify(optionString);
                            box.append(optionTemplate);
                            box.returnValues [parameters[j].parameterName] = parametersFromXML.length > 0 ? parametersFromXML[j].value : parameters[j].parameterType;
                        }
                    }
                    return box.returnValues;
                }).catch(function (error) {
                    console.error("ERROR", error);
                });
            }
        },
        set: function (element, values) {
            // TODO: Per ora i campi dei parametri sono abbozzati
            // TODO: Verificare cosa si voglia editare con questi campi una volta sentito il BE
            /*
            var props = {};
            var commands = [];
            var bo = getBusinessObject(element);
            var selectedPortfolio = document.querySelector('#camunda-section-select');
            var i = (selectedPortfolio && selectedPortfolio.value ) ? selectedPortfolio.value : 0;
            var selectedMethod = document.querySelector('#camunda-method-select');
            var j = (selectedMethod && selectedMethod.value ) ? selectedMethod.value : 0;
            var method = activePortfolios[i].methods[j];

            //set properties
            var extensionElements = bo.extensionElements;
            if(!extensionElements){
                //create bpmn:ExtensionElements
                extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
            }

            var formCamundaProperties = getExtensionElements(bo, 'camunda:Properties');
            if(!formCamundaProperties) {
                //create camunda:Properties
                formCamundaProperties = elementHelper.createElement('camunda:Properties', {
                    id: 'formCamundaProperties',
                    values: []
                }, extensionElements, bpmnFactory);
                commands.push(cmdHelper.addElementsTolist(element, extensionElements, 'values', [formCamundaProperties]));
            }else if(formCamundaProperties.length > 0){
                //first array of properties (always one to be)
                formCamundaProperties = formCamundaProperties[0];
            }

            formCamundaProperties.values  = []; //reset properties

            var propertiesToAdd = [];
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'task_type', value: elementType}, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_portfolio', value: '' }, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_area', value: activePortfolios[i].source}, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_method', value: method.source }, formCamundaProperties, bpmnFactory));
            commands.push(cmdHelper.addElementsTolist(element, formCamundaProperties, 'values', propertiesToAdd));
            if(values){
                for (var nameProp in values) {
                    propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: nameProp, value: values[nameProp]}, formCamundaProperties, bpmnFactory));
                }
            }

            return commands;*/
        }
    });

    return entries;

};
