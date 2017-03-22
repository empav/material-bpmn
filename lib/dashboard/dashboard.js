

'use strict';
var constants = require('../util/constants');
var DashboardCtrl = function ($rootScope) {
    var $ = require('jquery');
    var vm = this;

    var sidebar = angular.element('#sidebar'),
        mainPanel = angular.element('#mainPanel')

    $rootScope.$on('$stateChangeSuccess', function () {
        if (sidebar.hasClass('closed')) {
            sidebar.removeClass('closed');
        }
        if (mainPanel.hasClass('width100')) {
            mainPanel.removeClass('width100');
        }
    });

    // Material Dashboard Wizard Functions
    var seq = 0, delays = 80, durations = 500;
    var seq2 = 0, delays2 = 80, durations2 = 500;

    var md = {
        misc:{
            navbar_menu_visible: 0,
            active_collapse: true,
            disabled_collapse_init: 0,
        },

        startAnimationForLineChart: function(chart){

            chart.on('draw', function(data) {
                if(data.type === 'line' || data.type === 'area') {
                    data.element.animate({
                        d: {
                            begin: 600,
                            dur: 700,
                            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeOutQuint
                        }
                    });
                } else if(data.type === 'point') {
                    seq++;
                    data.element.animate({
                        opacity: {
                            begin: seq * delays,
                            dur: durations,
                            from: 0,
                            to: 1,
                            easing: 'ease'
                        }
                    });
                }
            });

            seq = 0;
        },
        startAnimationForBarChart: function(chart){

            chart.on('draw', function(data) {
                if(data.type === 'bar'){
                    seq2++;
                    data.element.animate({
                        opacity: {
                            begin: seq2 * delays2,
                            dur: durations2,
                            from: 0,
                            to: 1,
                            easing: 'ease'
                        }
                    });
                }
            });

            seq2 = 0;
        }
    };

    var type = ['','info','success','warning','danger'];
    var demo = {
        initDocumentationCharts: function(){
            /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

            var dataDailySalesChart = {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                series: [
                    [12, 17, 7, 17, 23, 18, 38]
                ]
            };

            var optionsDailySalesChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
            }

            var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

            md.startAnimationForLineChart(dailySalesChart);
        },

        initDashboardPageCharts: function(){

            /* ----------==========     Daily Sales Chart initialization    ==========---------- */

            var dataDailySalesChart = {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                series: [
                    [12, 17, 7, 17, 23, 18, 38]
                ]
            };

            var optionsDailySalesChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
            }

            var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

            md.startAnimationForLineChart(dailySalesChart);



            /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

            var dataCompletedTasksChart = {
                labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
                series: [
                    [230, 750, 450, 300, 280, 240, 200, 190]
                ]
            };

            var optionsCompletedTasksChart = {
                lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                }),
                low: 0,
                high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
            }

            var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

            // start animation for the Completed Tasks Chart - Line Chart
            md.startAnimationForLineChart(completedTasksChart);



            /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

            var dataEmailsSubscriptionChart = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                    [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

                ]
            };
            var optionsEmailsSubscriptionChart = {
                axisX: {
                    showGrid: false
                },
                low: 0,
                high: 1000,
                chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
            };
            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    }
                }]
            ];
            var emailsSubscriptionChart = Chartist.Bar('#emailsSubscriptionChart', dataEmailsSubscriptionChart, optionsEmailsSubscriptionChart, responsiveOptions);

            //start animation for the Emails Subscription Chart
            md.startAnimationForBarChart(emailsSubscriptionChart);
        }
    };

    $(document).ready(function(){
        // Javascript method's body can be found in assets/js/demos.js
        demo.initDashboardPageCharts();
    });

};

DashboardCtrl.$inject = ['$rootScope'];
module.exports = DashboardCtrl;



