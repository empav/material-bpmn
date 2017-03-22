var constants = require('../../../../../lib/util/constants');

var mockData = (function () {
    return {
        deployProject: deployProject,
        addProjectBpmnResource: addProjectBpmnResource,
        deleteProjectResource: deleteProjectResource,
        getWorkbench : getWorkbench
    };

    function deleteProjectResource() {
        return {
            data: {
                'operationResult': 'OK',
                'list': [],
                'messages': []
            }
        };
    }

    function deployProject() {
        return {
            data: {
                'operationResult': 'OK',
                'list': [],
                'messages': []
            }
        };
    }

    function addProjectBpmnResource() {
        return {
            data: {
                'operationResult': 'OK',
                'list': [],
                'messages': []
            }
        };
    }

    function getWorkbench() {
        return {
            currentResource: {
                cfgResourceTypes: {
                    id: 1,
                    description: 'BPMN'
                },
                resourceData: constants.bpmnEmpty,
                resourceDoList: [],
                projectId: 123,
                resourceName: 'test',
                resourceId: '1'
            },
            sheets: [],
            resources: []
        };
    }


})();

module.exports = mockData;
