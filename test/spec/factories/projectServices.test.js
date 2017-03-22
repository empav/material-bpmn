/**
 * Created by epavan on 02/12/2016.
 */
/* jshint strict: true, -W117, -W030 */

'use strict';

describe('Testing Project Services', function () {

    // Set up the module
    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('projectServices');
    });

    it('should have getAllProjects API exposed', function () {
        expect(projectServices.getAllProjects).to.exist;
    });
    it('should have createProject API exposed', function () {
        expect(projectServices.createProject).to.exist;
    });
    it('should have modifyProject API exposed', function () {
        expect(projectServices.modifyProject).to.exist;
    });
    it('should have deleteProject API exposed', function () {
        expect(projectServices.deleteProject).to.exist;
    });
    it('should have addProjectBpmnResource API exposed', function () {
        expect(projectServices.addProjectBpmnResource).to.exist;
    });

    it('should have editProjectBpmnResource API exposed', function () {
        expect(projectServices.editProjectBpmnResource).to.exist;
    });
    it('should have deleteProjectResource API exposed', function () {
        expect(projectServices.deleteProjectResource).to.exist;
    });
    it('should have getProjectReourceList API exposed', function () {
        expect(projectServices.getProjectReourceList).to.exist;
    });
    it('should have deployProject API exposed', function () {
        expect(projectServices.deployProject).to.exist;
    });

});
