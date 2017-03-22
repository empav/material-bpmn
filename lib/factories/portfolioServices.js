/**
 * Created by lukaj on 11/01/2017.
 */
/* jshint -W101 */

var constants = require('../util/constants');

var PortfolioFactory = function ($http, logger) {
    /**
     * get a list of sections
     * @returns {*}
     */
    var getSections = function (portfolio) {
        return $http.get(constants.pfServices + '/sections/' + portfolio, {headers: constants.headers})
            .then(function (response) {
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of operations
     * @returns {*}
     */
    var getOperations = function (source) {
        return $http.get(constants.pfServices + '/operations/' + source, {headers: constants.headers})
            .then(function (response) {
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of parameters
     * @returns {*}
     */
    var getParameters = function (source) {
        return $http.get(constants.pfServices + '/parameters/' + source, {headers: constants.headers})
            .then(function (response) {
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of active portfolios
     * @returns {*}
     */
    var getActivePortfolios = function(){
        return $http.get('./mocks/list.json')
            .then(function (response) {
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of sections
     * @returns {*}
     */
    var getSections = function(portfolio){
        return $http.get(constants.pfServices + '/sections/' + portfolio, {headers: constants.headers})
            .then(function(response){
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of operations
     * @returns {*}
     */
    var getOperations = function(source){
        return $http.get(constants.pfServices + '/operations/' + source, {headers: constants.headers})
            .then(function(response){
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of parameters
     * @returns {*}
     */
    var getParameters = function(source){
        return $http.get(constants.pfServices + '/parameters/' + source, {headers: constants.headers})
            .then(function(response){
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * get a list of active portfolios
     * @returns {*}
     */
    var getActivePortfolios = function(){
        return $http.get('./mocks/list.json')
            .then(function(response){
                return response.data.responseEntity;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * Get data objects of portfolio
     * @param pfSource
     * @returns {*}
     */
    var getPfDataObjects = function(pfSource){
      return $http.get(constants.pfServices + '/describe/' + pfSource, {headers: constants.headers})
          .then(function (response) {
              return response.data.resourceDoList;
          })
          .catch(function (error) {
              logger.error(error);
          });
    };

    return {
        getActivePortfolios: getActivePortfolios,
        getOperations: getOperations,
        getParameters: getParameters,
        getPfDataObjects: getPfDataObjects,
        getSections: getSections,
    };
};

PortfolioFactory.$inject = ['$http', 'logger'];

module.exports = PortfolioFactory;
