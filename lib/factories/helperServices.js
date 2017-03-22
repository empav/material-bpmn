/**
 * Created by lukaj on 01/12/2016.
 */

var constants = require('../util/constants');

var HelpersFactory = function ($http, logger) {

    /**
     * Get from run time all existing Base Types
     * @returns [{base type},...]
     */
    var getAllBaseTypes = function () {
        return $http.get('./mocks/basetypes.json')
            .then(function (response) {
                return response.data.list;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    var getEventListener = function () {
        return $http.get('./mocks/events.json')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    return {
        getAllBaseTypes: getAllBaseTypes,
        getEventListener: getEventListener
    };
};

HelpersFactory.$inject = ['$http', 'logger'];

module.exports = HelpersFactory;
