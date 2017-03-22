/**
 * Created by lukaj on 22/08/2016.
 */

'use strict';

var fs = require('fs');
var constants = require('../../util/constants');

var modaltemplate = fs.readFileSync(__dirname + '/../../modal/confirmDelete.html', {encoding: 'utf-8'});

var ProjectCtrl = function ($rootScope, $state, projectServices, $window, $modal) {

    var vm = this;

    //Setting page title
    $rootScope.pageTitle = constants.projects;

    vm.allProjects = [];
    vm.projectSelected = {}; //object for inline editing
    vm.creationLog = [];

    //object for new/clone adding
    vm.newProject = {
        name: '',
        description: '',
        rightViewEnabled: false
    };

    vm.pagination = {
        currentPage: 1,
        perPage: 10,
        totPages: 1
    };

    vm.filters = {
        orderBy: 'creationDate DESC',
        creationDate: '',
        search: ''
    };

    vm.isInedit = isInedit;
    vm.editProject = editProject;
    vm.saveProject = saveProject;
    vm.createNewProject = createNewProject;
    vm.reset = reset;
    vm.select = select;
    vm.getTotPagesArray = getTotPagesArray;
    vm.selectProjects = selectProjects;
    vm.nextPage = nextPage;
    vm.prevPage = prevPage;
    vm.inlineOrderBy = inlineOrderBy;
    vm.navigationDrawerRight = navigationDrawerRight;
    vm.descriptionPressEnter = descriptionPressEnter;
    vm.cloneProjectShow = cloneProjectShow;
    vm.resetNewProject = resetNewProject;
    vm.reload = reload;
    vm.logDone = logDone;
    vm.openDelete = openDelete;

    resetNewProject();
    vm.selectProjects();

    function isInedit(projectId) {
        return vm.projectSelected.id === projectId;
    }

    function editProject(selectedProject, index) {
        vm.projectSelected = angular.copy(selectedProject);
        vm.projectSelected.objIndex = index;
        setTimeout(function () {
            angular.element('#project_' + selectedProject.id).focus();
        }, 100);
    }

    function saveProject() {
        return projectServices.modifyProject(vm.projectSelected)
            .then(function (editedProject) {
                if (editedProject) {
                    vm.allProjects[vm.projectSelected.objIndex] = angular.copy(vm.projectSelected);
                    vm.projectSelected = {};
                }
            });
    }

    function createNewProject() {
        if (vm.newProject.clonedId) {
            //project to be cloned

            vm.creationLog.push("creating project ... ");
            return projectServices.createProject(vm.newProject)
                .then(function (response) {
                    var oldId = vm.newProject.clonedId;
                    var newId = response.id;

                    vm.creationLog.push("Project created ... ");
                    vm.creationLog.push("Loading project resources ... ");

                    return projectServices.getProjectReourceList(oldId)
                        .then(function (resourceList) {
                            //risorse caricate
                            vm.creationLog.push("Project Resources loaded");

                            var rescount = resourceList.length;

                            if (rescount === 0) {
                                vm.logDone("Project Cloned Successfully.", response);
                            }

                            angular.forEach(resourceList, function (value, key) {
                                vm.creationLog.push("Cloning resource " + value.resourceName + " ... ");

                                value.projectId = newId;
                                value.resourceId = null;

                                return projectServices.addProjectResource(value)
                                    .then(function (addedResponse) {
                                        vm.creationLog.push("Resource " + value.resourceName + " cloned");

                                        rescount--;

                                        if (rescount === 0) {
                                            vm.logDone("Project Cloned Successfully.", response);
                                        }
                                    });
                            });
                        });

                });
        } else {
            //new project
            return projectServices.createProject(vm.newProject).then(function (response) {
                if (response !== null) {
                    vm.logDone("Project Created Successfully.", response);
                }
            });
        }
    }

    function deleteProject(selectedProject, index) {
        projectServices.deleteProject(selectedProject.id).then(function (response) {
            if (response.data.operationResult === 'OK') {
                vm.allProjects.splice(index, 1);
                vm.selectProjects();
            }
        });
    }

    function openDelete(selectedProject, index) {
        var modalInstance = $modal.open({
            template: modaltemplate,
            backdrop: "static",
            controller: 'confirmDelete as vm',
            resolve: {
                options: function () {
                    return {
                        header: "Delete project ",
                        content: "Do you want to delete the project named ",
                        name: selectedProject.name,
                        endMark: "?",
                        action: function () {
                            deleteProject(selectedProject, index);
                        }
                    };
                }
            }
        });

        modalInstance.result.then(function () {

        }, function (event) {
            //case event = 'backdrop-click' => do nothing
        });
    }

    function reset() {
        vm.projectSelected = {};
    }

    function select(selectedProject) {
        $state.go('home.model', {projectId: selectedProject.id});
    }

    function getTotPagesArray() {
        var array = [];
        for (var i = 1; i <= vm.pagination.totPages; i++) {
            array.push(i);
        }
        if (array.length === 0) {
            array.push(1);
        }
        return array;
    }

    function selectProjects() {
        vm.pagination.currentPage = parseInt(vm.pagination.currentPage);
        return projectServices.getAllProjects(vm.pagination, vm.filters).then(function (response) {
            vm.pagination.totPages = parseInt(response.totPage);
            vm.allProjects = response.list;
            if (vm.pagination.currentPage == 1) {
                angular.element('#prev').addClass('disabled');
            } else {
                angular.element('#prev').removeClass('disabled');
            }
            if (vm.pagination.currentPage == vm.pagination.totPages) {
                angular.element('#next').addClass('disabled');
            } else {
                angular.element('#next').removeClass('disabled');
            }
        });
    }

    function nextPage() {
        if (vm.pagination.currentPage < vm.pagination.totPages) {
            vm.pagination.currentPage += 1;
            vm.selectProjects();
        }
    }

    function prevPage() {
        if (vm.pagination.currentPage > 1) {
            vm.pagination.currentPage -= 1;
            vm.selectProjects();
        }
    }

    function inlineOrderBy(field) {
        if (field + ' DESC' === vm.filters.orderBy) {
            vm.filters.orderBy = field + ' ASC';
        } else {
            vm.filters.orderBy = field + ' DESC';
        }
        vm.selectProjects();
    }

    function navigationDrawerRight(open) {
        if (open) {
            angular.element('#navigationDrawerRight').addClass('opened');
            angular.element('#backPanel').addClass('opened');
            angular.element('#projectName').focus();
        } else {
            angular.element('#navigationDrawerRight').removeClass('opened');
            angular.element('#backPanel').removeClass('opened');
            vm.resetNewProject();
        }
    }

    function descriptionPressEnter($event) {
        if ($event.keyCode == 13) {
            vm.saveProject();
            return false;
        }
    }

    function cloneProjectShow(selectedProjectObj, index) {
        var selectedProject = angular.copy(selectedProjectObj);
        vm.newProject.name = selectedProject.name + "_clone";
        vm.newProject.description = selectedProject.description;
        vm.newProject.clonedId = selectedProject.id;

        //trigger open
        vm.navigationDrawerRight(true);
    }

    function resetNewProject() {
        vm.newProject = {
            name: '',
            description: '',
            rightViewEnabled: false
        };
        vm.creationLog = [];
    }

    function reload(newProjectResponse) {
        vm.allProjects.push(angular.copy(newProjectResponse));
        vm.resetNewProject();
        vm.selectProjects();
        vm.navigationDrawerRight(false);
    }

    function logDone(textDone, response) {
        vm.creationLog.push(textDone);

        setTimeout(function () {
            vm.reload(response);
        }, 3000);
    }

};


ProjectCtrl.$inject = ['$rootScope', '$state', 'projectServices', '$window', '$modal'];

module.exports = ProjectCtrl;

