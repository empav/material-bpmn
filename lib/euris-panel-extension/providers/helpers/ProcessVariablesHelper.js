/**
 * Created by lukaj on 31/10/2016.
 */

var is = require('bpmn-js/lib/util/ModelUtil').is;
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var formHelper =  require('./FormHelper');

var ProcessVariablesHelper = {};

module.exports = ProcessVariablesHelper;


/**
 * Get array of userTask as business object from the given business process object
 * @param processBusinessObject
 * @returns {Array}
 */
function getUserTasks(processBusinessObject){
    var userTasks = [];
    for(var i = 0; i < processBusinessObject.flowElements.length; i++){
        if(is(processBusinessObject.flowElements[i], 'bpmn:UserTask')){
            userTasks.push(processBusinessObject.flowElements[i]);
        }
    }
    return userTasks;
};

/**
 * Set data object in workbench variable used in the selected element
 * @param element
 * @param wbDataObjects
 */
ProcessVariablesHelper.setUserTaskDataObject = function(element, wbDataObjects){
    if(is(element, 'bpmn:UserTask')){
        var elementFields =  formHelper.getFormFields(element);

        wbDataObjects[element.id] = {};

        if(!element.name){
            var bo = getBusinessObject(element);
            element.name = bo.name;
        }

        wbDataObjects[element.id].name = element.name;
        wbDataObjects[element.id].properties = []; //array of fields divided by task

        if(elementFields){
            for(var efield in elementFields){

                var field = elementFields[efield];
                if(field.id != 'formKey'){
                    wbDataObjects[element.id].properties.push(field.id);
                }
            }
        }
    }
};

/**
 * Set data objects of all user tasks of the process
 * @param element
 * @param wbDataObjects
 */
ProcessVariablesHelper.setProcessDataObject = function (element, wbDataObjects) {
    // if (is(element, 'bpmn:Process')) {
    //
    //     var bo = getBusinessObject(element); //process business object
    //
    //     for(var i = 0; i < bo.flowElements.length; i++){
    //         ProcessVariablesHelper.setUserTaskDataObject(bo.flowElements[i], wbDataObjects);
    //     }
    // }
};

ProcessVariablesHelper.setServiceTaskRuleApplied = function(element, usedRulesByTask){
    if(is(element, 'bpmn:ServiceTask')){
        var bo = getBusinessObject(element);

        if(bo.rule){
           usedRulesByTask[element.id] = bo.rule;
        }
    }
};

ProcessVariablesHelper.setProcessAppliedRules = function (element, workbench) {
    // if (is(element, 'bpmn:Process')) {
    //
    //     var bo = getBusinessObject(element); //process business object
    //
    //     for(var i = 0; i < bo.flowElements.length; i++){
    //         ProcessVariablesHelper.setServiceTaskRuleApplied(bo.flowElements[i], workbench.usedRulesByTask);
    //     }
    // }
};



