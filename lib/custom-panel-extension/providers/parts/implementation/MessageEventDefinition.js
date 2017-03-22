'use strict';
var eventDefinitionReference = require('./EventDefinitionReference'),
    elementReferenceProperty = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/ElementReferenceProperty');


module.exports = function(group, element, bpmnFactory, messageEventDefinition, intermediateMessagesList) {

  group.entries = group.entries.concat(eventDefinitionReference(element, messageEventDefinition, bpmnFactory, {
    label: 'Message',
    description: 'Configure the message element',
    elementName: 'message',
    elementType: 'bpmn:Message',
    referenceProperty: 'messageRef',
    newElementIdPrefix: 'Message_'
  }, intermediateMessagesList));

/*  Uncomment to show "Message Name"
  group.entries = group.entries.concat(elementReferenceProperty(element, messageEventDefinition, bpmnFactory, {
    id: 'message-element-name',
    label: 'Message Name',
    referenceProperty: 'messageRef',
    modelProperty: 'name',
    shouldValidate: true
  }));
*/
};
