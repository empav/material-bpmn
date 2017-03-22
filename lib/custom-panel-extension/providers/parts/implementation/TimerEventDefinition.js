'use strict';

var elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

var entryFactory = require('../../factory/CustomEntryFactory');
var _ = require('lodash');

/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */

function isDate(date) {
    return (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ) ? true : false;
}

function getTimerDefinitionType(timer) {
  var timeDate = timer.get('timeDate');
  if (typeof timeDate !== 'undefined') {
    return 'timeDate';
  }

  var timeCycle = timer.get('timeCycle');
  if (typeof timeCycle !== 'undefined') {
      return 'timeCycle';
  }

  var timeDuration = timer.get('timeDuration');
  if (typeof timeDuration !== 'undefined') {
    return 'timeDuration';
  }
}

/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @return {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
function createFormalExpression(parent, body, bpmnFactory) {
  body = body || undefined;
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
}

function TimerEventDefinition(group, element, bpmnFactory, timerEventDefinition) {

  var selectOptions = [
    { value: 'timeDate', name: 'Date' },
    { value: 'timeDuration', name: 'Duration' },
    { value: 'timeCycle', name: 'Cycle' }
  ];

  group.entries.push(entryFactory.selectBox({
    id: 'timer-event-definition-type',
    label: 'Timer Definition Type',
    selectOptions: selectOptions,
    emptyParameter: true,
    modelProperty: 'timerDefinitionType',

    get: function(element, node) {
      var timerDefinitionType = document.querySelector('#camunda-timer-event-definition-type-select');

      return {
        timerDefinitionType: getTimerDefinitionType(timerEventDefinition) || ''
      };
    },

    set: function(element, values) {
      var props = {
        timeDuration: undefined,
        timeDate: undefined,
        timeCycle: undefined
      };

      var newType = values.timerDefinitionType;
      if (values.timerDefinitionType) {
        var oldType = getTimerDefinitionType(timerEventDefinition);

        var value;
        if (oldType) {
          var definition = timerEventDefinition.get(oldType);
          value = definition.get('body');
        }

        props[newType] = createFormalExpression(timerEventDefinition, value, bpmnFactory);
      }
      return cmdHelper.updateBusinessObject(element, timerEventDefinition, props);
    }

  }));

  group.entries.push(entryFactory.datePickerTimeDate({
    id: 'timer-event-definition',
    label: 'Date definition',
    modelProperty: 'timerDefinition',
    type: 'timeDate',

    get: function(element, node) {
      var type = getTimerDefinitionType(timerEventDefinition);

      var definition = type && timerEventDefinition.get(type);
      var value = definition && definition.get('body');
      if (value && type == 'timeDate') {
          value = value.replace(":00z", "");
      }
      return {
          timerDefinition: value
      };
    },

    set: function(element, values) {
      var type = getTimerDefinitionType(timerEventDefinition);
      var definition = type && timerEventDefinition.get(type);

      if (definition) {
         if(values.timerDefinition && values.timerDefinition != ""){
             values.timerDefinition = values.timerDefinition +  ":00z";
         }
         return cmdHelper.updateBusinessObject(element, definition, { body: values.timerDefinition || undefined });
      }
    },
    validate: function(element) {
      var type = getTimerDefinitionType(timerEventDefinition);
      var definition = type && timerEventDefinition.get(type);
      if (definition) {
        var value = definition.get('body');
        if (!value) {
          return {
            timerDefinition: 'Must provide a value'
          };
        }
        if (!isDate(value)) {
              return {
                  timerDefinition: 'Must be a date'
              };
        }
      }
    },

    disabled: function(element) {
      var type = document.querySelector('#camunda-timer-event-definition-type-select');
      return type? !(type.value == 'timeDate') : true;
    }
  }));

  group.entries.push(entryFactory.datePickerTimeCycle({
    id: 'timer-event-definition-time-cycle',
    label: 'Cycle definition',
    modelProperty: 'timerDefinitionTimeCycle',
    type: 'timeCycle',

    get: function(element, node) {
       var type = getTimerDefinitionType(timerEventDefinition);
       var definition = type && timerEventDefinition.get(type);
       var body = definition && definition.get('body')
       var values = definition && definition.get('values')
       var date = '';
       var amount = '';
       var timeUnit = 'M';

        if (body && type == 'timeCycle') {
           if (isDate(body)) {
               body = body.replace(":00z", "");
               date = body;
               var input = document.querySelector('#camunda-date');
               input.value = body;
           } else {
               var areMinutes = /(?:PT)(.*)(?:M)/;
               var areDays = /(?:P)(.*)(?:D)/;
               var isNumber=/^[0-9]+$/;

               var firstMatch = areMinutes.exec(body)? areMinutes.exec(body)[1] : '';
               var secondMatch = areDays.exec(body)? areDays.exec(body)[1] : '';

               if (firstMatch.match(isNumber)){
                   amount = firstMatch;
               } else if(secondMatch.match(isNumber)){
                   amount = secondMatch;
                   timeUnit = 'D';
               }
           }
       }

       return {
           timeUnit: values ? values.timeUnit : timeUnit,
           date: values ? values.date : date,
           amount: values ? values.amount : amount,
           intervals: values ? values.intervals : '',
           timerDefinitionTimeCycle: body,
       };
    },

    set: function(element, values) {
       var type = getTimerDefinitionType(timerEventDefinition);
       var definition = type && timerEventDefinition.get(type);
       var body = "";
       if(values){
           if(values.intervals){
               body += 'R'+ values.intervals;
           }

           if (body != "" && values.amount){
               body += '/'
           }

           if(values.amount){
               if(values.timeUnit == 'D'){
                   body += 'P' + values.amount + 'D';
               } else {
                   body += 'PT' + values.amount + 'M';
               }

           }

           if (body != "" && values.date){
               body += '/'
           }

           if(values.date){
               body += values.date + ':00z';
           }
       }

       var values = {
           timeUnit: values.timeUnit,
           date: values.date,
           amount: values.amount,
           intervals: values.intervals,
       };
       if (definition) {
           return cmdHelper.updateBusinessObject(element, definition, { body: body, values : values || undefined });
       }
    },

    validate: function(element) {
       var type = getTimerDefinitionType(timerEventDefinition);
       var definition = type && timerEventDefinition.get(type);
       if (definition) {
          var body = definition.get('body');
          var values = definition.get('values');
          if (!body) {
             return {
                 date: 'Must provide a value',
                 amount: 'Must provide a value',
                 intervals: 'Must provide a value',
                 timerDefinitionTimeCycle: 'Must provide a value for at list one of inputs above '
             };
          }
       }
    },

    disabled: function(element) {
       var type = document.querySelector('#camunda-timer-event-definition-type-select');
       return type? !(type.value == 'timeCycle') : true;
    }

    }));

  group.entries.push(entryFactory.datePickerTimeDuration({
      id: 'timer-event-definition-time-duration',
      label: 'Duration definition',
      modelProperty: 'timerDefinitionTimeDuration',
      type: 'timeDuration',

      get: function(element, node) {
          var type = getTimerDefinitionType(timerEventDefinition);
          var definition = type && timerEventDefinition.get(type);
          var values = definition && definition.get('values');
          var body = definition && definition.get('body')

          return {
              timeUnit: values? values.timeUnit : '',
              timerDefinitionTimeDuration: values? values.timerDefinitionTimeDuration : body
          };
      },

      set: function(element, values) {
          var type = getTimerDefinitionType(timerEventDefinition);
          var definition = type && timerEventDefinition.get(type);
          if (definition) {
              var valutaType = document.querySelector('#camunda-select-values'),
                      valuta =  valutaType ? valutaType.value : 'M';
              var timerDefinition = (values.timerDefinitionTimeDuration && values.timerDefinitionTimeDuration != '') ? ( (( valuta == 'M') ? 'PT' : 'P' ) + values.timerDefinitionTimeDuration +  valuta ) : '';
              var values = {
                  timeUnit: values.timeUnit,
                  timerDefinitionTimeDuration: values.timerDefinitionTimeDuration,
              };
              return cmdHelper.updateBusinessObject(element, definition, { body: timerDefinition, values : values || undefined });
          }
      },

      validate: function(element) {
          var type = getTimerDefinitionType(timerEventDefinition);
          var definition = type && timerEventDefinition.get(type);
          if (definition) {
              var body = definition.get('body');
              var values = definition.get('values');
              if (!body) {
                  return {
                      timerDefinitionTimeDuration: 'Must provide a value'
                  };
              }

              var regex=/^[0-9]+$/;
              body = body.replace("P", "").replace("T", "").replace("M", "").replace("D", "");
              if (!body.match(regex))
              {
                  return {
                      timerDefinitionTimeDuration: 'Must input numbers'
                  };
              }
          }
      },

      disabled: function(element) {
          var type = document.querySelector('#camunda-timer-event-definition-type-select');
          return type? !(type.value == 'timeDuration') : true;
      }
  }));
}

module.exports = TimerEventDefinition;
