/**
 * Created by lukaj on 2017-01-31.
 */

var moddleBpmn = require('camunda-bpmn-moddle/resources/camunda');

function extendModdle(){
    for(var i = 0; i< moddleBpmn.types.length; i++){

        //insert instaceAttributeRer to form field camunda definition
        if(moddleBpmn.types[i].name === "FormField"){
            var found = false;
            var found2 = false;
            for(var j=0; j< moddleBpmn.types[i].properties.length; j++){
                if(moddleBpmn.types[i].properties[j].name === "camunda:instanceAttributeRef"){
                    found = true;
                }
                if(moddleBpmn.types[i].properties[j].name === "camunda:listType"){
                    found2 = true;
                }
            }
            if(!found){
                moddleBpmn.types[i].properties.push(
                    {
                        "name": "instanceAttributeRef",
                        "type": "String",
                        "isAttr": true
                    }
                );
            }
            if(!found2){
                moddleBpmn.types[i].properties.push(
                    {
                        "name": "listType",
                        "type": "Boolean",
                        "isAttr": true
                    }
                );
            }
        }
    }

    return moddleBpmn;
}

module.exports = function(){
    return extendModdle()
};
