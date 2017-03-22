'use strict';

var httpInterceptor = function ($q) {

    return {
        'request': function (request) {
            angular.element('#splash-screen').show();

            return request;
        },

        'requestError': function (request) {
            angular.element('#splash-screen').hide();
            return request;
        },

        'response': function (response) {
            angular.element('#splash-screen').hide();
            return response;
        },

        'responseError': function (rejection) {
            angular.element('#splash-screen').hide();
            return $q.reject(rejection);
        }
    };
};

httpInterceptor.$inject = ['$q'];

module.exports = httpInterceptor;
