/**
 * Created by epavan on 06/12/2016.
 */
/* jshint -W117, -W030 */

describe('Testing Model Controller', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('$controller', '$rootScope');
    });

    beforeEach(function () {
        controller = $controller('ModelCtrl');
        $rootScope.$apply();
    });


    describe('Model controller', function () {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function () {
            it('should have workbench set up properly', function () {
                expect(controller.workbench).to.be.defined;
                expect(controller.workbench).to.have.property('eventBus').that.is.a('object');
                expect(controller.workbench).to.have.property('update').that.is.a('function');
                expect(controller.workbench).to.have.property('rules').that.is.a('array');
                expect(controller.workbench).to.have.property('dataObjects').that.is.a('object');
            });
        });
    });


});
