/**
 * Created by lukaj on 11/08/2016.
 */


'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.interceptors', []);

ngModule.factory('httpInterceptor', require('./httpInterceptor'));

module.exports = ngModule;
