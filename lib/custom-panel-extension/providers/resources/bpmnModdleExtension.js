/**
 * Created by lukaj on 2017-01-31.
 */

var moddleBpmn = require('bpmn-moddle/resources/bpmn/json/bpmn');

function extendModdle(){
    var portfolio = {
        name: "PortfolioTask",
        superClass: [
            "Task"
        ],
        properties: [
            {
                name: "implementation",
                isAttr: true,
                type: "String"
            },
            {
                name: "rule",
                isAttr: true,
                type: "String"
            },
            {
                name: "operationRef",
                type: "Operation",
                isAttr: true,
                isReference: true
            }
        ]
    };

    var writingToPortfolio = {
        name: "WritingToPortfolioTask",
        superClass: [
            "Task"
        ],
        properties: [
            {
                name: "implementation",
                isAttr: true,
                type: "String"
            },
            {
                name: "rule",
                isAttr: true,
                type: "String"
            },
            {
                name: "operationRef",
                type: "Operation",
                isAttr: true,
                isReference: true
            }
        ]
    };

    moddleBpmn.types.push(portfolio);
    moddleBpmn.types.push(writingToPortfolio);

    return moddleBpmn;
}

module.exports = function(){
    return extendModdle()
};
