/**
 * Created by lukaj on 11/08/2016.
 */


'use strict';

var angular = require('angular');

var ngModule = angular.module('developer.factories', []);

ngModule.factory('projectServices', ['$http', 'logger', require('./projectServices')]);
ngModule.factory('rulesServices', ['$http', 'logger', require('./rulesServices')]);
ngModule.factory('helperServices', ['$http', 'logger', require('./helperServices')]);
ngModule.factory('portfolioServices', ['$http', 'logger',  require('./portfolioServices')]);
ngModule.factory('commandLauncher', ['$http', 'logger',  require('./commandLauncher')]);
ngModule.factory('formsServices', ['$http', 'logger',  require('./formsServices')]);

module.exports = ngModule;
