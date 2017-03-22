/**
 * Created by epavan on 06/12/2016.
 */
var angular = require('angular');

var ngModule = angular.module('developer.logger', []);
ngModule.factory('logger', require('./logger'));

module.exports = ngModule;
