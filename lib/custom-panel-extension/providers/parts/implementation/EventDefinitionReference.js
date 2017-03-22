'use strict';
var className = 'it.custom.insurance.platform.process.event.listener.RegisterExternalEventListener';

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
 * event definition.
 *
 * @param  {djs.model.Base} element
 * @param  {ModdleElement} definition
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
module.exports = function(element, definition, bpmnFactory, options, intermediateMessagesList) {

  var elementName       = options.elementName || '',
      elementType       = options.elementType,
      referenceProperty = options.referenceProperty;

  var newElementIdPrefix = options.newElementIdPrefix || 'elem_';

  var label       = options.label || '',
      description = options.description || '';
  var entries = [];
  var oldSelectedElement = null;

  var replacing = function(selection){
      return selection.replace("message_", "");
  }

  var mapping = function(intermediateMessagesList,selection){
      selection = replacing(selection);
      var selectionMap = "";
      for(var i in intermediateMessagesList){
          if(intermediateMessagesList[i].id == selection){
              selectionMap = intermediateMessagesList[i].eventName;
              return selectionMap;
          }
      }
      return selectionMap;
  }

    var idGeneration = function(selection){
        return 'message_'+selection;
    }

  entries.push({

    id: 'event-definitions-' + elementName,
    description: description,
    html: '<div class="bpp-row bpp-select">' +
             '<label for="camunda-' + elementName + '">' + label + '</label>' +
             '<div class="bpp-field-wrapper">' +
               '<select id="camunda-' + elementName + '" name="selectedElement" data-value>' +
               '</select>' +
             '</div>' +
          '</div>',

    get: function(element, entryNode) {
      utils.updateOptionsDropDown(selector, definition, elementType, entryNode);
      var reference = definition.get(referenceProperty);
      var selectBox = getSelectBox(entryNode);

      // Seleziono la select e la svuoto per sicurezza
      selectBox.innerHTML = "";

      // Così inserisco delle options ricevute da fuori
      for(var i in intermediateMessagesList){
          var optionString = '<option value="'+ idGeneration(intermediateMessagesList[i].id) + '" ';
            optionString += '> ' + intermediateMessagesList[i].eventName + ' (id=' + idGeneration(intermediateMessagesList[i].id) + ' )' + '</option>';
          var optionTemplate = domify(optionString);
          selectBox.append(optionTemplate);
      }

      return {
        selectedElement: (reference && reference.id) || ''
      };
    },

    set: function(element, values) {
      var selection = values.selectedElement;
      var props = {};
      var commands = [];
      var root = utils.getRoot(definition);

      //set properties
      var bo = getBusinessObject(element);
      var extensionElements = bo.extensionElements;
      if(!extensionElements){
          //create bpmn:ExtensionElements
          extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
          commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
      }

      var camundaExecutionListener = getExtensionElements(bo, 'camunda:ExecutionListener');
      if(!camundaExecutionListener) {
          //create camunda:ExecutionListener
          camundaExecutionListener = elementHelper.createElement('camunda:ExecutionListener', {
              id: 'camundaExecutionListener',
              values: []
          }, extensionElements, bpmnFactory);
          commands.push(cmdHelper.addElementsTolist(element, extensionElements, 'values', [camundaExecutionListener]));
          commands.push(cmdHelper.updateBusinessObject(element, camundaExecutionListener, {'class': className, 'event':'start'}));
      }else if(camundaExecutionListener.length > 0){
          //first array of properties (always one to be)
          camundaExecutionListener = camundaExecutionListener[0];
      }

      //create camunda:Field
      var camundaField = elementHelper.createElement('camunda:Field', { id: 'camundaField', values: [] }, extensionElements, bpmnFactory);
      commands.push(cmdHelper.addElementsTolist(element, camundaExecutionListener, 'fields', [ camundaField ]));
      commands.push(cmdHelper.updateBusinessObject(element, camundaField, {'name': 'messageId' }));
      commands.push(cmdHelper.updateBusinessObject(element, camundaField, {'string': replacing(selection) }));

      var camundaField = elementHelper.createElement('camunda:Field', { id: 'camundaField', values: [] }, extensionElements, bpmnFactory);
      commands.push(cmdHelper.addElementsTolist(element, camundaExecutionListener, 'fields', [ camundaField ]));
      commands.push(cmdHelper.updateBusinessObject(element, camundaField, {'name': 'messageName' }));
      commands.push(cmdHelper.updateBusinessObject(element, camundaField, {'string': mapping(intermediateMessagesList,selection) }));

      var selectedElement = findElementById(definition, elementType, selection);
      if (!selectedElement) {
        var root = utils.getRoot(definition);

        // create a new element
        selectedElement = elementHelper.createElement(elementType, { name: mapping(intermediateMessagesList,selection) }, root, bpmnFactory);
        selectedElement.id = selection;
        commands.push(cmdHelper.addAndRemoveElementsFromList(element, root, 'rootElements', null, [ selectedElement ]));
      }

      // update reference to element
      props[referenceProperty] = selectedElement;
      commands.push(cmdHelper.updateBusinessObject(element, definition, props));

      oldSelectedElement = selectedElement;
      return commands;
    }

  });

  return entries;

};
