'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

var asyncCapableHelper = require('bpmn-js-properties-panel/lib/helper/AsyncCapableHelper'),
    ImplementationTypeHelper = require('bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper');

// bpmn properties
var processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps'),
    eventProps = require('./parts/EventProps'),
    externalEventProps = require('./parts/externalEventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps'),
    nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps');

// camunda properties
var serviceTaskDelegateProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ServiceTaskDelegateProps'),
    userTaskProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/UserTaskProps'),
    asynchronousContinuationProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/AsynchronousContinuationProps'),
    callActivityProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/CallActivityProps'),
    multiInstanceProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/MultiInstanceLoopProps'),
    sequenceFlowProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/SequenceFlowProps'),
    executionListenerProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ExecutionListenerProps'),
    scriptProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ScriptTaskProps'),
    taskListenerProps = require('bpmn-js-properties-panel/lib/provider/camunda/parts/TaskListenerProps'),
    formProps = require('./parts/FormProps'),
    startEventInitiator = require('bpmn-js-properties-panel/lib/provider/camunda/parts/StartEventInitiator'),
    variableMapping = require('bpmn-js-properties-panel/lib/provider/camunda/parts/VariableMappingProps'),
    versionTag = require('bpmn-js-properties-panel/lib/provider/camunda/parts/VersionTagProps');

// custom properties
var rulesProps = require('./parts/RuleProps');
var portfolioServicesProps = require('./parts/PortfolioProps');



var elementTemplateChooserProps = require('bpmn-js-properties-panel/lib/provider/camunda/element-templates/parts/ChooserProps'),
    elementTemplateCustomProps = require('bpmn-js-properties-panel/lib/provider/camunda/element-templates/parts/CustomProps');

// Input/Output
var inputOutput = require('bpmn-js-properties-panel/lib/provider/camunda/parts/InputOutputProps'),
    inputOutputParameter = require('bpmn-js-properties-panel/lib/provider/camunda/parts/InputOutputParameterProps');

// Connector
var connectorDetails = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ConnectorDetailProps'),
    connectorInputOutput = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ConnectorInputOutputProps'),
    connectorInputOutputParameter = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ConnectorInputOutputParameterProps');

// properties
var properties = require('bpmn-js-properties-panel/lib/provider/camunda/parts/PropertiesProps');

// job configuration
var jobConfiguration = require('bpmn-js-properties-panel/lib/provider/camunda/parts/JobConfigurationProps');

// external task configuration
var externalTaskConfiguration = require('bpmn-js-properties-panel/lib/provider/camunda/parts/ExternalTaskConfigurationProps');

var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper'),
    implementationTypeHelper = require('bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper');

var setProcessDataObject = require('./helpers/ProcessVariablesHelper').setProcessDataObject;
var setProcessAppliedRules = require('./helpers/ProcessVariablesHelper').setProcessAppliedRules;

// helpers ////////////////////////////////////////

var isExternalTaskPriorityEnabled = function (element) {
    var businessObject = getBusinessObject(element);

    // show only if element is a process, a participant ...
    if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') && businessObject.get('processRef')) {
        return true;
    }

    var externalBo = ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element),
        isExternalTask = ImplementationTypeHelper.getImplementationType(externalBo) === 'external';

    // ... or an external task with selected external implementation type
    return !!ImplementationTypeHelper.isExternalCapable(externalBo) && isExternalTask;
};

var isJobConfigEnabled = function (element) {
    var businessObject = getBusinessObject(element);

    if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') && businessObject.get('processRef')) {
        return true;
    }

    // async behavior
    var bo = getBusinessObject(element);
    if (asyncCapableHelper.isAsyncBefore(bo) || asyncCapableHelper.isAsyncAfter(bo)) {
        return true;
    }

    // timer definition
    if (is(element, 'bpmn:Event')) {
        return !!eventDefinitionHelper.getTimerEventDefinition(element);
    }

    return false;
};

var getInputOutputParameterLabel = function (param) {

    if (is(param, 'camunda:InputParameter')) {
        return 'Input Parameter';
    }

    if (is(param, 'camunda:OutputParameter')) {
        return 'Output Parameter';
    }

    return '';
};

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, elementTemplates, workbench) {

    var generalGroup = {
        id: 'general',
        label: 'General',
        entries: []
    };
    idProps(generalGroup, element, elementRegistry);
    nameProps(generalGroup, element);
    versionTag(generalGroup, element);
    processProps(generalGroup, element);
    elementTemplateChooserProps(generalGroup, element, elementTemplates);

    setProcessDataObject(element, workbench.dataObjects);
    setProcessAppliedRules(element, workbench);

    var customFieldsGroup = {
        id: 'customField',
        label: 'Custom Fields',
        entries: []
    };
    elementTemplateCustomProps(customFieldsGroup, element, elementTemplates, bpmnFactory);

    var detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: []
    };
    //serviceTaskDelegateProps(detailsGroup, element, bpmnFactory);
    userTaskProps(detailsGroup, element);
    scriptProps(detailsGroup, element, bpmnFactory);
    linkProps(detailsGroup, element);
    callActivityProps(detailsGroup, element, bpmnFactory);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry, workbench);
    sequenceFlowProps(detailsGroup, element, bpmnFactory);
    startEventInitiator(detailsGroup, element); // this must be the last element of the details group!

    var multiInstanceGroup = {
        id: 'multiInstance',
        label: 'Multi Instance',
        entries: []
    };
    multiInstanceProps(multiInstanceGroup, element, bpmnFactory);

    var asyncGroup = {
        id: 'async',
        label: 'Asynchronous Continuations',
        entries: []
    };
    asynchronousContinuationProps(asyncGroup, element, bpmnFactory);

    var jobConfigurationGroup = {
        id: 'jobConfiguration',
        label: 'Job Configuration',
        entries: [],
        enabled: isJobConfigEnabled
    };
    jobConfiguration(jobConfigurationGroup, element, bpmnFactory);

    var externalTaskGroup = {
        id: 'externalTaskConfiguration',
        label: 'External Task Configuration',
        entries: [],
        enabled: isExternalTaskPriorityEnabled
    };
    externalTaskConfiguration(externalTaskGroup, element, bpmnFactory);

    var documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: []
    };
    documentationProps(documentationGroup, element, bpmnFactory);

    return [
        generalGroup,
        customFieldsGroup,
        detailsGroup,
        externalTaskGroup,
        multiInstanceGroup,
        asyncGroup,
        jobConfigurationGroup,
        documentationGroup
    ];

}

function createVariablesTabGroups(element, bpmnFactory, elementRegistry) {
    var variablesGroup = {
        id: 'variables',
        label: 'Variables',
        entries: []
    };
    variableMapping(variablesGroup, element, bpmnFactory);

    return [
        variablesGroup
    ];
}

function createFormsTabGroups(element, bpmnFactory, elementRegistry,  workbench) {
    var formGroup = {
        id: 'forms',
        label: 'Forms',
        entries: []
    };
    formProps(formGroup, element, bpmnFactory, workbench);

    return [
        formGroup
    ];
}

function createRulesTabGroups(element, bpmnFactory, elementRegistry, workbench) {
    var ruleGroup = {
        id: 'rules',
        label: 'Rules',
        entries: []
    };
    rulesProps(ruleGroup, element, bpmnFactory, workbench);

    return [
        ruleGroup
    ];
}

function createListenersTabGroups(element, bpmnFactory, elementRegistry) {

    var executionListenersGroup = {
        id: 'executionListeners',
        label: 'Execution Listeners',
        entries: []
    };
    executionListenerProps(executionListenersGroup, element, bpmnFactory);

    var taskListenersGroup = {
        id: 'taskListeners',
        label: 'Task Listeners',
        entries: []
    };
    taskListenerProps(taskListenersGroup, element, bpmnFactory);

    return [
        executionListenersGroup,
        taskListenersGroup
    ];
}

function createInputOutputTabGroups(element, bpmnFactory, elementRegistry) {

    var inputOutputGroup = {
        id: 'input-output',
        label: 'Parameters',
        entries: []
    };

    var options = inputOutput(inputOutputGroup, element, bpmnFactory);

    var inputOutputParameterGroup = {
        id: 'input-output-parameter',
        entries: [],
        enabled: function (element, node) {
            return options.getSelectedParameter(element, node);
        },
        label: function (element, node) {
            var param = options.getSelectedParameter(element, node);
            return getInputOutputParameterLabel(param);
        }
    };

    inputOutputParameter(inputOutputParameterGroup, element, bpmnFactory, options);

    return [
        inputOutputGroup,
        inputOutputParameterGroup
    ];
}

function createConnectorTabGroups(element, bpmnFactory, elementRegistry) {
    var connectorDetailsGroup = {
        id: 'connector-details',
        label: 'Details',
        entries: []
    };

    connectorDetails(connectorDetailsGroup, element, bpmnFactory);

    var connectorInputOutputGroup = {
        id: 'connector-input-output',
        label: 'Input/Output',
        entries: []
    };

    var options = connectorInputOutput(connectorInputOutputGroup, element, bpmnFactory);

    var connectorInputOutputParameterGroup = {
        id: 'connector-input-output-parameter',
        entries: [],
        enabled: function (element, node) {
            return options.getSelectedParameter(element, node);
        },
        label: function (element, node) {
            var param = options.getSelectedParameter(element, node);
            return getInputOutputParameterLabel(param);
        }
    };

    connectorInputOutputParameter(connectorInputOutputParameterGroup, element, bpmnFactory, options);

    return [
        connectorDetailsGroup,
        connectorInputOutputGroup,
        connectorInputOutputParameterGroup
    ];
}


function createEventElementsGroups(element, bpmnFactory, workbench) {
    var eventsGroup = {
        id: 'events',
        label: 'External events',
        entries: []
    };
    externalEventProps(eventsGroup, element, bpmnFactory, workbench);

    return [
        eventsGroup
    ];
}

function createPortfolioGroups(element, bpmnFactory, workbench) {
    var portfolioGroups = {
        id: 'portfolio',
        label: 'Services',
        entries: []
    };
    portfolioServicesProps(portfolioGroups, element, bpmnFactory, workbench);

    return [
        portfolioGroups
    ];
}

function createExtensionElementsGroups(element, bpmnFactory, elementRegistry) {

    var propertiesGroup = {
        id: 'extensionElements-properties',
        label: 'Properties',
        entries: []
    };
    properties(propertiesGroup, element, bpmnFactory);

    return [
        propertiesGroup
    ];
}

// Camunda Properties Provider /////////////////////////////////////


/**
 * A properties provider for Camunda related properties.
 *
 * @param {EventBus} eventBus
 * @param {BpmnFactory} bpmnFactory
 * @param {ElementRegistry} elementRegistry
 * @param {ElementTemplates} elementTemplates
 */
function CamundaPropertiesProvider(eventBus, bpmnFactory, elementRegistry, elementTemplates, workbench) {

    PropertiesActivator.call(this, eventBus);

    this.getTabs = function (element) {

        var generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(
                element, bpmnFactory,
                elementRegistry, elementTemplates,
                workbench
            )
        };

        var variablesTab = {
            id: 'variables',
            label: 'Variables',
            groups: createVariablesTabGroups(element, bpmnFactory, elementRegistry)
        };

        var formsTab = {
            id: 'forms',
            label: 'Forms',
            groups: createFormsTabGroups(element, bpmnFactory, elementRegistry, workbench)
        };

        var rulesTab = {
            id: 'rules',
            label: 'Rules',
            groups: createRulesTabGroups(element, bpmnFactory, elementRegistry, workbench)
        };

        var listenersTab = {
            id: 'listeners',
            label: 'Listeners',
            groups: createListenersTabGroups(element, bpmnFactory, elementRegistry)
        };

        var inputOutputTab = {
            id: 'input-output',
            label: 'Input/Output',
            groups: createInputOutputTabGroups(element, bpmnFactory, elementRegistry)
        };

        var connectorTab = {
            id: 'connector',
            label: 'Connector',
            groups: createConnectorTabGroups(element, bpmnFactory, elementRegistry),
            enabled: function (element) {
                var bo = implementationTypeHelper.getServiceTaskLikeBusinessObject(element);
                return bo && implementationTypeHelper.getImplementationType(bo) === 'connector';
            }
        };

        var extensionsTab = {
            id: 'extensionElements',
            label: 'Extensions',
            groups: createExtensionElementsGroups(element, bpmnFactory, elementRegistry)
        };


        var EventsTab = {
            id: 'eventElements',
            label: 'External events',
            groups: createEventElementsGroups(element, bpmnFactory, workbench)
        };

        var PortfolioServicesTab = {
            id: 'portfolioServices',
            label: 'Services',
            groups: createPortfolioGroups(element, bpmnFactory, workbench)
        };



        return [
            generalTab,
            PortfolioServicesTab,
            variablesTab,
            connectorTab,
            formsTab,
            rulesTab,
            listenersTab,
            inputOutputTab,
            extensionsTab,
            EventsTab
        ];
    };

}

CamundaPropertiesProvider.$inject = [
    'eventBus',
    'bpmnFactory',
    'elementRegistry',
    'elementTemplates',
    'workbench'
];

inherits(CamundaPropertiesProvider, PropertiesActivator);

module.exports = CamundaPropertiesProvider;
