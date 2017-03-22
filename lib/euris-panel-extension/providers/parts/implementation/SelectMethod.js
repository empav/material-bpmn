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

var selector = 'select[name=selectedElement]';

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
 * Get find position in methods of element with given source .
 *
 * @param {source} the given source
 *
 * @return {methods} the array of activePortfolios
 */
function mapping(name, methods) {
    for(var i in methods){
        if (methods[i].name == name) {
            return i;
        }
    }
    return undefined;
}

/**
 * Get select box containing all elements.
 *
 * @param {DOMElement} node
 *
 * @return {DOMElement} the select box
 */
function getSelectBox(node) {
  return domQuery(selector, node.parentElement);
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
  return find(elements, function(element) {
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
module.exports = function (element, bpmnFactory, options, workbench) {
  var elementName       = options.elementName || '',
      elementType       = options.elementType,
      modelProperty       = 'selectedElement',
      referenceProperty = options.referenceProperty,
      newElementIdPrefix = options.newElementIdPrefix || 'elem_';
  var label       = options.label || '',
      description = options.description || '';
  var entries = [];
    var methods = [];

  entries.push({

    id: 'event-definitions-' + elementName,
    description: description,
    html: '<div class="bpp-row bpp-select">' +
            '<label for="camunda-' + elementName + '-select">' + label + '</label>' +
            '<div class="bpp-field-wrapper">' +
                 '<select id="camunda-' + elementName + '-select" name="selectedElement" data-value>' +
                '</select>' +
            '</div>' +
           '</div>',

    get: function(element, entryNode) {
        var selectBox = getSelectBox(entryNode);
        var selectedSection = domQuery('#camunda-section-select', entryNode.parentElement);
        var section = selectedSection ? getValue(selectedSection) : '';

        // var selectorName =  '#camunda-' + elementName + '-select';
        // var selectorElement = domQuery(selectorName, entryNode.parentElement);
        // var selectedElement = selectorElement ? getValue(selectorElement) : '';
        var bo = getBusinessObject(element);
        var selectedMethodFromXML = '';
        if ( bo.extensionElements && bo.extensionElements.values && bo.extensionElements.values[0] && bo.extensionElements.values[0].values && bo.extensionElements.values[0].values[2]) {
            // bo.extensionElements.values[0].values[2] correspond to selected section
            var section = bo.extensionElements.values[0].values[2].value;
            var sectionForm = selectedSection ? getValue(selectedSection) : section;
            section = (sectionForm != '') ? sectionForm : section;

            // Se la sezione è vuota non serve richiamare il servizio
            if ( !section || section == '' ){
                return;
            }

            workbench.portfolioServices.getOperations(section).then(function (response) {
                methods = response.operations;
                // bo.extensionElements.values[0].values[3] Correspond to name_method
                if ( bo.extensionElements && bo.extensionElements.values && bo.extensionElements.values[0] && bo.extensionElements.values[0].values && bo.extensionElements.values[0].values[3]) {
                    selectedMethodFromXML = bo.extensionElements.values[0].values[3].value;
                }

                // Seleziono la select e la svuoto per sicurezza
                selectBox.innerHTML = "";

                // Così inserisco delle options ricevute da fuori
                var selectedFound = false;
                for (var j in methods) {
                    var optionString = '<option value="' + methods[j].name + '" ';
                    if (selectedMethodFromXML == methods[j].name) {
                        optionString += 'selected="selected" ';
                        selectedFound = true;
                    }
                    optionString += '> ' + methods[j].name + '</option>';
                    var optionTemplate = domify(optionString);
                    selectBox.append(optionTemplate);
                }
                if (!selectedFound) {
                    selectBox.append(domify('<option value="" selected="selected"> </option>'));
                }

                return {
                    selectedElement: selectedMethodFromXML
                };
            }).catch(function (error) {
                console.error("ERROR", error);
            });
        }
    },

    set: function(element, values) {
        var nameMetod = values.selectedElement;
        var bo = getBusinessObject(element);
        var sourcePortfolio = bo.extensionElements.values[0].values[1].value;
        var nameSection = bo.extensionElements.values[0].values[2].value;
        var commands = [];

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
        propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'task_type',        value: elementType}, formCamundaProperties, bpmnFactory));
        propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_portfolio', value: sourcePortfolio }, formCamundaProperties, bpmnFactory));
        propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'source_area',      value: nameSection     }, formCamundaProperties, bpmnFactory));
        propertiesToAdd.push(elementHelper.createElement('camunda:Property', { name: 'name_method',      value: nameMetod       }, formCamundaProperties, bpmnFactory));
        commands.push(cmdHelper.addElementsTolist(element, formCamundaProperties, 'values', propertiesToAdd));
        return commands;
    }
  });

  return entries;
};
