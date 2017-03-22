'use strict';
var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');
var JSON = require('json3');
var domQuery = require('min-dom/lib/query'),
    domify = require('min-dom/lib/domify'),

    getExtensionElements = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements,
    domAttr = require('min-dom/lib/attr');

var forEach = require('lodash/collection/forEach'),
    find = require('lodash/collection/find');

var elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper');
var utils = require('bpmn-js-properties-panel/lib/Utils');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var selector = 'select[name=selectedSection]';


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
 * Find element by given id.
 *
 * @param {ModdleElement} eventDefinition
 *
 * @return {ModdleElement} an element
 */
function findElementById(eventDefinition, type, id) {
    var elements = utils.findRootElementsByType(eventDefinition, type);
    return find(elements, function (element) {
        return element.id === id;
    });
}

/**
 * Create an entry to modify the reference to an element from an
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
module.exports = function (element, bpmnFactory, options, activePortfolios) {
    var elementName = options.elementName || '',
        elementType = options.elementType,
        modelProperty = 'selectedPortfolio',
        referenceProperty = options.referenceProperty,
        newElementIdPrefix = options.newElementIdPrefix || 'elem_';
    var label = options.label || '',
        description = options.description || '';
    var entries = [];

    entries.push({

        id: 'event-definitions-' + elementName,
        description: description,
        html: '<div class="bpp-row bpp-select">' +
        '<label for="camunda-' + elementName + '-select">' + label + '</label>' +
        '<div class="bpp-field-wrapper">' +
        '<select id="camunda-' + elementName + '-select" name="' + modelProperty + '" data-value>' +
        '<option value=""></option>' +
        '</select>' +
        '</div>' +
        '</div>',

        get: function (element, entryNode) {
            console.log(entryNode);
            var selectorName = '#camunda-' + elementName + '-select';
            var selectorElement = domQuery(selectorName, entryNode.parentElement);
            var selectedPortfolio = selectorElement ? getValue(selectorElement) : '';
            var bo = getBusinessObject(element);
            var selectedPortfolioFromXML = '';
            // bo.extensionElements.values[0].values[1] Correspond to source_portfolio
            if (bo.extensionElements && bo.extensionElements.values && bo.extensionElements.values[0] && bo.extensionElements.values[0].values[1] && bo.extensionElements.values[0].values[1].value) {
                selectedPortfolioFromXML = bo.extensionElements.values[0].values[1].value, activePortfolios;
            }

            // Seleziono la select e la svuoto per sicurezza
            selectorElement.innerHTML = "";
            //
            // Così inserisco delle options ricevute da fuori
            console.log(activePortfolios);
            for (var j in activePortfolios) {
                if (activePortfolios[j].name) {
                    var optionString = '<option value="' + activePortfolios[j].name + '" ';
                    optionString += (selectedPortfolioFromXML == activePortfolios[j].name ) ? 'selected="selected" ' : '';
                    optionString += '> ' + activePortfolios[j].name + '</option>';
                    var optionTemplate = domify(optionString);
                    selectorElement.append(optionTemplate);
                }
            }
            var returnElement = (selectedPortfolio == "") ? selectedPortfolioFromXML : selectedPortfolio

            return {
                selectedPortfolio: returnElement
            };
        },

        set: function (element, values) {
            var selectedPortfolio = values.selectedPortfolio;
            var bo = getBusinessObject(element);
            var commands = [];

            //set properties
            var extensionElements = bo.extensionElements;
            if (!extensionElements) {
                //create bpmn:ExtensionElements
                extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {values: []}, bo, bpmnFactory);
                commands.push(cmdHelper.updateProperties(element, {extensionElements: extensionElements}));
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
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_portfolio', value: selectedPortfolio }, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_area', value: ''}, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_method', value: ''}, formCamundaProperties, bpmnFactory));
            commands.push(cmdHelper.addElementsTolist(element, formCamundaProperties, 'values', propertiesToAdd));
            return commands;
        }
    });

    return entries;
};
