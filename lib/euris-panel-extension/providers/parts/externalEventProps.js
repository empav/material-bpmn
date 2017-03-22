'use strict';
var is = require('bpmn-js/lib/util/ModelUtil').is,
    message = require('./implementation/MessageEventDefinition'),
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    properties = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Properties'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper'),
    eventDefinitionReference = require('./implementation/EventDefinitionReference'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

function ensureFormKeyAndDataSupported(element) {

    var events = [
        'bpmn:StartEvent',
        'bpmn:EndEvent',
        'bpmn:IntermediateThrowEvent',
        'bpmn:BoundaryEvent',
        'bpmn:IntermediateCatchEvent',
        'bpmn:ReceiveTask'
    ];

    for(var i = 0; i < events.length; i++) {
        if (is(element, events[i])) {
            return true;
        }
    };

    return false;
}

module.exports = function(group, element, bpmnFactory, workbench) {

    if (!ensureFormKeyAndDataSupported(element)) {
        return;
    }

    var messageEventDefinition = eventDefinitionHelper.getMessageEventDefinition(element);
    group.entries.push(properties(element, bpmnFactory, {
        id: 'events',
        modelProperties: [ 'name', 'value' ],
        labels: [ 'Name', 'Value' ],

        getParent: function(element, node) {
            var bo = getBusinessObject(element);
            return bo.extensionElements;
        },

        createParent: function(element) {
            var bo = getBusinessObject(element);
            var parent = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
            var cmd = cmdHelper.updateProperties(element, { extensionElements: parent });
            return {
                cmd: cmd,
                parent: parent
            };
        }
    }));

    if (messageEventDefinition) {
        message(group, element, bpmnFactory, messageEventDefinition,workbench.intermediateMessagesList);
    }
};
