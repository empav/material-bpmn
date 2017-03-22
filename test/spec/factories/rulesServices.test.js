/**
 * Created by epavan on 02/12/2016.
 */
/* jshint strict: true, -W117, -W030 */

'use strict';

describe('Testing Rules Services', function () {

    // Set up the module
    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('rulesServices');
    });

    it('should have getAllRules API exposed', function () {
        expect(rulesServices.getAllRules).to.exist;
    });

});
