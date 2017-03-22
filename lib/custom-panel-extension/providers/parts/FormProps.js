'use strict';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    getExtensionElements = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements,

    extensionElements = require('./implementation/ExtensionElements'),
    properties = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Properties'),
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    formHelper = require('../helpers/FormHelper'),
    processVariablesHelper = require('../helpers/ProcessVariablesHelper'),
    utils = require('bpmn-js-properties-panel/lib/Utils'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    find = require('lodash/collection/find'),
    buildSelectInstance = require('../helpers/DataObjectsHelper').buildSelectInstance;

function generateValueId() {
    return utils.nextId('Value_');
}

/**
 * Generate a form field specific textField using entryFactory.
 *
 * @param  {string} options.id
 * @param  {string} options.label
 * @param  {string} options.modelProperty
 * @param  {function} options.validate
 *
 * @return {Object} an entryFactory.textField object
 */
function formFieldTextField(options, getSelectedFormField) {

    var id = options.id,
        label = options.label,
        modelProperty = options.modelProperty,
        validate = options.validate;

    return entryFactory.textField({
        id: id,
        label: label,
        modelProperty: modelProperty,
        get: function(element, node) {

            var selectedFormField = getSelectedFormField(element, node) || {},
                values = {};

            values[modelProperty] = selectedFormField[modelProperty];

            return values;
        },

        set: function(element, values, node) {
            var commands = [];

            if (typeof options.set === 'function') {
                var cmd = options.set(element, values, node);

                if (cmd) {
                    commands.push(cmd);
                }
            }

            var formField = getSelectedFormField(element, node),
                properties = {};

            properties[modelProperty] = values[modelProperty];

            commands.push(cmdHelper.updateBusinessObject(element, formField, properties));

            return commands;
        },

        disabled: function(element, node) {
            return formHelper.isPredefinedForm(element) ||
                !getSelectedFormField(element, node);
        },
        validate: validate
    });
}

function ensureFormKeyAndDataSupported(element) {
    return (is(element, 'bpmn:StartEvent') && !is(element.parent, 'bpmn:SubProcess')) ||
        is(element, 'bpmn:UserTask');
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

    var formDataEntry = getExtensionElements(bo, 'camunda:FormData');

    if(!formDataEntry){
        var formData = elementHelper.createElement('camunda:FormData', { fields: [] }, extensionElements, bpmnFactory);
        commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            extensionElements,
            'values',
            'extensionElements',
            [ formData ],
            formDataEntry
        ));
    }else if(formDataEntry.length > 0){
        //first array of form data (always one to be)
        formDataEntry = formDataEntry[0];
    }

    for(var i=0; i< formDataEntry.fields.length;i++){
        //search form field by id vm.selectedField.id
        if(formDataEntry.fields[i].id === selectedField.key){
            formDataEntry.fields[i].instanceAttributeRef = referenceName;
        }
    }

    commands.push(cmdHelper.updateBusinessObject(element, formDataEntry, {
        fields: formDataEntry.fields
    }));

    commandLauncher.execute(commands);
}


module.exports = function(group, element, bpmnFactory, workbench) {


    if (!ensureFormKeyAndDataSupported(element)) {
        return;
    }

    // processVariablesHelper.setUserTaskDataObject(element, workbench.dataObjects);

    var dataObjectsSelect = workbench.currentResource.resourceDoList;

    var predefinedFormsMapped = workbench.predefinedForms.map(function (el) {
        return {
            value: el.resourceId,
            name: el.resourceName
        };
    });


    /**
     * Return the currently selected form field querying the form field select box
     * from the DOM.
     *
     * @param  {djs.model.Base} element
     * @param  {DOMElement} node - DOM element of any form field text input
     *
     * @return {ModdleElement} the currently selected form field
     */
    function getSelectedFormField(element, node) {
        var selected = formFieldsEntry.getSelected(element, node.parentNode);

        if (selected.idx === -1) {
            return;
        }

        return formHelper.getFormField(element, selected.idx);
    }

    //Radio form type: predefined or custom
    group.entries.push({
        id: 'formType',
        html: '<div class="bpp-row">'+
        '<div class="radio">'+
        '<label class="radio-inline">'+
        '<input type="radio" name="predefined"  value="true" data-value>'+
        'Predefined Form'+
        '</label>'+
        '</div>'+
        '<div class="radio">'+
        '<label class="radio-inline">'+
        '<input type="radio" name="predefined" value="false" data-value>'+
        'User Form'+
        '</label>'+
        '</div>'+
        '</div>',
        get: function (element, node) {
            var predefined = formHelper.isPredefinedForm(element);

            var fieldForInterface = [];
            var fields = formHelper.getFormFields(element);

            angular.forEach(fields, function(singleFormField){
                fieldForInterface.push({
                    key: singleFormField.id,
                    name: singleFormField.label,
                    value: singleFormField.instanceAttributeRef
                });
            });

            var struttura = {
                element: element,
                workbench: workbench,
                title: "Instance form fields",
                elements: fieldForInterface,
                callbackSave: function (referenceName, selectedField, cmdLauncher) {
                    extSetValue(referenceName, selectedField, element, bpmnFactory, cmdLauncher)
                }
            };

            window.instanceSettings.reinit(struttura);
            // window.instanceSettings.load();
            return {
                predefined: predefined.toString()
            };
        },
        set: function(element, values, node) {
            var bo = getBusinessObject(element);
            var commands = [];

            //create extensionElements
            var extensionElements = bo.get('extensionElements');
            if (!extensionElements) {
                extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
            }

            var formDataEntry = getExtensionElements(bo, 'camunda:FormData');

            if (values.predefined === "true") {
                commands.push(cmdHelper.updateBusinessObject(element, bo, {'custom:predefined': true}));

                if(formDataEntry) {
                    commands.push(cmdHelper.removeElementsFromList(element, extensionElements, 'values', 'extensionElements', formDataEntry));
                }
            }else{
                // Form Data is selected in the select box
                commands.push(cmdHelper.updateBusinessObject(element, bo, {'custom:predefined': false}));
                commands.push(cmdHelper.updateBusinessObject(element, bo, {'custom:formRef': ''}));

                if(!formDataEntry){
                    var formData = elementHelper.createElement('camunda:FormData', { fields: [] }, extensionElements, bpmnFactory);
                    commands.push(cmdHelper.addAndRemoveElementsFromList(
                        element,
                        extensionElements,
                        'values',
                        'extensionElements',
                        [ formData ],
                        formDataEntry
                    ));
                }
            }

            return commands;
        }
    });

    // [PredefinedForm] label
    group.entries.push(entryFactory.label({
        id: 'values-header-form-key',
        labelText: 'Predefined Form',
        divider: true,
        showLabel: function(element, node) {
            return formHelper.isPredefinedForm(element);
        }
    }));

    //[CustomFrom] label
    group.entries.push(entryFactory.label({
        id: 'values-header-form-data',
        labelText: 'Form Fields',
        divider: true,
        showLabel: function(element, node) {
            return !formHelper.isPredefinedForm(element);
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

            var fieldForInterface = [];
            var fields = formHelper.getFormFields(element);

            angular.forEach(fields, function(singleFormField){
                fieldForInterface.push({
                    key: singleFormField.id,
                    name: singleFormField.label,
                    value: singleFormField.instanceAttributeRef
                });
            });

            var struttura = {
                element: element,
                workbench: workbench,
                title: "Instance form fields",
                elements: fieldForInterface,
                callbackSave: function (referenceName, selectedField, cmdLauncher) {
                    extSetValue(referenceName, selectedField, element, bpmnFactory, cmdLauncher)
                }
            };
            window.instanceSettings.load(struttura);
        }
    });

    //workbench.predefinedForms
    // [PredefinedForm] predefined forms list select
    group.entries.push(entryFactory.selectBox({
        id : 'form-key',
        label : 'Select Form',
        modelProperty: 'formRef',
        selectOptions: predefinedFormsMapped,
        disabled: function(element, node) {
            return !formHelper.isPredefinedForm(element);
        }, //data-on-change
        get: function(element, node) {
            var bo = getBusinessObject(element);

            var selected = '';
            if(bo.formRef){
                selected = bo.formRef;
            }

            return {
                formRef:  selected
            };
        },
        set: function(element, values, node) {
            var bo = getBusinessObject(element);

            var commands = [];
            commands.push(cmdHelper.updateBusinessObject(element, bo, {'custom:formRef': values.formRef}));

            var elementi = [];

            var callBackFields = function(elementiResp, diagManager){
                elementi = elementiResp;
                console.log(elementi);

                var extensionElements = bo.get('extensionElements');
                if (!extensionElements) {
                    extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
                    commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
                }

                var formCamundaFormData = getExtensionElements(bo, 'camunda:FormData'); //created
                if(!formCamundaFormData){
                    formCamundaFormData = elementHelper.createElement('camunda:FormData', { fields: [] }, extensionElements, bpmnFactory);
                    commands.push(cmdHelper.addElementsTolist(element, extensionElements, 'values',[ formCamundaFormData ]));
                }else if(formCamundaFormData.length > 0){
                    //first array of form data (always one to be)
                    formCamundaFormData = formCamundaFormData[0];
                }

                formCamundaFormData.fields = []; //reset fields array

                for(var i=0; i< elementiResp.length; i++){
                    formCamundaFormData.fields.push(elementHelper.createElement('camunda:FormField',
                        {
                            id: elementiResp[i].id,
                            label: elementiResp[i].fieldName,
                            instanceAttributeRef: ''
                         } , formCamundaFormData, bpmnFactory));
                }

                commands.push(cmdHelper.updateBusinessObject(element, formCamundaFormData, {
                    fields: formCamundaFormData.fields
                }));

                var propertiesPanel = diagManager.renderer.get('propertiesPanel');
                propertiesPanel.executeCommand(commands);
            };

            var resultCall = window.dgrControls.getFormFields(values.formRef, callBackFields);

            return commands;
        }

    }));

    // [CustomFrom] fields table
    var formFieldOptions = {
        id : 'form-fields',
        label : 'Fields',
        modelProperty: 'id',
        prefix: 'FormField',
        hideControls: function(){
            return formHelper.isPredefinedForm(element)
        },
        createExtensionElement : function(element, extensionElements, value) {
            var bo = getBusinessObject(element),
                formData = getExtensionElements(bo, 'camunda:FormData')[0],
                field = elementHelper.createElement('camunda:FormField', { id: value }, formData, bpmnFactory);

            if (typeof formData.fields !== 'undefined') {
                return cmdHelper.addElementsTolist(element, formData, 'fields', [ field ]);
            } else {
                return cmdHelper.updateBusinessObject(element, formData, {
                    fields: [ field ]
                });
            }
        },
        removeExtensionElement: function(element, extensionElements, value, idx) {
            var formData = getExtensionElements(getBusinessObject(element), 'camunda:FormData')[0],
                entry = formData.fields[idx];

            return cmdHelper.removeElementsFromList(element, formData, 'fields', null, [ entry ]);
        },
        getExtensionElements: function(element) {
            return formHelper.getFormFields(element);
        }
    };
    var formFieldsEntry = extensionElements(element, bpmnFactory, formFieldOptions);
    group.entries.push(formFieldsEntry);

    // [PredefinedForm - CustomFrom] Form Field id text input field
    group.entries.push(entryFactory.validationAwareTextField({
        id: 'form-field-id',
        label: 'ID',
        modelProperty: 'id',
        getProperty: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node) || {};

            return selectedFormField.id;
        },

        setProperty: function(element, properties, node) {
            var formField = getSelectedFormField(element, node);

            return cmdHelper.updateBusinessObject(element, formField, properties);
        },
        disabled: function(element, node) {
            return !getSelectedFormField(element, node);
        },
        validate: function(element, values, node) {

            var formField = getSelectedFormField(element, node);

            if (formField) {

                var idValue = values.id;

                if (!idValue || idValue.trim() === '') {
                    return { id: 'Form field id must not be empty' };
                }

                var formFields = formHelper.getFormFields(element);

                var existingFormField = find(formFields, function(f) {
                    return f !== formField && f.id === idValue;
                });

                if (existingFormField) {
                    return { id: 'Form field id already used in form data.' };
                }
            }
        }
    }));

    // [CustomFrom] form field type combo box
    group.entries.push(entryFactory.comboBox({
        id : 'form-field-type',
        label: 'Type',
        selectOptions: [
            { name: 'string', value: 'string' },
            { name: 'long', value: 'long' },
            { name: 'boolean', value: 'boolean' },
            { name: 'date', value: 'date' },
            { name: 'enum', value: 'enum' }
        ],
        modelProperty: 'type',
        emptyParameter: true,

        get: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node);

            if (selectedFormField) {
                return { type: selectedFormField.type };
            } else {
                return {};
            }
        },
        set: function(element, values, node) {
            var selectedFormField = getSelectedFormField(element, node),
                commands = [];

            if (selectedFormField.type === 'enum' && values.type !== 'enum') {
                // delete camunda:value objects from formField.values when switching from type enum
                commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, { values: undefined }));
            }

            commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, values));

            return commands;
        },
        disabled: function(element, node) {
            return formHelper.isPredefinedForm(element) || !getSelectedFormField(element, node);
        }
    }));

    // [CustomFrom] form field label text input field
    group.entries.push(formFieldTextField({
        id : 'form-field-label',
        label : 'Label',
        modelProperty: 'label'
    }, getSelectedFormField));

    // [PredefinedForm - CustomFrom] form field dataobject instance select
    var dataObjectsSelectElementsHtml = buildSelectInstance(dataObjectsSelect, 'instanceAttributeRef');
    var entryFactCombo = {
        id : 'form-field-instanceAttributeRef',
        html : dataObjectsSelectElementsHtml,
        modelProperty: 'instanceAttributeRef',
        show: function(element, node){
            var formField = getSelectedFormField(element, node);

            if (formField){
                return true;
            }

            return false;
        },
        get : function(element, node){
            var selectedFormField = getSelectedFormField(element, node);

            if (selectedFormField) {
                return {instanceAttributeRef : selectedFormField.instanceAttributeRef};
            } else {
                return {instanceAttributeRef : ''};
            }
        },
        set: function(element, values, node){
            var selectedFormField = getSelectedFormField(element, node),
                commands = [];

            commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, values));

            return commands;
        }
    };
    group.entries.push(entryFactCombo);

    // [CustomFrom] Multiple select in enum
    group.entries.push(entryFactory.checkbox({
        id: 'form-field-list-type',
        label : 'Multiple select',
        modelProperty: 'listType',

        disabled: function(element, node){
            var formField = getSelectedFormField(element, node);

            if (formField && formField.type === "enum"){
                return false;
            }
            return true;
        },
        get: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node);

            if (selectedFormField) {
                return {listType : selectedFormField.listType};
            } else {
                return {listType : false};
            }
        },

        set: function(element, values, node) {
            var selectedFormField = getSelectedFormField(element, node),
            commands = [];
            commands.push(cmdHelper.updateBusinessObject(element, selectedFormField, values));
            return commands;
        }
    }));


    // [CustomFrom] form field defaultValue text input field
    group.entries.push(formFieldTextField({
        id : 'form-field-defaultValue',
        label : 'Default Value',
        modelProperty: 'defaultValue'
    }, getSelectedFormField));

    // [CustomFrom] form field enum values label
    group.entries.push(entryFactory.label({
        id: 'form-field-enum-values-header',
        labelText: 'Values',
        divider: true,
        showLabel: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node);

            return selectedFormField && selectedFormField.type === 'enum';
        }
    }));

    // [CustomFrom] form field enum values table
    group.entries.push(entryFactory.table({
        id: 'form-field-enum-values',
        labels: [ 'Id', 'Name' ],
        modelProperties: [ 'id', 'name' ],
        show: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node);

            return selectedFormField && selectedFormField.type === 'enum';
        },
        getElements: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node);

            return formHelper.getEnumValues(selectedFormField);
        },
        addElement: function(element, node) {
            var selectedFormField = getSelectedFormField(element, node),
                id = generateValueId();

            var enumValue = elementHelper.createElement('camunda:Value', { id: id, name: undefined },
                getBusinessObject(element), bpmnFactory);

            return cmdHelper.addElementsTolist(element, selectedFormField, 'values', [ enumValue ]);
        },
        removeElement: function(element, node, idx) {
            var selectedFormField = getSelectedFormField(element, node),
                enumValue = selectedFormField.values[idx];

            return cmdHelper.removeElementsFromList(element, selectedFormField, 'values', null, [ enumValue ]);
        },
        updateElement: function(element, value, node, idx) {
            var selectedFormField = getSelectedFormField(element, node),
                enumValue = selectedFormField.values[idx];

            value.name = value.name || undefined;

            return cmdHelper.updateBusinessObject(element, enumValue, value);
        },
        validate: function(element, value, node, idx) {

            var selectedFormField = getSelectedFormField(element, node),
                enumValue = selectedFormField.values[idx];

            if (enumValue) {
                // check if id is valid
                var validationError = utils.isIdValid(enumValue, value.id);

                if (validationError) {
                    return { id: validationError };
                }
            }
        }
    }));

    // [CustomFrom] Validation label
    group.entries.push(entryFactory.label({
        id: 'form-field-validation-header',
        labelText: 'Validation',
        divider: true,
        showLabel: function(element, node) {
            return !formHelper.isPredefinedForm(element) && !!getSelectedFormField(element, node);
        }
    }));

    // [CustomFrom] form field constraints table
    group.entries.push(entryFactory.table({
        id: 'constraints-list',
        modelProperties: [ 'name', 'config' ],
        labels: [ 'Name', 'Config' ],
        addLabel: 'Add Constraint',
        getElements: function(element, node) {
            var formField = getSelectedFormField(element, node);
            return formHelper.getConstraints(formField);
        },
        addElement: function(element, node) {
            var commands = [],
                formField = getSelectedFormField(element, node),
                validation = formField.validation;

            if (!validation) {
                // create validation business object and add it to form data, if it doesn't exist
                validation = elementHelper.createElement('camunda:Validation', {}, getBusinessObject(element), bpmnFactory);

                commands.push(cmdHelper.updateBusinessObject(element, formField, { 'validation': validation }));
            }

            var newConstraint = elementHelper.createElement('camunda:Constraint',
                { name: undefined, config: undefined }, validation, bpmnFactory);

            commands.push(cmdHelper.addElementsTolist(element, validation, 'constraints', [ newConstraint ]));
            return commands;
        },
        updateElement: function(element, value, node, idx) {
            var formField = getSelectedFormField(element, node),
                constraint = formHelper.getConstraints(formField)[idx];

            value.name = value.name || undefined;
            value.config = value.config || undefined;

            return cmdHelper.updateBusinessObject(element, constraint, value);
        },
        removeElement: function(element, node, idx) {
            var commands = [],
                formField = getSelectedFormField(element, node),
                constraints = formHelper.getConstraints(formField),
                currentConstraint = constraints[idx];

            commands.push(cmdHelper.removeElementsFromList(element, formField.validation,
                'constraints', null, [ currentConstraint ]));

            if (constraints.length === 1) {
                // remove camunda:validation if the last existing constraint has been removed
                commands.push(cmdHelper.updateBusinessObject(element, formField, { validation: undefined }));
            }

            return commands;
        },
        show: function(element, node) {
            if (formHelper.isPredefinedForm(element)) {
                return;
            }

            return !!getSelectedFormField(element, node);
        }
    }));

    // [CustomFrom] Properties label
    group.entries.push(entryFactory.label({
        id: 'form-field-properties-header',
        labelText: 'Properties',
        divider: true,
        showLabel: function(element, node) {
            return !formHelper.isPredefinedForm(element) && !!getSelectedFormField(element, node);
        }
    }));

    // [CustomFrom] camunda:properties table
    group.entries.push(properties(element, bpmnFactory, {
        id: 'form-field-properties',
        modelProperties: [ 'id', 'value' ],
        labels: [ 'Id', 'Value' ],
        getParent: function(element, node) {
            return getSelectedFormField(element, node);
        },
        show: function(element, node) {
            return !formHelper.isPredefinedForm(element) && !!getSelectedFormField(element, node);
        }
    }));
};
