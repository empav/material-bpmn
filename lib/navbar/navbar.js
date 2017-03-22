var fs = require('fs'),
    template = fs.readFileSync(__dirname + '/navbar.html', {encoding: 'utf-8'});


var controller = function ($scope, $state) {
    var vm = this;

    vm.sidebarClosed = false;

    vm.toogleSidebar = toogleSidebar;
    vm.goDashboard = goDashboard;

    function toogleSidebar() {
        vm.sidebarClosed = !vm.sidebarClosed;

        $scope.$broadcast('sidebar-close');
    }

    function goDashboard() {
        vm.sidebarClosed = false;

        $state.go('home.dashboard');
    }
};

controller.$inject = ['$scope', '$state'];

module.exports = function () {
    return {
        bindToController: true,
        restrict: 'E',
        template: template,
        controller: controller,
        controllerAs: 'vm'
    };
};
