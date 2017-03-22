'use strict';

var Workbench = (function() {

    function Workbench($http) {
        /**
         * The workbench event bus
         */
        this.eventBus = null;

        this.update = null;

        /**
         * Process rules (all rules needed for a process)
         */
        this.rules = [];

        this.usedRulesByTask = {};

        /**
         * all data objects setted within user task
         */
        this.dataObjects = {};

        this.project={};
        this.currentPropertyDisplay = '';
        this.intermediateMessagesList =  [];
        this.activePortfolios = [];
        this.predefinedForms = [];
        this.renderer = undefined;

        this.getUsedRules = function(){
            var usedRulesId = [];
            for (var taskId in this.usedRulesByTask) {
                if (this.usedRulesByTask.hasOwnProperty(taskId)) {
                    usedRulesId.push(this.usedRulesByTask[taskId]);
                }
            }

            return usedRulesId;
        };
    }
    return Workbench;
})();
module.exports = Workbench;
