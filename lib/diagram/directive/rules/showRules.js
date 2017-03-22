'use strict';

var fs = require('fs'),
    template = fs.readFileSync(__dirname + '/showRules.html', {encoding: 'utf-8'});

var controller = function ($scope) {
    var vm = this;

    for (var i = 0; i < vm.rules.length; i++) {
        var index = vm.usedRules.indexOf(vm.rules[i].id.toString());
        if (index >= 0) {
            //rule used
            vm.rules[i].used = true;
        } else {
            vm.rules[i].used = false;
        }
    }
};

controller.$inject = ['$scope'];

module.exports = function () {

    return {
        scope: {
            rules: '=',
            usedRules: '='
        },
        restrict: 'E',
        replace: true,
        template: template,
        bindToController: true,
        controller: controller,
        controllerAs: 'vm'
    };
};
