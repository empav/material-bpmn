/**
 * Created by epavan on 05/12/2016.
 */
/* jshint -W079 */

var mockData = (function () {
    return {
        getAllProjects: getAllProjects,
        modifyProject: modifyProject,
        createProject: createProject,
        getProjectReourceList: getProjectReourceList,
        newProject: {
            name: 'CAMBIO PREMIO',
            description: 'processo di cambio premio',
            rightViewEnabled: false
        }
    };

    function getAllProjects() {
        return {
            totPage: 1,
            list: [{
                'id': '0c3c5225-85e0-4e43-b20f-79677eb09d10',
                'name': 'POC_DEMO_TEST',
                'creationDate': 1478801195842,
                'creationUser': 'abcd',
                'editDate': null,
                'editUser': null,
                'description': 'TEST DEMO'
            }, {
                'id': 'f30d6371-25fa-425f-b079-97358f66f25a',
                'name': 'ILT_TEST_POC_1',
                'creationDate': 1478686565214,
                'creationUser': 'abcd',
                'editDate': 1478854214493,
                'editUser': 'dfastr',
                'description': 'aaaa'
            }, {
                'id': '53624dbf-76a8-4c8b-87b2-118b081848d6',
                'name': 'CAMBIO PREMIO',
                'creationDate': 1478854994460,
                'creationUser': 'abcd',
                'editDate': null,
                'editUser': null,
                'description': 'processo di cambio premio'
            }, {
                'id': '8b34b0bc-d570-4515-bd16-c3e540f0b24e',
                'name': 'test_ilt1',
                'creationDate': 1480945405875,
                'creationUser': 'abcd',
                'editDate': null,
                'editUser': null,
                'description': 'test_ilt1'
            }, {
                'id': '6434865b-5b77-4368-8dbc-6bd69c6c2db6',
                'name': 'test_ilt1',
                'creationDate': 1480950373289,
                'creationUser': 'abcd',
                'editDate': null,
                'editUser': null,
                'description': 'sdlkfj'
            }]
        };
    }

    function modifyProject(){
            return true;
    }

    function createProject(){
        return {
            id: '53624dbf-1111-2222-3333-118b081848d6'
        }
    }

    function getProjectReourceList(){
        return [
            {
                cfgResourceTypes :{
                    id: 1,
                    description: "BPMN"
                },
                projectId : "5c63028d-4d46-46bd-9a45-79040e28a66b",
                resourceData : "<xml ... >",
                resourceDoList : [],
                resourceId  : "4cb715b6-baed-4e08-bcf5-29bb43221636",
                resourceName : "ScriptTask"
            },
            {
                cfgResourceTypes :{
                    id: 1,
                    description: "BPMN"
                },
                projectId : "5c63028d-4d46-asdfasf- 9a45-79040e28a66b",
                resourceData : "<xml ... >",
                resourceDoList : [],
                resourceId  : "4cb715b6-baed-4asdfsdfcf5-29bb43221636",
                resourceName : "ScriptTask2"
            }
        ]
    }
})();

module.exports = mockData;
