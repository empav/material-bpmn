/**
 * Created by lukaj on 2017-02-10.
 */
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/instanceSettings.html', {encoding: 'utf-8'});
var getExtensionElements = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper').getExtensionElements;


var instanceSettings = function($scope,commandLauncher){
    var vm = window['instanceSettings'] = this

    vm.commandLauncher = commandLauncher; // this service give us the commands to write into the XML
    vm.loaded = false;

    vm.struttura = {
        instances: [],
        title: "",
        fieldsToInstance: [],
        callbackSave: function () {}
    };

    vm.selectedField = null;

    vm.close = close;
    vm.load = load;
    vm.reinit = reinit;
    vm.select = select;
    vm.fieldIs = fieldIs;
    vm.save = save;  //callback to save
    $scope.safeApply = safeApply;

    function select(field){
        cleanSelection();
        field.selected = true;
        vm.selectedField = field;
    }

    function cleanSelection(){
        //set selection false on all fields available
        for(var i =0; i < vm.struttura.fieldsToInstance.length; i++){
            vm.struttura.fieldsToInstance[i].selected = false;
        }
    }

    function safeApply(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    }

    function close(){
        vm.loaded = false;
        vm.struttura = {};
    }

    //TODO: VERIFY BY correct property
    function fieldIs(strPre, field){
        return field.key.startsWith(strPre);
    }

    function reinit(struttura){
        if(struttura){
            vm.struttura.workbench = struttura.workbench;
            vm.struttura.instances = buildInstancesTree(struttura.workbench.currentResource.resourceDoList);
            vm.struttura.title = struttura.title;
            vm.struttura.fieldsToInstance = struttura.elements;
            vm.struttura.callbackSave = struttura.callbackSave;

            $scope.safeApply();
        }
    }

    function load(struttura){
        if(struttura){
            vm.loaded = true;
            reinit(struttura);
        }
    }

    //SAVE RULE
    function save(referenceName){
        vm.struttura.callbackSave(referenceName, vm.selectedField, vm.commandLauncher);
    }

    function buildInstancesTree(wbDataObjects){
        var result = [];

        if(wbDataObjects){
            angular.forEach(wbDataObjects, function(value){
                angular.forEach(value.instances, function(singleInstance){
                    var instObj = angular.copy(value);
                    instObj.instanceName = singleInstance.name;
                    instObj.referenceName = singleInstance.name;
                    setReference(instObj.fields, singleInstance.name);
                    result.push(instObj);
                });
            });
        }

        return result;
    }

    function setReference(fields, preRefName){
        angular.forEach(fields, function(singleField){
            var refName = preRefName + '.' + singleField.fieldName;
            singleField.referenceName = refName;
            setReference(singleField.fields, refName);
        });
    }
};

instanceSettings.$inject = ['$scope','commandLauncher'];
module.exports = function () {
    return {
        scope: true,
        restrict: 'E',
        controller: instanceSettings,
        controllerAs: 'vm',
        template: template
    };
};
