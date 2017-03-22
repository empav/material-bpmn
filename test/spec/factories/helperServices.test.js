/**
 * Created by epavan on 02/12/2016.
 */
/* jshint strict: true, -W117, -W030 */

'use strict';

describe('Testing Helper Services', function () {

    // Set up the module
    beforeEach(function () {
        bard.appModule('developer');
        bard.inject('helperServices');
    });

    it('should have getAllBaseTypes API exposed', function () {
        expect(helperServices.getAllBaseTypes).to.exist;
    });

});
