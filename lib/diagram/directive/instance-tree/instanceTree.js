/**
 * Created by lukaj on 2017-02-10.
 */
var fs = require('fs');
var template = fs.readFileSync(__dirname + '/instanceTree.html', {encoding: 'utf-8'});

var instanceTreeController = function($scope){
    var vm = this;
    console.log(vm.list);

    $scope.collapseAll = function(node){
        if(node) {
            if(node.length >0 ){
                for (var i = 0; i < node.length; i++) {
                    node[i].dropDown = false;
                    if (node) {
                        $scope.collapseAll(node[i].fields);
                    }
                }
            } else {
                node.dropDown = false;
            }
        }
    };

    $scope.expandAll = function(node){
        if(node){
            if(node.length >0 ){
                for(var i=0; i < node.length; i++){
                    node[i].dropDown = true;
                    if(node){
                        $scope.expandAll(node[i].fields);
                    }
                }
            } else {
                node.dropDown = true;
            }
        }
    };

    $scope.action = function(node) {
        if(node.fields && node.fields.length > 0){
            node.dropDown=!node.dropDown;
            return;
        }
        // $scope.callback(node,name);

        $scope.callback(node.referenceName);
    };


};


instanceTreeController.$inject = ['$scope'];

module.exports = function () {
    return {
        scope: {
            list: '=',
            callback:'='
        },
        restrict: 'E',
        controller: instanceTreeController,
        controllerAs: 'vm',
        template: template
    };
};
