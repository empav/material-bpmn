/**
 * Created by epavan on 24/11/2016.
 */

'use strict';

var path = require('path');

var basePath = '../../';

var absoluteBasePath = path.resolve(path.join(__dirname, basePath)),
    absoluteLibPath = path.resolve(path.join(__dirname, basePath, 'lib'));

module.exports = function (config) {
    config.set({

        basePath: basePath,

        frameworks: ['browserify', 'mocha', 'chai-dom', 'chai', 'sinon', 'chai-sinon'],

        // files to include, ordered by dependencies
        files: [
            // include relevant Angular files and libs
            'lib/workbench.js',
            //Angular Mocks
            'node_modules/angular-mocks/angular-mocks.js',
            //BardJS
            'node_modules/bardjs/dist/bard.js',
            //include unit test specs
            {pattern: 'test/spec/**/*.test.js', watched: false, included: true, served: true}
        ],

        // karma has its own autoWatch feature but Grunt watch can also do this
        singleRun: false,
        autoWatch: true,

        reporters: ['mocha'],

        preprocessors: {
            'lib/workbench.js': ['browserify'],
            'test/spec/**/*.js': ['browserify']
        },

        // browsers to test against, be sure to install the correct karma browser launcher plugin
        browsers: ['PhantomJS'],

        colors: true,

        browserNoActivityTimeout: 30000,

        browserify: {
            debug: true,
            paths: [absoluteLibPath, absoluteBasePath],
            transform: ['brfs']
        }
    });
};
