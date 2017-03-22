/**
 * Created by epavan on 16/02/2017.
 */

exports.config = {

    directConnect: true,

    // location of your E2E test specs
    specs: [
        '../e2e/*.e2e.js'
    ],

    // configure multiple browsers to run tests
    capabilities: {
        'browserName': 'chrome'
    },

    rootElement: 'body',

    // url where your app is running, relative URLs are prepending with this URL
    baseUrl: 'http://localhost:9000/',

    // testing framework, jasmine is the default
    framework: 'mocha',

    mochaOpts: {
        ui: 'bdd',
        reporter: "spec",
        slow: 3000,
        timeout: 10000
    }
};
