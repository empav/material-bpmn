/* jshint -W117, -W030 */

'use strict';

describe('Testing Dgr Controls Directive', function () {

    var controller,
        mockData = require('./dgrControls.mock');

    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('$rootScope', '$q', '$compile', 'projectServices', 'logger');
    });

    beforeEach(function () {

        sinon.stub(projectServices, 'deployProject').returns($q.when(mockData.deployProject()));
        sinon.stub(projectServices, 'addProjectBpmnResource').returns($q.when(mockData.addProjectBpmnResource()));
        sinon.stub(projectServices, 'deleteProjectResource').returns($q.when(mockData.deleteProjectResource()));

        //Instantiate directive.
        var element = angular.element('<dgr-controls diagram-manager="diagramManager"></dgr-controls>');

        var scope = $rootScope.$new();

        //DiagramManager to test the directive against
        scope.diagramManager = {
            workbench: mockData.getWorkbench(),
            getBpmnXml: sinon.spy(),
            createProcess: sinon.spy(),
            openProcess: sinon.spy()
        };

        $compile(element)(scope);

        scope.$digest();

        //Grab controller instance
        controller = element.controller('dgrControls');

    });

    bard.verifyNoOutstandingHttpRequests();

    describe('After Activate', function () {
        it('directive controller should be created successfully', function () {
            expect(controller).to.exist;
        });
        it('directive controller should have all its functions', function () {
            expect(controller.openFsProcess).to.exist;
            expect(controller.newProcess).to.exist;
            expect(controller.deployProject).to.exist;
            expect(controller.toggleFullScreen).to.exist;
            expect(controller.toggleZoom).to.exist;
            expect(controller.togglePropertiesPanelBy).to.exist;
            expect(controller.source).to.exist;
            expect(controller.switchResource).to.exist;
            expect(controller.newResource).to.exist;
            expect(controller.preSave).to.exist;
            expect(controller.hideDetail).to.exist;
            expect(controller.saveCurrentProcess).to.exist;
            expect(controller.reassign).to.exist;
        });

        describe('Testing its functions', function () {
            it('should call projectServices.deployProject() when deploy() is invoked', function () {
                controller.deployProject();

                expect(projectServices.addProjectBpmnResource).to.have.been.calledOnce;

            });

            it('should call diagramManager.createProcess() when newProcess() is invoked', function () {
                controller.newProcess();

                controller.diagramManager.createProcess.should.have.been.calledOnce;

            });

            it('should call projectServices.addProjectBpmnResource() when saveCurrentProcess() is invoked', function () {
                controller.saveCurrentProcess();

                controller.diagramManager.getBpmnXml.should.have.been.calledOnce;

                projectServices.addProjectBpmnResource.should.have.been.calledOnce;

            });

            it('should open a new resource tab when switchResource() is invoked', function () {
                var resource = controller.workbench.currentResource;

                controller.switchResource(resource, false);

                controller.diagramManager.openProcess.should.have.been.calledOnce;
            });

            it('should set the resource as active and open a tab when switchResource() is invoked', function () {
                var resource = controller.workbench.currentResource;
                var tabs = controller.workbench.sheets;

                //Calling function with tabs empty
                controller.switchResource(resource, false);

                tabs.should.have.length(1);
                tabs[0].active.should.be.true;
                controller.diagramManager.openProcess.should.have.been.calledOnce;

            });

            it('should set the resource as active and open a second tab when switchResource() is invoked', function () {
                var resource = controller.workbench.currentResource;
                var tabs = controller.workbench.sheets;

                //Pushing the same resource
                tabs.push(resource);

                //Calling function
                controller.switchResource(resource, false);

                controller.workbench.currentResource.active.should.be.true;
                controller.diagramManager.openProcess.should.have.been.calledOnce;

            });

            it('should set the resource as not active and open a second active tab when switchResource() is invoked', function () {
                var resource = controller.workbench.currentResource;
                var tabs = controller.workbench.sheets;

                //Pushing the same resource without resourceId
                delete resource.resourceId;
                tabs.push(resource);

                //Calling function
                controller.switchResource(resource, false);

                tabs[0].active.should.be.false;
                tabs[1].active.should.be.true;

                controller.diagramManager.openProcess.should.have.been.calledOnce;

            });

            it('should set the resource as not active and open a second active tab when switchResource() is invoked', function () {
                var resource = controller.workbench.currentResource;
                var tabs = controller.workbench.sheets;

                //Pushing a new resource with a different resourceId
                tabs.push(angular.copy(resource));
                tabs[0].resourceId = '2';

                //Calling function
                controller.switchResource(resource, false);

                tabs[0].active.should.be.false;
                tabs[1].active.should.be.true;

                controller.diagramManager.openProcess.should.have.been.calledOnce;

            });

            it('should set currentPropertyDisplay when source() is invoked', function () {
                controller.source(2);

                controller.workbench.currentPropertyDisplay.should.be.equals(2);
            });

            it('should reassign a new resourceId when reassign() is invoked', function () {
                controller.reassign('3');

                controller.workbench.resources.should.have.length(1);
            });

            it('should reassign a new resourceId when reassign() is invoked', function () {
                var resource = controller.workbench.currentResource;
                var tabs = controller.workbench.sheets;

                //Pushing a new active resource
                tabs.push(angular.copy(resource));
                tabs[0].active = true;

                controller.reassign('3');

                controller.workbench.resources.should.have.length(1);
                tabs[0].resourceId.should.be.equal('3');
            });

            it('should delete a resource when deleteProjectResource() is invoked', function () {

                controller.deleteProjectResource();

                projectServices.deleteProjectResource.should.have.been.calledOnce;
            });

        });

    });

});
