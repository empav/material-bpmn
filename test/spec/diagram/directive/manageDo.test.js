/**
 * Created by lukaj on 06/12/2016.
 */
/* jshint -W117, -W030 */

describe('Testing Manage Do Directive', function () {
    var controller,
        mock = require('./manageDo.mock');

    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('$controller', '$rootScope', '$q', '$compile', 'portfolioServices');
    });

    beforeEach(function () {
        sinon.stub(portfolioServices, 'getActivePortfolios').returns($q.when(mock.getActivePortfolios()));
        sinon.stub(portfolioServices, 'getPfDataObjects').withArgs('source').returns($q.when(mock.getPfDataObjects()));

        var element = angular.element('<manage-do do="dataObjects" baseTypes="baseTypes"></manage-do>');

        //set directive scope
        var scope = $rootScope.$new();
        scope.dataObjects = mock.getDataObjects();
        scope.baseTypes = mock.getAllBaseTypes();

        //Instantiate directive.
        $compile(element)(scope);

        scope.$digest();

        //Grab controller instance
        controller = element.controller('manageDo');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('Testing controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.exist;
        });

        it('should have all its functions', function () {
            expect(controller.toggle).to.be.defined;
            expect(controller.collapseAll).to.be.defined;
            expect(controller.expandAll).to.be.defined;
            expect(controller.backupRestoreDO).to.be.defined;
            expect(controller.saveInstance).to.be.defined;
            expect(controller.remove).to.be.defined;
            expect(controller.edit).to.be.defined;
            expect(controller.add).to.be.defined;
            expect(controller.clearDo).to.be.defined;
            expect(controller.switchToImportMode).to.be.defined;
            expect(controller.checkInstances).to.be.defined;
            expect(controller.getDOTypes).to.be.defined;
            expect(controller.newDOType).to.be.defined;
            expect(controller.hidePanels).to.be.defined;
            expect(controller.showTooltip).to.be.defined;
            expect(controller.showWarning).to.be.defined;
            expect(controller.visible).to.be.defined;
            expect(controller.checkDo).to.be.defined;
            expect(controller.getDOFromPortfolio).to.be.defined;
            expect(controller.importDOFromPortfolio).to.be.defined;
        });

        it('should backup all dataobjects', function () {

            var count = controller.do.length;

            controller.backupRestoreDO(true);

            expect(controller.backupdo).to.have.length(count);
            expect(controller.do).to.have.length(0);

        });

        it('should restore all dataobjects', function () {

            var count = controller.backupdo.length;

            controller.backupRestoreDO(false);

            expect(controller.do).to.have.length(count);
            expect(controller.backupdo).to.have.length(0);

        });

        it('should check if there is an instance', function () {
            controller.selectedField = {
                instances: [{
                    name: 'name',
                    dimensions: 0
                }]
            };

            var instance = {
                name: 'name',
                dimensions: 0
            };

            //check true result
            var res = controller.checkInstances(instance);
            expect(res).to.be.true;

            //check false result
            instance.name = 'name1';
            res = controller.checkInstances(instance);
            expect(res).to.be.false;
        });

        it('should return true if there is an instance else false', function () {
            controller.selectedField = {
                instances: [{
                    name: 'name',
                    dimensions: 0
                }]
            };

            var instance = {
                name: 'name',
                dimensions: 0
            };

            //check true result
            var res = controller.checkInstances(instance);
            expect(res).to.be.true;

            //check false result
            instance.name = 'name1';
            res = controller.checkInstances(instance);
            expect(res).to.be.false;
        });

        it('should remove a node with fields from the tree', function () {
            var scope = {
                $modelValue: mock.getSingleDataObjectWithOneField()[0],
                remove: sinon.spy()
            };

            controller.remove(scope);

            scope.remove.should.have.been.calledOnce;

            expect(controller.selectedField).to.be.undefined;
            expect(controller.scope).to.be.undefined;
            expect(controller.instancesPanel).to.be.false;

        });

        it('should remove parent node and all its nested children if there is one single field', function () {
            var scope = {
                $parentNodeScope: {
                    $modelValue: mock.getSingleDataObjectWithOneField()[0],
                    remove: sinon.spy()
                },
                $modelValue: mock.getSingleDataObjectWithOneField()[0].fields[0],
                remove: sinon.spy()
            };

            controller.remove(scope);

            scope.$parentNodeScope.remove.should.have.been.calledOnce;

            expect(controller.selectedField).to.be.undefined;
            expect(controller.scope).to.be.undefined;
            expect(controller.instancesPanel).to.be.false;

        });

        it('should remove a nested child if current node has multiple fields', function () {
            var scope = {
                $parentNodeScope: {
                    $modelValue: mock.getSingleDataObjectWithTwoFields()[0],
                    remove: sinon.spy()
                },
                $modelValue: mock.getSingleDataObjectWithTwoFields()[0].fields[1],
                remove: sinon.spy()
            };

            controller.remove(scope);

            scope.remove.should.have.been.calledOnce;

            expect(controller.selectedField).to.be.undefined;
            expect(controller.scope).to.be.undefined;
            expect(controller.instancesPanel).to.be.false;

        });

        it('should open instances panel on edit', function () {
            var obj = {
                scope: {
                    $modelValue: {name: 'name', descrip: 'descrip'}
                },
                instancesPanel: {name: 'name', descrip: 'descrip'}
            };

            controller.edit(obj.scope, obj.instancesPanel);

            expect(controller.instancesPanel).to.be.equal(obj.instancesPanel);
            expect(controller.selectedField).to.be.equal(obj.scope.$modelValue);
            expect(controller.scope).to.be.equal(obj.scope);

        });

        it('should add a new nested dataobject to the tree', function () {
            var scope = {
                $modelValue: mock.getSingleDataObjectWithOneField()[0]
            };

            var count = scope.$modelValue.fields.length;

            controller.add(scope, 0);

            expect(scope.$modelValue.fields).to.have.length(count + 1);
            expect(scope.$modelValue.fields[1].fields).to.have.length(1);

        });

        it('should add a new nested field to a dataobject', function () {
            var scope = {
                $modelValue: mock.getSingleDataObjectWithOneField()[0]
            };

            var count = scope.$modelValue.fields.length;

            controller.add(scope, 1);

            expect(scope.$modelValue.fields).to.have.length(count + 1);
            expect(scope.$modelValue.fields[1].fields).to.be.null;

        });

        it('should add a new DO in an empty list', function () {

            controller.do = [];

            controller.add();

            expect(controller.do).to.have.length(1);

        });

        it('should clear all DO', function () {

            controller.clearDo(true);

            expect(controller.do).to.have.length(0);

        });

        it('should get all DO types in a new array', function () {

            controller.getDOTypes(mock.getDataObjects());

            expect(controller.doTypes).to.have.length(4);

        });

        it('should switch to import mode and get Active Portfolios', function () {

            controller.switchToImportMode();

            $rootScope.$apply();

            expect(controller.portfolios).to.have.length(mock.getActivePortfolios().length);

            expect(controller.isEdit).to.be.false;

        });

        it('should get data objects from portfolio', function () {

            controller.getDOFromPortfolio('source');

            $rootScope.$apply();

            expect(controller.do).to.have.length(mock.getPfDataObjects().length);

        });

        it('should import data objects from portfolio', function () {

            controller.backupdo = [{name: 'name'}];

            var count = controller.do.length;

            controller.importDOFromPortfolio(0);

            expect(controller.do).to.have.length(count + 1);

        });

        it('should push selected data object', function () {

            var node = mock.getDataObjects()[0];
            node.imported = true;

            controller.pushSelectedDo(node);

            expect(controller.backupdo[0].fieldName).to.be.equal(node.fieldName);

        });

    });
});
