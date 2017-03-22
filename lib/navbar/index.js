/**
 * Created by lukaj on 29/08/2016.
 */

var angular;
angular = require('angular');

var ngModule = angular.module('developer.navbar', [])
    .directive('navbar', require('./navbar')); //load directive module

module.exports = ngModule;
