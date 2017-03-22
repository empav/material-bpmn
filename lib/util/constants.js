/**
 * Created by epavan on 06/12/2016.
 */

var constants = {
    appName: 'Modeler',
    projects: 'Projects',
    mpProcessBaseUrl: 'http://192.168.60.14:28080/mp-process-manager-rest',
    mtDescriptorBaseUrl: 'http://192.168.60.14:28080/mt-descriptor',
    pfServices: 'http://192.168.60.14:28080/pf-services/services',
    mtEventListener: 'http://192.168.60.14:28080/mp-event-listener/events',
    headers: {
        'Authorization': 'abcd',
        'ChannelElement': '1'
    },
    cmmnEmpty: '<?xml version="1.0" encoding="UTF-8"?>' +
    '<cmmn:definitions xmlns:dc="http://www.omg.org/spec/CMMN/20151109/DC" ' +
    'xmlns:di="http://www.omg.org/spec/CMMN/20151109/DI" ' +
    'xmlns:cmmndi="http://www.omg.org/spec/CMMN/20151109/CMMNDI" ' +
    'xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Test" ' +
    'targetNamespace="http://bpmn.io/schema/cmmn">' +
    '<cmmn:case id="Case_1">' +
    '<cmmn:casePlanModel id="CasePlanModel_1" name="A CasePlanModel">' +
    '<cmmn:planItem id="PlanItem_1" definitionRef="Task_1" />' +
    '<cmmn:task id="Task_1" />' +
    '</cmmn:casePlanModel>' +
    '</cmmn:case>' +
    '<cmmndi:CMMNDI>' +
    '<cmmndi:CMMNDiagram id="CMMNDiagram_1">' +
    '<cmmndi:Size xsi:type="dc:Dimension" width="500" height="500" />' +
    '<cmmndi:CMMNShape id="DI_CasePlanModel_1" cmmnElementRef="CasePlanModel_1">' +
    '<dc:Bounds x="114" y="63" width="534" height="389" />' +
    '<cmmndi:CMMNLabel />' +
    '</cmmndi:CMMNShape>' +
    '<cmmndi:CMMNShape id="PlanItem_1_di" cmmnElementRef="PlanItem_1">' +
    '<dc:Bounds x="150" y="96" width="100" height="80" />' +
    '<cmmndi:CMMNLabel />' +
    '</cmmndi:CMMNShape>' +
    '</cmmndi:CMMNDiagram>' +
    '</cmmndi:CMMNDI>' +
    '</cmmn:definitions>',

    bpmnEmpty: '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
    'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
    'targetNamespace="http://bpmn.io/schema/bpmn" ' +
    'id="Definitions_1">' +
    '<bpmn:process id="Process_1" isExecutable="false">' +
    '<bpmn:startEvent id="StartEvent_1"/>' +
    '</bpmn:process>' +
    '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
    '<bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
    '<dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>' +
    '</bpmndi:BPMNShape>' +
    '</bpmndi:BPMNPlane>' +
    '</bpmndi:BPMNDiagram>' +
    '</bpmn:definitions>'
};

module.exports = constants;
