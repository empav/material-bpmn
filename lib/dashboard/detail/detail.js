'use strict';

var DetailCtrl = function ($stateParams) {
    var vm = this;

    vm.project = $stateParams.project;

    vm.createOrUpdate = createOrUpdate;

    function createOrUpdate() {
        if (vm.project) {
            //TODO: To implement update
        } else {
            //TODO: To implement create
        }
    }
};

DetailCtrl.$inject = ['$stateParams'];

module.exports = DetailCtrl;
