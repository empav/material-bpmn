/**
 * Created by epavan on 24/01/2017.
 */

'use strict';
var fs = require('fs'),
    XmlWriter = require('moddle-xml/lib/writer'),
    template = fs.readFileSync(__dirname + '/dgrSheets.html', {encoding: 'utf-8'});

function link(scope) {
    var $ = require('jquery');
    var hidWidth;
    var scrollBarWidths = 40;
    var self = this;
    var widthOfList = function(){
        var itemsWidth = 0;
        $('.list li a').each(function(){
            var itemWidth = $(this).outerWidth();
            itemsWidth+=itemWidth;
        });
        return itemsWidth;
    };

    var widthOfHidden = function(){
        return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
    };

    var getLeftPosi = function(){
        return $('.list').position().left;
    };

    var reAdjust = function(){
        if (($('.wrapper').outerWidth()) < widthOfList()) {
            $('.scroller-right').show();
        }
        else {
            $('.scroller-right').hide();
        }

        if (getLeftPosi()<0) {
            $('.scroller-left').show();
        }
        else {
            $('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
            $('.scroller-left').hide();
        }
    }

    $('.list').bind('DOMNodeInserted DOMNodeRemoved', function() {
        reAdjust();
    });

    $(window).on('resize',function(e){
        reAdjust();
    });

    $('.scroller-right').click(function() {

        $('.scroller-left').fadeIn('slow');
        $('.scroller-right').fadeOut('slow');

        $('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){

        });
    });

    $('.scroller-left').click(function() {

        $('.scroller-right').fadeIn('slow');
        $('.scroller-left').fadeOut('slow');

        $('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){

        });
    });
}

var controller = function () {
    var vm = this;

    vm.workbench = vm.diagramManager.workbench;

    vm.remove = function (index,typeId) {
        if (vm.workbench.sheets.length === 1) {
            return;
        }

        if (vm.workbench.sheets[index].active) {
            vm.workbench.sheets.forEach(function (item, i) {
                if (index !== 0) {
                    if ((index - 1) === i) {
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                } else {
                    vm.workbench.sheets[index + 1].active = true;
                }
            });

            if (index === 0) {
                vm.workbench.currentResource = vm.workbench.sheets[index + 1];
            } else {
                vm.workbench.currentResource = vm.workbench.sheets[index - 1];
            }
            switchDiagram(typeId);
        }

        vm.workbench.sheets.splice(index, 1);
    };

    vm.setActive = function (res, index) {
        if (vm.workbench.sheets.length === 1) {
            return;
        }

        vm.workbench.sheets.forEach(function (item, i) {
            if (index === i) {
                item.active = true;
            } else {
                item.active = false;
            }
        });

        saveDiagram();

        vm.workbench.currentResource = vm.workbench.sheets[index];

        switchDiagram(res.cfgResourceTypes.id);
    };

    function switchDiagram(typeId) {
        vm.diagramManager.openProcess(vm.workbench.currentResource, true);
    }

    function saveDiagram(){

        vm.diagramManager.renderer.moddle.toXML(vm.diagramManager.renderer.definitions, {format: true}, function (err, xml) {
            vm.workbench.currentResource.resourceData = xml;
        });

/*
        vm.diagramManager.getBpmnXml(function (err, xml) {
            if(!err){
                vm.workbench.currentResource.resourceData = xml;
            }
        });*/
    }
};

controller.$inject = [];

module.exports = function () {
    return {
        scope: {
            diagramManager: '='
        },
        restrict: 'E',
        replace: true,
        template: template,
        bindToController: true,
        controller: controller,
        controllerAs: 'vm',
        link : link
    };
};
