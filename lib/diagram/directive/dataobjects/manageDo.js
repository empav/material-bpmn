'use strict';

var fs = require('fs'),
    template = fs.readFileSync(__dirname + '/manageDo.html', {encoding: 'utf-8'}),
    $ = require('jquery');


var controller = function ($modal, logger, portfolioServices) {
    var vm = this;

    //DO Tree
    var treeDo = angular.element('#tree-do').scope();

    //Edit or import mode
    vm.isEdit = true;

    //Node structure example
    vm.node = {
        fieldName: null,
        fieldType: {
            name: null,
            cod: null,
            description: null,
            elementaryType: null,
            validations: null
        },
        dimensions: 0,
        fieldLabel: null,
        source: null,
        version: null,
        fields: null,
        instances: null
    };

    //Instances panel
    vm.newInstance = {
        dimensions: 0
    };

    //DO Types filtered
    vm.doTypes = [];

    //Backup
    vm.backupdo = [];

    //Selected to be imported
    vm.importDo = [];

    //Import and edit mode (common functions)
    vm.toggle = toggle;
    vm.collapseAll = collapseAll;
    vm.expandAll = expandAll;
    vm.backupRestoreDO = backupRestoreDO;

    //Edit mode
    vm.saveInstance = saveInstance;
    vm.remove = remove;
    vm.edit = edit;
    vm.add = add;
    vm.clearDo = clearDo;
    vm.switchToImportMode = switchToImportMode;
    vm.checkInstances = checkInstances;
    vm.getDOTypes = getDOTypes;
    vm.newDOType = newDOType;
    vm.hidePanels = hidePanels;
    vm.showTooltip = showTooltip;
    vm.showWarning = showWarning;
    vm.visible = visible;
    vm.validateSiblingsName = validateSiblingsName;

    //Import mode
    vm.checkDo = checkDo;
    vm.pushSelectedDo = pushSelectedDo;
    vm.getDOFromPortfolio = getDOFromPortfolio;
    vm.importDOFromPortfolio = importDOFromPortfolio;

    //Filtering types from the original list of data objects
    getDOTypes(vm.do);

    function clearDo(all) {
        if (all) {
            vm.do = [];
        } else {
            vm.do = vm.do.filter(function (node) {
                return !node.imported;
            });
        }
    }

    function validateSiblingsName(scope, name) {
        var count = 0;

        //Search among siblings
        if (scope.$parentNodeScope) {
            var node = scope.$parentNodeScope.$modelValue;

            node.fields.forEach(function (n) {
                if (n.fieldName === name) {
                    count++;
                }
            });

        } else {
            //Search among root nodes
            vm.do.forEach(function (n) {
                if (n.fieldName === name) {
                    count++;
                }
            });
        }

        return count;
    }

    function showWarning(node, scope) {
        return !angular.isString(node.fieldName) ||
            node.fieldName === '' || !angular.isString(node.fieldType.name) ||
            (!scope.$parentNodeScope && (!node.instances || !node.instances.length)) ||
            validateSiblingsName(scope, node.fieldName) === 2;

    }

    function showTooltip(event, node, scope) {
        var warning = '';

        if (!node.fieldName || node.fieldName === null || node.fieldName === '') {
            warning += 'Name is missing \n';
        }
        if (!scope.$parentNodeScope && (!node.instances || node.instances === null || !node.instances.length)) {
            warning += 'Instances are missing \n';
        }
        if (!node.fieldType || node.fieldType.name === null || node.fieldType.name === '') {
            warning += 'Type is missing';
        }

        $(event.currentTarget).attr('title', warning);
    }

    function visible(node) {
        return !(vm.searchDo && vm.searchDo.length > 0 && node.fields && node.fieldName.indexOf(vm.searchDo) === -1);
    }

    function importDOFromPortfolio(action) {
        switch (action) {
            //Import all
            case 0: {
                vm.do.forEach(function (node) {
                    checkDo(node, 1, true);
                });
                vm.do = vm.do.concat(vm.backupdo);
                break;
            }
            //Import selected
            case 1: {
                vm.do.forEach(function (node) {
                    pushSelectedDo(node);
                });

                backupRestoreDO(false);
                break;
            }
            default:
        }

        //Empty backup
        vm.backupdo = [];
        //Back to edit mode
        vm.isEdit = true;
    }

    function pushSelectedDo(node) {
        if (node.imported) {
            vm.backupdo.unshift(node);
            return;
        } else {
            node.fields = node.fields || [];

            node.fields.forEach(function (item) {
                pushSelectedDo(item);
            });
        }
    }

    function checkDo(node, index, bool) {
        bool = !index ? node.imported : bool;

        if (!node.fields) {
            node.imported = bool;
            return;
        } else {
            node.imported = bool;
            node.fields.forEach(function (child) {
                checkDo(child, 1, bool);
            });
        }
    }


    function backupRestoreDO(isBackup) {
        if (isBackup) {
            vm.backupdo = angular.copy(vm.do);
            vm.do = [];
        } else {
            vm.do = angular.copy(vm.backupdo);
            vm.backupdo = [];
        }

    }

    function getDOTypes(nodes) {
        for (var i = 0; i <= nodes.length - 1; i++) {
            var node = nodes[i];

            //Continue with the next sibling if it is a leaf
            if (node.fields) {
                getDOTypes(node.fields);

                //If it is not there I'll push it
                if (!checkDOType(node.fieldType.name)) {
                    vm.doTypes.push(node.fieldType);
                }
            }
        }
    }

    function newDOType() {
        //If it is not there I'll push it
        if (!checkDOType(vm.fieldType)) {
            var t = angular.copy(vm.node.fieldType);
            t.description = t.name = vm.fieldType;

            vm.selectedField.fieldType = t;

            vm.doTypes.push(t);
        }

        //Resetting input text
        vm.fieldType = null;
    }

    function checkDOType(type) {

        for (var i = 0; i <= vm.doTypes.length - 1; i++) {
            if (vm.doTypes[i].name.toLowerCase() === type.toLowerCase()) {
                return true;
            }
        }

        return false;
    }

    function saveInstance() {
        vm.selectedField.instances = vm.selectedField.instances || [];

        if (vm.checkInstances(vm.newInstance)) {
            logger.error('There is another instance with the same name: ' + vm.newInstance.name);
        } else {
            vm.selectedField.instances.push(angular.copy(vm.newInstance));
        }

        vm.newInstance.name = '';
    }

    function checkInstances(instance) {
        var found = false;

        for (var i = 0; i < vm.selectedField.instances.length; i++) {
            var temp = vm.selectedField.instances[i];
            if (temp.name === instance.name) {
                found = true;
                break;
            }
        }

        return found;
    }

    function remove(scope) {
        var node = scope.$modelValue;

        //DO
        if (node.fields) {
            scope.remove();
        }
        //BASE TYPE
        else {
            var parent = scope.$parentNodeScope.$modelValue;

            if (parent.fields.length === 1) {
                scope.$parentNodeScope.remove();
            } else {
                scope.remove();
            }
        }

        //Hide props panel
        hidePanels();
    }

    function edit(scope, instancesPanel) {
        vm.instancesPanel = instancesPanel;
        vm.selectedField = scope.$modelValue;
        vm.scope = scope;
    }

    function toggle(scope) {
        scope.toggle();

        //Hide props panel
        hidePanels();
    }

    function add(scope, type) {
        //List is not empty
        if (scope) {
            //Current node to work with
            var node = scope.$modelValue;

            switch (type) {
                //Adding a nested DO with a nested field
                case 0: {
                    var newdo = angular.copy(vm.node);
                    newdo.fields = [angular.copy(vm.node)];
                    node.fields.push(newdo);
                    break;
                }
                //Adding a field
                case 1: {
                    node.fields = node.fields || [];
                    node.fields.push(angular.copy(vm.node));
                    break;
                }
                default:
            }
        }
        //List empty, adding the first DO with a field
        else {
            //Add a DO
            var clone = angular.copy(vm.node);
            clone.fields = [angular.copy(vm.node)];
            vm.do.push(clone);
        }

        //Hide props panel
        hidePanels();
    }

    function collapseAll() {
        treeDo.$broadcast('angular-ui-tree:collapse-all');

        //Hide props panel
        hidePanels();
    }

    function expandAll() {
        treeDo.$broadcast('angular-ui-tree:expand-all');

        //Hide props panel
        hidePanels();
    }

    function switchToImportMode() {
        //Hide props panel
        hidePanels();

        //Backup and restore
        backupRestoreDO(true);

        //Show import page
        vm.isEdit = false;
    }

    function getDOFromPortfolio(source) {
        portfolioServices.getPfDataObjects(source).then(function (pfdo) {
            vm.do = pfdo;
        });
    }

    function hidePanels() {
        //Hide props panel
        vm.selectedField = undefined;
        vm.scope = undefined;
        vm.instancesPanel = false;
    }
};

controller.$inject = ['$modal', 'logger', 'portfolioServices'];

module.exports = function () {
    return {
        scope: {
            do: '=',
            baseTypes: '=',
            portfolios: '='
        },
        restrict: 'E',
        replace: true,
        template: template,
        bindToController: true,
        controller: controller,
        controllerAs: 'vm'
    };
};
