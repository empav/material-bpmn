/**
 * Created by epavan on 06/12/2016.
 */
'use strict';

var constants = require('../util/constants');

var logger = function logger($log, toastr) {
    var title = constants.appName;

    var service = {
        showToasts: true,

        error: error,
        info: info,
        success: success,
        warning: warning,

        // straight to console; bypass toastr
        log: $log.log
    };

    return service;
    /////////////////////

    function error(message, data) {
        toastr.error(message, title);
        $log.error('Error: ' + message, data);
    }

    function info(message, data) {
        toastr.info(message, title);
        $log.info('Info: ' + message, data);
    }

    function success(message, data) {
        toastr.success(message, title);
        $log.info('Success: ' + message, data);
    }

    function warning(message, data) {
        toastr.warning(message, title);
        $log.warn('Warning: ' + message, data);
    }
};


logger.$inject = ['$log', 'toastr'];

module.exports = logger;
