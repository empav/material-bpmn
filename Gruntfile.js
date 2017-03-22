'use strict';

var childProcess = require('child_process');

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    paths: [
                        'assets/less',
                        'node_modules/bootstrap/less'
                    ]
                },
                files: {
                    'dist/css/workbench.css': 'assets/less/workbench.less'
                }
            }
        },

        karma: {
            options: {
                configFile: 'test/config/karma.unit.js'
            },
            single: {
                singleRun: true,
                autoWatch: false
            },
            continuous: {
                background: true
            }
        },

        protractor: {
            options: {
                configFile: 'test/config/protractor.conf.js',
                keepAlive: false,
                noColor: false
            },
            all: {}
        },

        ngAnnotate: {
            options: {
                remove: false,
                add: true,
                singleQuotes: false
            },
            app: {
                files: {
                    'dist/workbench.js': 'dist/workbench.js'
                }
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true,
                    list: true,
                    insertGlobalVars: {
                        process: function () {
                        },
                        Buffer: function () {
                        }
                    }
                },
                transform: ['brfs']
            },
            app: {
                files: {
                    'dist/workbench.js': ['lib/workbench.js']
                }
            },
            watch: {
                options: {
                    watch: true
                },
                files: {
                    'dist/workbench.js': ['lib/workbench.js']
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    mangle: false
                },
                files: {
                    'dist/workbench.min.js': ['dist/workbench.js']
                }
            }
        },

        jshint: {
            lib: [
                ['lib']
            ],
            options: {
                jshintrc: true
            }
        },

        clean: {
            all: [
                'dist/**'
            ]
        },

        copy: {
            resources: {
                files: [
                    // bootstrap
                    {
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/css',
                        src: ['bootstrap.min.css'],
                        dest: 'dist/css'
                    },
                    // ui-tree
                    {
                        expand: true,
                        cwd: 'node_modules/angular-ui-tree/dist',
                        src: ['angular-ui-tree.css'],
                        dest: 'dist/css'
                    },

                    // bootstrap fonts
                    {expand: true, cwd: 'node_modules/bootstrap/dist/fonts', src: ['*'], dest: 'dist/fonts'},

                    // bpmn font
                    {expand: true, cwd: 'node_modules/bpmn-js/assets/bpmn-font/font', src: ['*'], dest: 'dist/fonts'},

                    // cmmn font
                    {expand: true, cwd: 'node_modules/cmmn-js/assets/cmmn-font/font', src: ['*'], dest: 'dist/fonts'},

                    // index.html
                    {expand: true, cwd: 'lib', src: ['index.html'], dest: 'dist'},

                    // images
                    {expand: true, cwd: 'assets/images', src: ['*'], dest: 'dist/images'},

                    //Favicon
                    {expand: true, cwd: 'assets/images', src: ['favicon.ico'], dest: 'dist'},

                    //font
                    {expand: true, cwd: 'assets/fonts', src: ['*'], dest: 'dist/fonts'},

                    //Mocks
                    {expand: true, cwd: 'mocks/', src: ['*'], dest: 'dist/mocks'}

                ]
            },

            debugOverlay: {
                files: [{
                    src: require.resolve('bpmn-js-debug-overlay/assets/debug-overlay.css'),
                    dest: 'dist/css/debug-overlay.css'
                }]
            },

            chartist: {
                files: [{
                    src: require.resolve('chartist/dist/chartist.min.css'),
                    dest: 'dist/chartist/chartist.min.css'
                },
                {
                    src: require.resolve('chartist/dist/chartist.js'),
                    dest: 'dist/chartist/chartist.js'
                }]
            },

            diagramJS: {
                files: [{
                    src: require.resolve('diagram-js/assets/diagram-js.css'),
                    dest: 'dist/css/diagram-js.css'
                }]
            },

            bpmJS: {
                files: [{
                    src: require.resolve('bpmn-js/assets/bpmn-font/css/bpmn-embedded.css'),
                    dest: 'dist/css/bpmn-embedded.css'
                }]
            },

            cmmJS: {
                files: [{
                    src: require.resolve('cmmn-js/assets/cmmn-font/css/cmmn-embedded.css'),
                    dest: 'dist/css/cmmn-embedded.css'
                }]
            }
        },
        watch: {
            less: {
                files: ['assets/less/**/*.less'],
                tasks: ['less', 'replace:dev']
            },
            resources: {
                files: [
                    'lib/**/*.*',
                    'assets/img/**.*',
                    'assets/font/workbench.*'
                ],
                tasks: ['copy:resources', 'replace:dev']
            },
            karma: {
                files: ['app/js/**/*.js', 'test/unit/*.js'],
                tasks: ['karma:continuous:run']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '*',
                    base: 'dist/'
                }
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'context',
                            replacement: '/custom/workbench'
                        },
                        {
                            match: 'minification',
                            replacement: 'min.js'
                        },
                        {
                            match: 'logo',
                            replacement: '/custom/workbench'
                        },
                        {
                            match: 'materialIcons',
                            replacement: '/custom/workbench'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['dist/index.html'], dest: 'dist'},
                    {expand: true, flatten: true, src: ['dist/workbench.js'], dest: 'dist'},
                    {expand: true, flatten: true, src: ['dist/css/workbench.css'], dest: 'dist/css'}
                ]
            },
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'context',
                            replacement: '.'
                        },
                        {
                            match: 'minification',
                            replacement: 'js'
                        },
                        {
                            match: 'logo',
                            replacement: ''
                        },
                        {
                            match: 'materialIcons',
                            replacement: '../..'
                        }
                    ]
                },
                files: [
                    {expand: true, flatten: true, src: ['dist/index.html'], dest: 'dist'},
                    {expand: true, flatten: true, src: ['dist/workbench.js'], dest: 'dist'},
                    {expand: true, flatten: true, src: ['dist/css/workbench.css'], dest: 'dist/css'}
                ]
            }
        }
    });

    grunt.registerTask('test', ['karma:single']);

    grunt.registerTask('auto-test', ['karma:continuous:start', 'watch:karma']);

    grunt.registerTask('e2e-test', ['ensureSelenium', 'protractor:all']);

    grunt.registerTask('build', [
        'clean',
        'less',
        'browserify:app',
        'copy',
        'replace:dist',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('auto-build', [
        'clean',
        'less',
        'copy',
        'browserify:watch',
        'replace:dev',
        'connect',
        'watch'
    ]);

    grunt.registerTask('ensureSelenium', function () {
        // Ensure selenium is installed and updated
        var doneES = this.async();

        childProcess.execFile('node', [__dirname + '/node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager', '--chrome', 'update'], function (err) {
            if (err) {
                console.error(err);
            } else {
                doneES();
            }
        });
    });

    grunt.registerTask('default', ['build']);
};
