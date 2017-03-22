/* jshint -W117 */

var chai = require('chai');
var promised = require('chai-as-promised');
chai.use(promised);
var expect = chai.expect;

describe('Testing Home page (projects)', function () {

    beforeEach(function () {
        browser.get('/');
    });

    it('should route to projects page', function () {
        expect(browser.getCurrentUrl()).to.eventually.eq('http://localhost:9000/#/project');
    });

    it('should have a title in the browser tab', function () {
        expect(browser.getTitle()).to.eventually.eq('Euris Workbench');
    });

    it('projects table should have 10 rows at first', function () {
        var tr = $$('.table tbody tr');
        expect(tr.count()).to.eventually.eq(10);
    });

    it('clicking new project should open an overlay panel sliding from the right', function () {
        element(by.id('newProjectBtn')).click();

        var drawerClass = element(by.id('navigationDrawerRight')).getAttribute('class');

        expect(drawerClass).to.eventually.eq('opened');
    });

    it('creating a new project should put a new row into the table', function () {
        element(by.id('newProjectBtn')).click();

        browser.sleep(1000);

        element(by.model('projects.newProject.name')).sendKeys('TEST_NEW_PROJECT');

        browser.sleep(1000);

        element(by.model('projects.newProject.description')).sendKeys('TEST_NEW_PROJECT');

        browser.sleep(1000);

        element(by.buttonText('SAVE PROJECT')).click();

        browser.sleep(5000);

        var prjName = element(by.repeater('prj in projects.allProjects').row(0).column('prj.name'));

        expect(prjName.getText()).to.eventually.eq('TEST_NEW_PROJECT');

    });


});
