/**
 * Created by lukaj on 2017-02-17.
 */

var constants = require('../util/constants');

var HelpersFactory = function ($http, logger) {

    /**
     * Get the list of predefined forms available
     */
    var getPredefinedFormsList = function () {

        return $http.get('./mocks/formlist.json')
            .then(function (response) {
                return response.data.list;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    var getFormFields = function (formId) {
        return $http.get(constants.mpProcessBaseUrl + '/predefined_resources/list/fields/' + formId, {headers: constants.headers})
            .then(function (response) {
                return response.data.list;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    return {
        getPredefinedFormsList: getPredefinedFormsList,
        getFormFields: getFormFields
    };
};

HelpersFactory.$inject = ['$http', 'logger'];

module.exports = HelpersFactory;
