/**
 * Created by lukaj on 21/10/2016.
 */
/* jshint -W101 */

var constants = require('../util/constants');

var ProjectFactory = function ($http, logger) {

    /**
     * get a full list of esistring projects
     * @param channelId
     * @returns {*}
     */
    var getAllProjects = function (pagination, filters) {
        var creationDate;
        if(typeof(filters.creationDate) === 'object' && filters.creationDate !== null){
            var year = filters.creationDate.getFullYear();
            var month = parseInt(filters.creationDate.getMonth()) + 1;
            if(month < 10){
                month = '0' + month;
            }
            var day = parseInt(filters.creationDate.getDate());
            if(day < 10){
                day = '0' + day;
            }
            creationDate = year + '-' + month + '-' + day;
        }else{
            creationDate = '';
        }

        return $http.get('./mocks/projects.json')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * create new project
     * @param channelId
     * @param project
     * @returns {*} projectId
     */
    var createProject = function (project) {

        var payload = {
            projectName: project.name,
            projectDescription: project.description
        };

        return $http.put(constants.mpProcessBaseUrl + '/projects/editor', payload, {headers: constants.headers})
            .then(function (response) {
                if (response.data.operationResult === 'OK') {
                    return response.data.list[0];
                }
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * Modify project description
     * @param channelId
     * @param selectedProject (@type Object)
     * @returns {*}
     */
    var modifyProject = function (selectedProject) {

        var payload = {
            projectId: selectedProject.id,
            projectDescription: selectedProject.description
        };

        return $http.put(constants.mpProcessBaseUrl + '/projects/editor', payload, {headers: constants.headers})
            .then(function (response) {
                return response.data.operationResult === 'OK' ? true : false;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * Delete project by project id
     * @param channelId
     * @param projectId
     * @returns {*}
     */
    var deleteProject = function (projectId) {

        var payload = {
            projectId: projectId
        };

        return $http.delete(constants.mpProcessBaseUrl + '/projects/editor/' + projectId, {headers: constants.headers})
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * Add a bpmn resource to an existrig project
     * @param channelId
     * @param projectId
     * @param fileName
     * @param bpmnXml
     * @returns {*}
     */

    var addProjectCmmnResource = function (resource) {
        return $http.put(constants.mpProcessBaseUrl + '/projects/editor/resource', resource, {headers: constants.headers})
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });
    };

    var addProjectBpmnResource = function (resource) {

        return $http.put(constants.mpProcessBaseUrl + '/projects/editor/resource', resource, {headers: constants.headers})
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });
    };

    /**
     * add rsource to project (BPMN, CMMN, ...)
     * @param resource
     */
    var addProjectResource = function (resource) {

        return $http.put(constants.mpProcessBaseUrl + '/projects/editor/resource', resource, {headers: constants.headers})
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return error;
            });
    };

    /**
     * update a bpmn resource of a project
     * @param channelId
     * @param projectId
     * @param resourceId
     * @param fileName
     * @param bpmnXml
     * @returns {*}
     */
    var editProjectBpmnResource = function (projectId, resourceId, fileName, bpmnXml, dataObjects) {

        var payload = {
            resourceId: resourceId,
            projectId: projectId,
            resourceType: 'BPMN',
            fileName: fileName,
            file: bpmnXml,
            resourceDoList: dataObjects
        };

        return $http.put(constants.mpProcessBaseUrl + '/projects/editor/resource', payload, {headers: constants.headers})
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    /**
     * delete a bpmn resource of a  project
     * @param resourceId
     * @returns {*}
     */
    var deleteProjectResource = function (resourceId) {

        return $http.delete(constants.mpProcessBaseUrl + '/projects/editor/resource/' + resourceId, {headers: constants.headers})
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };


    /**
     * get resources list of project
     * @param channelId
     * @param projectId
     * @returns {*}
     */
    var getProjectReourceList = function (projectId) {

        return $http.get('./mocks/getPrjResources.json')
            .then(function (response) {
                return response.data.list;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };
    /**
     * deploy project
     * @param channelId
     * @param projectId
     * @returns {*}
     */
    var deployProject = function (projectId) {

        var payload = {
            projectId: projectId
        };

        return $http.post(constants.mpProcessBaseUrl + '/projects/builder/compile', payload, {headers: constants.headers})
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                logger.error(error);
            });

    };

    var cloneProject = function(projectToBeCloned){
        //function to be defined on BE

        // No BE, no Party
        createProject(projectToBeCloned).then(function(newPrjResponse){

        });
    };

    var getLayoutDesigner = function (data) {
        return $http.get(constants.mpProcessBaseUrl + '/projects/editor/resource/layout/' + data.projectId + '/' + data.resourceId + '/' + data.taskId, {headers: constants.headers})
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    var saveLayoutDesigner = function (data) {
        var payload = {
            htmlDesigner: data.projectHtml,
            jsonDesigner: data.projectJson
        };
        return $http.put(constants.mpProcessBaseUrl + '/projects/editor/resource/saveHtml/' + data.projectId + '/' + data.resourceId + '/' + data.taskId, payload, {headers: constants.headers})
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                logger.error(error);
            });
    };

    return {
        getAllProjects: getAllProjects,
        createProject: createProject,
        modifyProject: modifyProject,
        deleteProject: deleteProject,
        addProjectBpmnResource: addProjectBpmnResource,
        addProjectCmmnResource: addProjectCmmnResource,
        addProjectResource: addProjectResource,
        editProjectBpmnResource: editProjectBpmnResource,
        deleteProjectResource: deleteProjectResource,
        getProjectReourceList: getProjectReourceList,
        deployProject: deployProject,
        getLayoutDesigner: getLayoutDesigner,
        saveLayoutDesigner: saveLayoutDesigner,
    };
};

ProjectFactory.$inject = ['$http', 'logger'];

module.exports = ProjectFactory;
