'use strict';

var fs = require('fs'),
    template = fs.readFileSync(__dirname + '/source.html', {encoding: 'utf-8'});


var controller = function () {

};

controller.$inject = [];

module.exports = function () {
    return {
        scope: {
            xml: '='
        },
        restrict: 'E',
        replace: true,
        controller: controller,
        controllerAs: 'vm',
        template: template
    };
};

