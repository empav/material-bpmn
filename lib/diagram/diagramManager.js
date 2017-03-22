'use strict';

var BpmnModeler = require('bpmn-js/lib/Modeler'),
    CmmnModeler = require('cmmn-js/lib/Modeler');

var bpmnCamundaModdleExtension = require('../euris-panel-extension/providers/resources/camundaBpmnModdleExtension');
var bpmnModdleExtension = require('../euris-panel-extension/providers/resources/bpmnModdleExtension');

var DiagramManager = (function () {

    /**
     * @class
     * @classdesc manages the Bpmn-js resources
     * @param {Workbench} the workbench
     */
    function DiagramManager(workbench) {

        /** @member {Workbench} the current workbench */
        this.workbench = workbench;

        /** @member the bpmn/cmmn modeler */
        this.renderer = null;

        this.processDefinition = null;

        this.selectedElements = [];

        this.renderingElement = angular.element('#canvas');
    }


    DiagramManager.prototype.getSelectedElements = function () {
        return this.selectedElements;
    };


    DiagramManager.prototype.getProcessDefinition = function () {
        return this.processDefinition;
    };


    DiagramManager.prototype.executeCommand = function (name, cmd) {
        this.renderer.get('commandStack').execute(name, cmd);
    };


    DiagramManager.prototype.getBpmnElement = function (id) {
        return this.renderer.get('elementRegistry').get(id);
    };


    DiagramManager.prototype.getProcessElement = function () {
        if (!!this.renderer.diagram) {
            return this.renderer.get('canvas').getRootElement();
        }
    };


    DiagramManager.prototype.getBpmnXml = function (done) {
        var self = this;

        // perform an export otherwise
        self.renderer.saveXML({format: true}, function (err, xml) {
            if (err) {
                console.error(err);
            }

            done(err, xml);
        });
    };


    DiagramManager.prototype.registerListeners = function () {
        var self = this;

        self.workbench.eventBus.on('zoom-changed', function (isIn) {
            var canvas = self.renderer.get('canvas');
            var level = isIn ? canvas.zoom() + 0.1 : canvas.zoom() - 0.1;
            canvas.zoom(level);
        });
    };

    /**
     * Initializes the diagram renderer
     *
     * @param {Element} element the Dom Element on which the diagram renderer should be created.
     */
    DiagramManager.prototype.initBpmnDiagram = function () {

        var BpmnJS = BpmnModeler,
            additionalModules = [
                require('bpmn-js-properties-panel'),
                require('./palette-extension'),
                require('./replaceMenu-extension'),
                require('../euris-panel-extension'),
                {
                  propertiesPanel: [ 'type', require('./customPropertiesPanel') ],
                  bpmnRenderer: [ 'type', require('./renderer/CustomBpmnRenderer') ],
/*
                  pathMap: [ 'type', require('./renderer/CustomPathMap') ],
*/
                  workbench: ['value', this.workbench]
                }
            ];

        if (this.renderer) {
            this.renderer.destroy();
        }

        var tempContainer = angular.element('#js-properties-panel');

        // construct new renderer
        this.renderer = new BpmnJS({
            container: this.renderingElement,
            propertiesPanel: {
                parent: tempContainer
            },
            position: 'absolute',
            debugOverlay: {
                buttons: {
                    'break': {className: 'glyphicon glyphicon-record'},
                    'resume': {className: 'glyphicon glyphicon-play'}
                }
            },
            additionalModules: additionalModules,
            moddleExtensions: {
                bpmn: bpmnModdleExtension(),
                camunda: bpmnCamundaModdleExtension(),
                euris: require('../euris-panel-extension/providers/resources/euris')
            }
        });
        this.workbench.renderer = this.renderer;
    };

    /**
     * Initializes the diagram renderer
     *
     * @param {Element} element the Dom Element on which the diagram renderer should be created.
     */
    DiagramManager.prototype.initCmmnDiagram = function () {

        var CmmnJS = CmmnModeler,
            additionalModules = [
                require('cmmn-js-properties-panel'),
                require('cmmn-js-properties-panel/lib/provider/camunda'),
                {
                    workbench: ['value', this.workbench]
                }
            ];

        if (this.renderer) {
            this.renderer.destroy();
        }

        var tempContainer = angular.element('#js-properties-panel');

        // construct new renderer
        this.renderer = new CmmnJS({
            container: this.renderingElement,
            propertiesPanel: {
                parent: tempContainer
            },
            position: 'absolute',
            debugOverlay: {
                buttons: {
                    'break': {className: 'glyphicon glyphicon-record'},
                    'resume': {className: 'glyphicon glyphicon-play'}
                }
            },
            additionalModules: additionalModules,
            moddleExtensions: {
                camunda: require('camunda-cmmn-moddle/resources/camunda')
            }
        });
        this.workbench.renderer = this.renderer;
    };


    DiagramManager.prototype.createProcess = function (resource, isForceInit) {
        this.initDiagram(resource, isForceInit);

        var self = this;
        this.renderer.createDiagram(function () {
            self.workbench.eventBus.fireEvent('diagram-changed');
        });
    };

    DiagramManager.prototype.initDiagram = function (resource, isForceInit) {
        if (!this.renderer || isForceInit) {
            switch (resource.cfgResourceTypes.id) {
                case 1: {
                    this.initBpmnDiagram();
                    break;
                }

                case 2: {
                    this.initCmmnDiagram();
                    break;
                }

                default: {
                    this.initBpmnDiagram();
                }
            }
            // register listeners on the renderer
            this.registerListeners();
        }
    };

    DiagramManager.prototype.openProcess = function (resource, isForceInit) {
        this.initDiagram(resource, isForceInit);

        this.renderer.importXML(resource.resourceData, function (err) {
            if (err) {
                console.error(err);
            }
        });
    };

    return DiagramManager;

})();

module.exports = DiagramManager;
