'use strict';

module.exports = function () {
    return {
        restrict: 'C',
        link: function postLink(scope, element) {
            scope.$watch('xml',function (val) {
                element.text(vkbeautify.xml(val, 4));
            });
        }
    };
};

