'use strict';

var fs = require('fs'),
    DiagramManager = require('./../diagramManager'),
    template = fs.readFileSync(__dirname + '/dgrPanel.html', {encoding: 'utf-8'}),
    constants = require('../../util/constants');

var controller = function ($rootScope, $scope, $stateParams,
                           projectServices, rulesServices, helperServices, portfolioServices,
                           $q, logger, formsServices) {
    var vm = this;
    // set project id get from rout parameters
    var projectId = $stateParams.projectId;

    // initialize a new diagram manager
    vm.diagramManager = new DiagramManager(vm.workbench);
    vm.workbench.portfolioServices = portfolioServices;

    // TODO: agganciare nuovi servizi portfolio
    //Getting active portfolios
    portfolioServices.getActivePortfolios().then(function (response) {
        console.log(response);
        vm.workbench.activePortfolios = response;
    }).catch(function (error) {
        logger.error(error);
    });

    //load process, rules and fieldTypes in parallel
    $q.all([
        projectServices.getProjectReourceList(projectId),
        rulesServices.getAllRules(),
        helperServices.getAllBaseTypes(),
        helperServices.getEventListener(),
        formsServices.getPredefinedFormsList()
    ])
        .then(function (response) {
            //if there's an XML open that process
            if (response[0] && response[0].length) {
                //Resources list
                vm.workbench.resources = response[0];
                //Open the BPMN
                vm.diagramManager.openProcess(vm.workbench.resources[0]);
            }
            else {
                //Create a new resource
                vm.workbench.resources = [{
                    cfgResourceTypes: {
                        id: 1,
                        description: 'BPMN'
                    },
                    resourceDoList: [],
                    projectId: projectId,
                    resourceName: 'Name it!',
                    resourceData: constants.bpmnEmpty
                }];

                vm.diagramManager.createProcess(vm.workbench.resources[0]);
                logger.warning('There are no resources associated with this project, a new BPMN diagram has been created');
            }

            //Current resource to work with
            vm.workbench.currentResource = angular.copy(vm.workbench.resources[0]);

            //Setting project title
            $rootScope.pageTitle = vm.workbench.currentResource.projectName;

            //Setting active the first one
            vm.workbench.currentResource.active = true;
            vm.workbench.sheets = [vm.workbench.currentResource];

            //if there are some rules
            if (response[1].length) {
                vm.workbench.rules = response[1];
            }
            //else log a message and hide the rules button
            else {
                angular.element('#show-rules-button').hide();
                logger.warning('There are no rules associated to this process');
            }

            //Getting base types
            vm.workbench.baseTypes = response[2].length ? response[2] : undefined;
            vm.workbench.intermediateMessagesList = response[3].length ? response[3] : undefined;

            //get predefined forms
            vm.workbench.predefinedForms = response[4].length ? response[4] : [];

        })
        .catch(function (error) {
            logger.error(error);
        });

};

controller.$inject = ['$rootScope', '$scope', '$stateParams',
    'projectServices', 'rulesServices', 'helperServices', 'portfolioServices',
    '$q', 'logger', 'formsServices'];

module.exports = function () {
    return {
        scope: {
            workbench: '='
        },
        restrict: 'E',
        bindToController: true,
        controller: controller,
        controllerAs: 'vm',
        template: template
    };
};

