'use strict';

var EventBus = require('../../../util/eventBus'),
    Workbench = require('./workbench'),
    constants = require('../../../util/constants');

var AppController = function ($rootScope) {

    var vm = this;

    //Setting page title
    $rootScope.pageTitle = constants.appName;

    //Create a new EventBus
    var eventBus = new EventBus();

    //Create a new Workbench
    vm.workbench = new Workbench();

    //Add a new eventbus to the Workbench
    vm.workbench.eventBus = eventBus;

    // register the update function
    vm.workbench.update = function () {
    };

    //Rules
    vm.workbench.rules = [];

    //Dataobjects
    vm.workbench.dataObjects = {};

    //Dataobject process
    vm.workbench.dataObjects['Process'] = {
        name: 'Process Data Objects',
        properties: []
    };

    // trigger scope whenever an event is fired. This listener is the first to register
    // and will always be invoked last.
    eventBus.on('*', function () {
        vm.workbench.update();
    });

};

AppController.$inject = ['$rootScope'];

module.exports = AppController;
