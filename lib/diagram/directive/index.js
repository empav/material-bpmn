'use strict';

/**
 * direcitive used inside diagram section
 */

var angular = require('angular');

var ngModule = angular.module('workbench.diagram', [])
    .directive('dgrPanel', require('./dgrPanel'))
    .directive('dgrCanvas', require('./dgrCanvas'))
    .directive('dgrControls', require('./controls/dgrControls'))
    .directive('showRules', require('./rules/showRules'))
    .directive('manageDo', require('./dataobjects/manageDo'))
    .directive('instanceTree', require('./instance-tree/instanceTree'))
    .directive('source', require('./source/source'))
    .directive('pretty', require('./source/pretty'))
    .directive('dgrSheets', require('./sheets/dgrSheets'))
    .directive('instanceSettings', require('./instance-settings/instanceSettings'));
module.exports = ngModule;
