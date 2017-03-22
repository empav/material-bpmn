/**
 * Created by Bompadre on 17/02/2017.
 */

var constants = require('../util/constants'),
    getBusObj = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    getExtEle = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements,
    elmHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

var CommandLauncherFactory = function ($http, logger) {

    /**
     * launch a list of commands to modify the xml
     * @param commands
     * @returns {*}
     */
    var execute = function (commands) {
        var propertiesPanel = window['dgrControls'].diagramManager.renderer.get('propertiesPanel');
        propertiesPanel.executeCommand(commands);
    };

    return {
        execute: execute,
        getBusinessObject: getBusObj,
        getExtensionElements: getExtEle,
        elementHelper: elmHelper,
        cmdHelper: cmdHelper
    };
};

CommandLauncherFactory.$inject = ['$http', 'logger'];
module.exports = CommandLauncherFactory;
