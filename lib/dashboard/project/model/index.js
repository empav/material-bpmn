'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.model', [])
    .controller('ModelCtrl', require('./controller/modelCtrl'));

module.exports = ngModule;

