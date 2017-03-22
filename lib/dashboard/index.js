'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.dashboard', [])
    .controller('DashboardCtrl', require('./dashboard'))
    .controller('HomeCtrl', require('./home/home'))
    .controller('ProjectCtrl', require('./project/project'))
    .controller('ModelCtrl', require('./model/model'))
    .controller('ProfileCtrl', require('./profile/profile'))
    .controller('DetailCtrl', require('./detail/detail'))
    .controller('ModelCtrl', require('./project/model/model'));

module.exports = ngModule;

