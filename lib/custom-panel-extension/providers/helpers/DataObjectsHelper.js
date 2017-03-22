/**
 * Created by lukaj on 31/10/2016.
 */

var is = require('bpmn-js/lib/util/ModelUtil').is;
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var formHelper =  require('./FormHelper');

var DataObjectHelper = {};

module.exports = DataObjectHelper;


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
DataObjectHelper.setUserTaskDataObject = function(element, wbDataObjects){
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
DataObjectHelper.setProcessDataObject = function (element, wbDataObjects) {
    if (is(element, 'bpmn:Process')) {
        //return true;
        var bo = getBusinessObject(element); //process business object

        for(var i = 0; i < bo.flowElements.length; i++){
            DataObjectHelper.setUserTaskDataObject(bo.flowElements[i], wbDataObjects);
        }
    }
};


DataObjectHelper.buildSelectInstance = function(dataObjects, propertyName){
    var template = '<label for="camunda-table-row-cell-input-value" data-show="show" class="">Data Object Instance</label>';
    template += '<select id="camunda-table-row-cell-input-value" name="'+propertyName+'" data-show="show" data-value>';
    template += '<option value="">--</option>' ;

    for(var i=0; i< dataObjects.length; i++){
        var doName = dataObjects[i].name;
        template += '<option value="' + doName+ '" disabled>' + doName + '</option>' ;

        var istanze = dataObjects[i].instances;
        if(istanze && istanze !== null) {
            for (var j = 0; j < istanze.length; j++) {
                template += '<option value="' + istanze[j]+ '" disabled> &nbsp;&nbsp;&nbsp;&nbsp;' + istanze[j] + '</option>' ;

                for(var k=0; k < dataObjects[i].fields.length; k++){
                    template += '<option value="'+ istanze[j]+'.' +dataObjects[i].fields[k].fieldName
                        +'" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +  dataObjects[i].fields[k].fieldName + '</option>' ;
                }
            }
        }
    }
    template +=  '</select>';


    return template;
};
