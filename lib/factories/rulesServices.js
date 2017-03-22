/**
 * Created by lukaj on 24/10/2016.
 */
/* jshint -W101 */

var constants = require('../util/constants');

var RulesFactory = function ($http, logger) {

    /**
     * get a full list of existing rules
     * @param channelId
     * @returns {*}
     */
    var getAllRules = function () {

        var payload = {
            channelElement: constants.channel
        };

        return $http.get('./mocks/bychannel&products.json')
            .then(function (response) {
                return response.data.list;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    return {
        getAllRules: getAllRules
    };
};

RulesFactory.$inject = ['$http', 'logger'];

module.exports = RulesFactory;
