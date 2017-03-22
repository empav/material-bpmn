'use strict';
var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    selectPortfolio = require('./implementation/SelectPortfolio'),
    selectSection = require('./implementation/SelectSection'),
    selectMethod = require('./implementation/SelectMethod'),
    portfolioProperties = require('./implementation/PortfolioProperties'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    dataObjectsSelect = [];

var forEach = require('lodash/collection/forEach'),
    find = require('lodash/collection/find');
var utils = require('bpmn-js-properties-panel/lib/Utils');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;


function portfoliosType(element){
    if (is(element, 'bpmn:PortfolioTask')) {
        return 'bpmn:PortfolioTask';
    }
    return 'bpmn:WritingToPortfolioTask';
}

function ensureFormKeyAndDataSupported(element){
    if (is(element, 'bpmn:PortfolioTask') || is(element, 'bpmn:WritingToPortfolioTask')) {
        return true;
    }
    return false;
}

module.exports = function(group, element, bpmnFactory, workbench) {

    var portfolios = workbench.activePortfolios;
    console.log("PORTFOLIOS:",portfolios);
    var bo = getBusinessObject(element);
    var portfoliosSelect = [];
    if(portfolios){
        portfoliosSelect = portfolios.map(function (el) {
            var id = -1;
            for (var i = 0; i < workbench.activePortfolios.length; i++) {
                if (workbench.activePortfolios[i].source == el.source) {
                    id = i;
                    break;
                }
            }
            return {
                value: id,
                name: el.name
            };
        });
    }

    if (!ensureFormKeyAndDataSupported(element)) {
        return;
    }
    // Portfolio select box
    group.entries = group.entries.concat(selectPortfolio(element, bpmnFactory, {
        id: 'portfolio',
        label: 'Select a portfolio',
        elementName: 'portfolio',
        elementType: portfoliosType(element),
    }, workbench.activePortfolios));

    group.entries = group.entries.concat(selectSection(element, bpmnFactory, {
        id: 'section',
        label: 'Select a section',
        elementName: 'section',
        elementType: portfoliosType(element),
        referenceProperty: 'sectionRef',
        newElementIdPrefix: 'Section_'
    }, workbench));

    group.entries = group.entries.concat(selectMethod(element, bpmnFactory, {
        id: 'method',
        label: 'Select a method',
        elementName: 'method',
        elementType: portfoliosType(element),
        referenceProperty: 'methodRef',
        newElementIdPrefix: 'Method_'
    }, workbench));

    if (is(element, 'bpmn:PortfolioTask')){
        group.entries = group.entries.concat(portfolioProperties(element, bpmnFactory, {
            label: 'Parameters',
            description: 'Select the method',
            elementName: 'parameter',
            elementType: portfoliosType(element),
            referenceProperty: 'parameterRef',
            newElementIdPrefix: 'Parameter_'
        }, workbench));
    }
};
