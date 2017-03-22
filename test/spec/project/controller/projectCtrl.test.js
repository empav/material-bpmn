/**
 * Created by epavan on 05/12/2016.
 */
/* jshint -W117, -W030 */

describe('Testing Project Controller', function () {
    var controller;
    var mock = require('./projectCtrl.mock');

    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('$controller', '$rootScope', '$q', 'projectServices');
    });

    beforeEach(function () {
        sinon.stub(projectServices, 'getAllProjects').returns($q.when(mock.getAllProjects()));
        sinon.stub(projectServices, 'modifyProject').returns($q.when(mock.modifyProject()));
        sinon.stub(projectServices, 'createProject').returns($q.when(mock.createProject()));
        sinon.stub(projectServices, 'getProjectReourceList').returns($q.when(mock.getProjectReourceList()));

        controller = $controller('ProjectCtrl');
        $rootScope.$apply();
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Projects controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.exist;
        });

        describe('after activate', function () {
            it('should have allProjects set up to []', function () {
                expect(controller.allProjects).to.exist;
            });

            it('should have projectSelected set up to {}', function () {
                expect(controller.projectSelected).to.be.defined;
            });

            it('should have creationLog set up to []', function () {
                expect(controller.creationLog).to.exist;
            });

            it('should have newProject set up to an object with 3 params', function () {
                expect(controller.newProject).to.exist;
                expect(controller.newProject).to.have.property('name').that.is.a('string');
                expect(controller.newProject).to.have.property('description').that.is.a('string');
                expect(controller.newProject).to.have.property('rightViewEnabled').that.is.a('boolean');
            });

            it('should have pagination set up to an object with 3 params', function () {
                expect(controller.pagination).to.exist;
                expect(controller.pagination).to.have.property('currentPage').that.is.a('number');
                expect(controller.pagination).to.have.property('perPage').that.is.a('number');
                expect(controller.pagination).to.have.property('totPages').that.is.a('number');
            });

            it('should have pagination set up to an object with 3 params', function () {
                expect(controller.filters).to.exist;
                expect(controller.filters).to.have.property('orderBy').that.is.a('string');
                expect(controller.filters).to.have.property('creationDate').that.is.a('string');
                expect(controller.filters).to.have.property('search').that.is.a('string');
            });

            it('should have at least 1 project', function () {
                expect(controller.allProjects).to.have.length.above(0);
            });

            it('should have projects count of 5', function () {
                expect(controller.allProjects).to.have.length(5);
            });

            describe('Function isInedit', function(){
                it('Should be defined', function(){
                    expect(controller.isInedit).to.be.defined;
                });

                it('Should verify if given project id is the one in edit', function(){
                    var projectSelected = {
                        creationDate : 1483605752710,
                        creationUser : "abcd",
                        description : "TEST_ALE_2",
                        editDate : 1484145262308,
                        editUser : "abcd",
                        id : "a3142e19-11aa-4324-a8d9-4d9011c350a5",
                        name : "TEST_ALE_2",
                        objIndex : 4
                    };

                    controller.projectSelected = projectSelected;

                    var res1 = controller.isInedit('a3142e19-11aa-4324-aaaa-4d9011c350a5');
                    expect(res1).to.be.false;

                    var res2 = controller.isInedit("a3142e19-11aa-4324-a8d9-4d9011c350a5");
                    expect(res2).to.be.true;
                });
            });

            describe('Function editProject', function(){
                it('Should be defined', function(){
                    expect(controller.editProject).to.be.defined;
                });

                it('Should set in edit the given project', function(){

                    var selectedProject = {
                        creationDate : 1483605752710,
                        creationUser : "abcd",
                        description : "TEST_ALE_2",
                        editDate : 1484145262308,
                        editUser : "abcd",
                        id : "a3142e19-11aa-4324-a8d9-4d9011c350a5",
                        name : "TEST_ALE_2",
                        objIndex : 4
                    };

                    var index = 4;

                   controller.editProject(selectedProject, index);

                   expect(controller.projectSelected.id).to.equal(selectedProject.id);
                   expect(controller.projectSelected.objIndex).to.equal(index);
                });
            });

            describe('Function saveProject', function(){
                it('Should be defined', function(){
                    expect(controller.saveProject).to.be.defined;
                });

                it('Should save the selected project', function(){
                    var allProjects = (mock.getAllProjects()).list;
                    controller.allProjects = allProjects;

                    var selectedProject = allProjects[0];
                    selectedProject.description = "nuova descrizione";
                    selectedProject.objIndex = 0;

                    controller.projectSelected = selectedProject;

                    var res = controller.saveProject().then(function(){
                        expect(controller.allProjects[0].description).to.equal("nuova descrizione");
                        expect(controller.projectSelected).to.eql({});
                    });
                });
            });

            describe('Function createNewProject', function(){
                it('Should be defined', function(){
                    expect(controller.createNewProject).to.be.defined;
                });

                describe('Project cloning', function(){
                    it('Should clone the given project', function(){
                        //TODO: DEEPLY TEST THIS FUNCTION

                        var newProject = mock.newProject;
                        newProject.clonedId =  '53624dbf-76a8-4c8b-87b2-118b081848d6';

                        var creation = controller.createNewProject()
                            .then(function(){
                                //verify creationLog 6
                                expect(controller.creationLog).to.have.length(1);
                            });

                    });
                });

                describe('Project new creation', function () {

                });
            });

            describe('Function reset', function(){
                it('Should be defined', function(){
                    expect(controller.reset).to.be.defined;
                });

                it('Should reset projectSelected', function(){
                    controller.reset();
                    expect(controller.projectSelected).to.eql({});
                });
            });

            describe('Function select', function(){
                it('Should be defined', function(){
                    expect(controller.select).to.be.defined;

                    //select function sets $location and open $window
                    //no unit-test needed
                });
            });

            describe('Function getTotPagesArray', function(){
                it('Should be defined', function(){
                    expect(controller.getTotPagesArray).to.be.defined;
                });

                it('Should create array of total pages available', function () {
                    controller.pagination.totPages = 3;

                    //case n > 0 pages
                    var res = controller.getTotPagesArray();
                    expect(res).to.be.a('array');
                    expect(res).to.have.length(3);

                    //case 0 pages
                    controller.pagination.totPages = 0;
                    var res2 = controller.getTotPagesArray();
                    expect(res2).to.be.a('array');
                    expect(res2).to.have.length(1);
                })
            });

            describe('Function selectProjects', function(){
                it('Should be defined', function(){
                    expect(controller.selectProjects).to.be.defined;
                });

                var mockedProjectsCount = mock.getAllProjects().list.length;

                it('Should get alla projects within given pagination: currentPage string', function(){
                    //case current page in string
                    controller.pagination = {
                        currentPage : 1
                    };
                    controller.filters = {};
                    controller.allProjects = [];
                    controller.pagination.currentPage = '1';

                    var prom = controller.selectProjects()
                        .then(function(){
                           expect(controller.pagination.totPages).to.be.equal(1);
                           expect(controller.allProjects).to.have.length(mockedProjectsCount);
                        });

                });

                it('Should get alla projects within given pagination: currentPage number', function(){
                    //case current page in int
                    controller.pagination = {
                        currentPage : 1
                    };
                    controller.filters = {};
                    controller.allProjects = [];
                    controller.pagination.currentPage = 1;
                    var prom2 = controller.selectProjects()
                        .then(function(){
                            expect(controller.pagination.totPages).to.be.equal(1);
                            expect(controller.allProjects).to.have.length(mockedProjectsCount);
                        });
                });
            });

            describe('Function nextPage', function(){
                it('Should be defined', function(){
                    expect(controller.nextPage).to.be.defined;
                });

                it('Should load the nexr page: case current 1 next 2', function(){
                    controller.pagination = {
                        currentPage : 1,
                        totPages: 2
                    };

                    controller.nextPage();
                    expect(controller.pagination.currentPage).to.be.equal(2);
                });

                it('Should load the nexr page: case current 1 no other pages', function(){
                    controller.pagination = {
                        currentPage : 1,
                        totPages: 1
                    };

                    controller.nextPage();
                    expect(controller.pagination.currentPage).to.be.equal(1);
                });
            });

            describe('Function prevPage', function(){
                it('Should be defined', function(){
                    expect(controller.prevPage).to.be.defined;
                });

                it('Should load the previous page: case current 1', function(){
                    controller.pagination = {
                        currentPage : 1
                    };

                    controller.prevPage();
                    expect(controller.pagination.currentPage).to.be.equal(1);
                });

                it('Should load the previous page: case current 2', function(){
                    controller.pagination = {
                        currentPage : 2
                    };

                    controller.prevPage();
                    expect(controller.pagination.currentPage).to.be.equal(1);
                });

            });

            describe('Function navigationDrawerRight', function(){
                it('Should be defined', function(){
                    expect(controller.navigationDrawerRight).to.be.defined;
                });

                //html elements toggle classes => no unit-test
            });

            describe('Function descriptionPressEnter', function(){
                it('Should be defined', function(){
                    expect(controller.descriptionPressEnter).to.be.defined;
                });

                it('Should fire save on enter key event', function(){
                   var $event = {
                       keyCode: 13
                   };

                   var res = controller.descriptionPressEnter($event);
                   expect(res).to.be.false;
                });

                it('Should do nothing on other keys events', function(){
                    var $event = {
                        keyCode: 0
                    };

                    var res = controller.descriptionPressEnter($event);
                    expect(res).to.be.undefined;
                });
            });

            describe('Function cloneProjectShow', function(){
                it('Should be defined', function(){
                    expect(controller.cloneProjectShow).to.be.defined;
                });

                it('Should prepare right section for cloning project', function(){
                    var allProjects = (mock.getAllProjects()).list;
                    var selectedProject = allProjects[0];

                    controller.cloneProjectShow(selectedProject, 0);

                    expect(controller.newProject.name).to.be.equal(selectedProject.name + '_clone');
                    expect(controller.newProject.description).to.be.equal(selectedProject.description);
                    expect(controller.newProject.clonedId).to.be.equal(selectedProject.id);
                });
            });

            describe('Function resetNewProject', function(){
                it('Should be defined', function(){
                    expect(controller.resetNewProject).to.be.defined;
                });

                it('Should reset newProject object', function(){
                    controller.newProject = {
                        name: 'ciccio',
                        description: 'pasticcio',
                        rightViewEnabled: true
                    };
                    controller.creationLog = [];
                    controller.creationLog.push('log 1');
                    controller.creationLog.push('log 2');

                    controller.resetNewProject();

                    expect(controller.newProject).to.be.eql({
                        name: '',
                        description: '',
                        rightViewEnabled: false
                    })
                });

                it('Should reset creation log array', function(){
                    controller.newProject = {
                        name: 'ciccio',
                        description: 'pasticcio',
                        rightViewEnabled: true
                    };
                    controller.creationLog = [];
                    controller.creationLog.push('log 1');
                    controller.creationLog.push('log 2');

                    controller.resetNewProject();
                    expect(controller.creationLog).to.have.length(0);
                });
            });

            describe('Function reload', function(){
                it('Should be defined', function(){
                    expect(controller.reload).to.be.defined;
                });

                it('should add new project', function(){
                    var allProjects = (mock.getAllProjects()).list;
                    var newProject = allProjects[0];

                    controller.allProjects = [];

                    controller.reload(newProject);

                    expect(controller.allProjects).to.have.length(1);
                });
            });

            describe('Function logDone', function(){
                it('Should be defined', function(){
                    expect(controller.logDone).to.be.defined;
                });

                it('Should add last done log', function () {
                    controller.creationLog = [];

                    controller.logDone("logCiccio");
                    expect(controller.creationLog[0]).to.be.equal("logCiccio");
                });
            });
        });
    });
});
