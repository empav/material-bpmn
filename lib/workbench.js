var jquery = require('jquery');
var angular = require('angular');
//Bootstrap
var boot = require('bootstrap');
//Angular loading bar
var loadingBar = require('angular-loading-bar');
//Angular UI-Tree
var uitree = require('angular-ui-tree');
//Angular UI-Router
var uiRouter = require('angular-ui-router');
//Angular UI-Bootstrap
var uiBootstrap = require('angular-bootstrap');
//Toastr
var toastr = require('angular-toastr');


//var vkbeautify = require('../bower_components/vkBeautify-wrapper/dist/vkbeautify.0.99.00.beta');

//Material toolKit
// var chartist = require('./materialJs/chartist.min');
// var materialKit = require('./materialJs/material-kit');
// var materialMin = require('./materialJs/material.min');

var fs = require('fs');

var dashTemplate = fs.readFileSync(__dirname + '/dashboard/dashboard.html', {encoding: 'utf-8'});
var prjTemplate = fs.readFileSync(__dirname + '/dashboard/project/project.html', {encoding: 'utf-8'});
var homeTemplate = fs.readFileSync(__dirname + '/dashboard/home/home.html', {encoding: 'utf-8'});
var profileTemplate = fs.readFileSync(__dirname + '/dashboard/profile/profile.html', {encoding: 'utf-8'});
var detailTemplate = fs.readFileSync(__dirname + '/dashboard/detail/detail.html', {encoding: 'utf-8'});
var modelTemplate = fs.readFileSync(__dirname + '/dashboard/model/model.html', {encoding: 'utf-8'});

var constants = require('./util/constants');

var ngModule = angular.module('developer', [
    require('./navbar').name,
    require('./diagram').name,
    require('./factories').name,
    require('./interceptors').name,
    require('./logger').name,
    require('./dashboard').name,
    'ui.router',
    'angular-loading-bar',
    'ui.tree',
    'ui.bootstrap',
    'toastr'
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('home', {
                url: '/',
                title: 'Home',
                views: {
                    content: {
                        template: homeTemplate,
                        controller: 'HomeCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('home.dashboard', {
                title: 'Dashboard',
                views: {
                    mainPanel: {
                        template: dashTemplate,
                        controller: 'DashboardCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('home.projects', {
                url: 'projects',
                title: 'Projects',
                views: {
                    mainPanel: {
                        template: prjTemplate,
                        controller: 'ProjectCtrl',
                        controllerAs: 'projects'
                    }
                }
            })
            .state('home.detail', {
                url: 'detail',
                title: 'New Project',
                views: {
                    mainPanel: {
                        template: detailTemplate,
                        controller: 'DetailCtrl',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    project: null
                }
            })
            .state('home.profile', {
                url: 'profile',
                title: 'Profile',
                views: {
                    mainPanel: {
                        template: profileTemplate,
                        controller: 'ProfileCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('home.model', {
                url: 'model',
                title: 'Model',
                views: {
                    mainPanel: {
                        template: modelTemplate,
                        controller: 'ModelCtrl',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    projectId: null
                }
            });
        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);
    })

    .config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            timeOut: 3000
        });
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })

    .run(function ($rootScope) {
        $rootScope.pageTitle = constants.appName;
    });

module.exports = ngModule;
