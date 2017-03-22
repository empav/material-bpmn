'use strict';

var HomeCtrl = function ($scope, $state) {
    var vm = this;

    $scope.$on('sidebar-close', function () {
        angular.element('#mainPanel').toggleClass('width100');
    });

    $state.go('home.dashboard');
};


HomeCtrl.$inject = ['$scope', '$state'];

module.exports = HomeCtrl;

