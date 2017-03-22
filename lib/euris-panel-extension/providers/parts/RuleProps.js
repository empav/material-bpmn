'use strict';

var ruleProperties = require('./implementation/RuleProperties'),
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    customEntryFactory = require('../factory/CustomEntryFactory'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    processVariablesHelper = require('../helpers/ProcessVariablesHelper'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    getExtensionElements = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements,
    is = require('bpmn-js/lib/util/ModelUtil').is;


function ensureFormKeyAndDataSupported(element) {
    return is(element, 'bpmn:ServiceTask');
}

function setRuleObject(ruleId, ruleList, bo) {
    if(ruleId){
        for(var i = 0; i<ruleList.length; i++){
            if(ruleId == ruleList[i].id){
                bo.ruleObject = ruleList[i];
                break;
            }
        }
    }
}

function formatFields(bo){
    var fieldForInterface = [];

    var formCamundaProperties = getExtensionElements(bo, 'camunda:Properties')[0];
    if(formCamundaProperties && formCamundaProperties.values){
        angular.forEach(formCamundaProperties.values, function(ruleProperty){
            if(ruleProperty.name !== 'id_rule' && ruleProperty.name !== 'task_type'){
                fieldForInterface.push({
                    key: ruleProperty.name,
                    name: ruleProperty.name,
                    value: ruleProperty.value
                });
            }
        });
    }

    return fieldForInterface;
}

function extSetValue(referenceName, selectedField, element, bpmnFactory, commandLauncher){
    var commands = [];
    var bo = getBusinessObject(element);

    //get extension elements
    var extensionElements = bo.extensionElements;
    if(!extensionElements){
        //create bpmn:ExtensionElements
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
        commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
    }

    //get camunda properties
    var formCamundaProperties = getExtensionElements(bo, 'camunda:Properties');
    if(!formCamundaProperties) {
        //create camunda:Properties
        formCamundaProperties = elementHelper.createElement('camunda:Properties', {
            id: 'formCamundaProperties',
            values: []
        }, extensionElements, bpmnFactory);
        commands.push(cmdHelper.addElementsTolist(element, extensionElements, 'values', [formCamundaProperties]));
    }
    else if(formCamundaProperties.length > 0){
        //first array of properties (always one to be)
        formCamundaProperties = formCamundaProperties[0];
    }

    if(!formCamundaProperties.values){
        formCamundaProperties.values = [];
    }

    //manage new values
    for(var i=0; i< formCamundaProperties.values.length; i++){
        if(formCamundaProperties.values[i].name === selectedField.key){
            formCamundaProperties.values[i].value = referenceName;
        }
    }

    //execute command
    commands.push(cmdHelper.updateBusinessObject(element, formCamundaProperties, 'values', formCamundaProperties.values));
    commandLauncher.execute(commands);
}

module.exports = function (group, element, bpmnFactory, workbench) {

    if (!ensureFormKeyAndDataSupported(element)) {
        return;
    }
    var rules = workbench.rules;

    var bo = getBusinessObject(element);
    bo.allRules = rules;
    setRuleObject(bo.rule, rules, bo);

    processVariablesHelper.setServiceTaskRuleApplied(element, workbench.usedRulesByTask);

    var rulesSelect = rules.map(function (el) {
        return {
            value: el.id,
            name: el.name
        };
    });

    var dataObjectsSelect = workbench.currentResource.resourceDoList;

    if(!dataObjectsSelect){
        dataObjectsSelect = [];
    }

    // form type select box
    group.entries.push(entryFactory.selectBox({
        id: 'select-rule',
        label: 'Rule',
        selectOptions: rulesSelect,
        modelProperty: 'rule',
        get: function (element, node) {
            var bo = getBusinessObject(element);

            var selected = '';
            if(bo.rule){
                var fieldForInterface = formatFields(bo);

                var struttura = {
                    element: element,
                    workbench: workbench,
                    title: "Instance rule variables",
                    elements: fieldForInterface,
                    callbackSave: function (referenceName, selectedField, cmdLauncher) {
                        extSetValue(referenceName, selectedField, element, bpmnFactory, cmdLauncher)
                    }
                };
                window.instanceSettings.reinit(struttura);
                selected = bo.rule;
            }
            return {
                rule: selected
            };
        },
        set: function (element, values, node) {
            var bo = getBusinessObject(element);

            var commands = [];
            commands.push(cmdHelper.updateBusinessObject(element, bo, {'euris:rule': values.rule}));
            setRuleObject(values.rule, bo.allRules, bo);
            // getRuleObject(values.rule, rules, bo);

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
                 commands.push(cmdHelper.addElementsTolist(element, extensionElements, 'values',
                     [formCamundaProperties]));
            }else if(formCamundaProperties.length > 0){
                //first array of properties (always one to be)
                formCamundaProperties = formCamundaProperties[0];
            }

            formCamundaProperties.values  = []; //reset properties

            var propertiesToAdd = [];

            propertiesToAdd.push(elementHelper.createElement('camunda:Property',
                { name: 'task_type', value: 'rule_execution'}, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property',
                { name: 'id_rule', value: values.rule}, formCamundaProperties, bpmnFactory));
            propertiesToAdd.push(elementHelper.createElement('camunda:Property',
                { name: 'id_product_service', value: ''}, formCamundaProperties, bpmnFactory));

            if(bo.ruleObject.systemFields){
                for(var i=0; i< bo.ruleObject.systemFields.length; i++){
                    var sysName = '';
                    if(bo.ruleObject.systemFields[i].input){
                        sysName ='I_'+ bo.ruleObject.systemFields[i].name;
                        propertiesToAdd.push(elementHelper.createElement('camunda:Property',
                            { name: sysName, value: ''}, formCamundaProperties, bpmnFactory));
                    }
                    if(bo.ruleObject.systemFields[i].output){
                        sysName ='O_'+ bo.ruleObject.systemFields[i].name;
                        propertiesToAdd.push(elementHelper.createElement('camunda:Property',
                            { name: sysName, value: ''}, formCamundaProperties, bpmnFactory));
                    }
                }
            }

            commands.push(cmdHelper.addElementsTolist(element, formCamundaProperties, 'values', propertiesToAdd));
            return commands;
        }
    }));

    group.entries.push({
        id: 'rule_do_selection',
        html:  '<button class="doSelection" ' +
        'id="cam-rule_do_selection" ' +
        'data-action="openDoSelection"> ' +
        'Do Selection' +
        '</button>',
        openDoSelection: function (element, node) {
            var bo = getBusinessObject(element);

            if(bo.rule){
                var fieldForInterface = formatFields(bo);
                var struttura = {
                    element: element,
                    workbench: workbench,
                    title: "Instance rule variables",
                    elements: fieldForInterface,
                    callbackSave: function (referenceName, selectedField, cmdLauncher) {
                        extSetValue(referenceName, selectedField, element, bpmnFactory, cmdLauncher)
                    }
                };
                window.instanceSettings.load(struttura);
            }
        }
    });

    group.entries.push(ruleProperties(element, bpmnFactory, {
        id: 'properties',
        modelProperties: [ 'name', 'value'],
        labels: [ 'Name', 'Value'],
        dataObjects: dataObjectsSelect,

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
        },
        show : function(){
            return true; //funziona
        }
    }));



};
