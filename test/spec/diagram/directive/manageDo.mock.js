/**
 * Created by lukaj on 06/12/2016.
 */


var mockData = (function () {
    return {
        getAllBaseTypes: getAllBaseTypes,
        getActivePortfolios: getActivePortfolios,
        getDataObjects: getDataObjects,
        getPfDataObjects: getPfDataObjects,
        getSingleDataObjectWithOneField: getSingleDataObjectWithOneField,
        getSingleDataObjectWithTwoFields: getSingleDataObjectWithTwoFields
    };

    function getPfDataObjects() {
        return [
            {
                'fieldName': 'DO1',
                'fieldType': {
                    'name': 'DO1',
                    'cod': null,
                    'description': 'DO1',
                    'elementaryType': null,
                    'validations': null
                },
                'dimensions': 0,
                'fieldLabel': 'DO1',
                'source': null,
                'version': null,
                'fields': [
                    {
                        'fieldName': 'do1-field1',
                        'fieldType': {
                            'id': 11,
                            'name': 'Coefficiente',
                            'cod': 'BSTYP_11',
                            'description': 'coefficiente di aggravamento',
                            'elementaryType': 'NUMBER',
                            'validations': [
                                {
                                    'key': 'numberAfterComma',
                                    'value': '4'
                                },
                                {
                                    'key': 'numberBeforeComma',
                                    'value': '1'
                                },
                                {
                                    'key': 'numberIsPercentage',
                                    'value': '0'
                                },
                                {
                                    'key': 'numberMaxValue',
                                    'value': '1.0'
                                },
                                {
                                    'key': 'numberMinValue',
                                    'value': '0.0'
                                }
                            ]
                        },
                        'dimensions': 0,
                        'fieldLabel': 'do1-field1',
                        'source': null,
                        'version': null,
                        'fields': null,
                        'instances': null
                    },
                    {
                        'fieldName': 'DO11',
                        'fieldType': {
                            'name': 'DO11',
                            'cod': null,
                            'description': 'DO11',
                            'elementaryType': null,
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'DO11',
                        'source': null,
                        'version': null,
                        'fields': [
                            {
                                'fieldName': 'do11-field11',
                                'fieldType': {
                                    'id': 14,
                                    'name': 'N_1000',
                                    'cod': 'BSTYP_14',
                                    'description': 'numerica naturali',
                                    'elementaryType': 'NUMBER',
                                    'validations': [
                                        {
                                            'key': 'numberAfterComma',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberBeforeComma',
                                            'value': '1000'
                                        },
                                        {
                                            'key': 'numberIsPercentage',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberMaxValue',
                                            'value': '1000.0'
                                        },
                                        {
                                            'key': 'numberMinValue',
                                            'value': '0.0'
                                        }
                                    ]
                                },
                                'dimensions': 0,
                                'fieldLabel': 'do11-field11',
                                'source': null,
                                'version': null,
                                'fields': null,
                                'instances': null
                            }
                        ],
                        'instances': null
                    }
                ],
                'instances': [
                    {
                        'dimensions': 0,
                        'name': 'DO1'
                    }
                ]
            },
            {
                'fieldName': 'DO2',
                'fieldType': {
                    'name': 'DO2',
                    'cod': null,
                    'description': 'DO2',
                    'elementaryType': null,
                    'validations': null
                },
                'dimensions': 0,
                'fieldLabel': 'DO2',
                'source': null,
                'version': null,
                'fields': [
                    {
                        'fieldName': 'do2-field2',
                        'fieldType': {
                            'id': 3,
                            'name': 'BOOLEAN',
                            'cod': 'BSTYP_3',
                            'description': 'booleano',
                            'elementaryType': 'BOOLEAN',
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'do2-field2',
                        'source': null,
                        'version': null,
                        'fields': null,
                        'instances': null
                    },
                    {
                        'fieldName': 'DO22',
                        'fieldType': {
                            'name': 'DO22',
                            'cod': null,
                            'description': 'DO22',
                            'elementaryType': null,
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'DO22',
                        'source': null,
                        'version': null,
                        'fields': [
                            {
                                'fieldName': 'do22-field22',
                                'fieldType': {
                                    'id': 8,
                                    'name': 'YYYY',
                                    'cod': 'BSTYP_8',
                                    'description': 'definizione anno',
                                    'elementaryType': 'NUMBER',
                                    'validations': [
                                        {
                                            'key': 'numberAfterComma',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberBeforeComma',
                                            'value': '4'
                                        },
                                        {
                                            'key': 'numberIsPercentage',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberMaxValue',
                                            'value': '9999.0'
                                        },
                                        {
                                            'key': 'numberMinValue',
                                            'value': '1.0'
                                        }
                                    ]
                                },
                                'dimensions': 0,
                                'fieldLabel': 'do22-field22',
                                'source': null,
                                'version': null,
                                'fields': null,
                                'instances': null
                            }
                        ],
                        'instances': null
                    }
                ],
                'instances': [
                    {
                        'dimensions': 0,
                        'name': 'DO2'
                    }
                ]
            }
        ];
    }

    function getSingleDataObjectWithTwoFields() {
        return [
            {
                'fieldName': 'DO1',
                'fieldType': {
                    'name': 'DO1',
                    'cod': null,
                    'description': 'DO1',
                    'elementaryType': null,
                    'validations': null
                },
                'dimensions': 0,
                'fieldLabel': 'DO1',
                'source': null,
                'version': null,
                'fields': [
                    {
                        'fieldName': 'do1-field1',
                        'fieldType': {
                            'id': 11,
                            'name': 'Coefficiente',
                            'cod': 'BSTYP_11',
                            'description': 'coefficiente di aggravamento',
                            'elementaryType': 'NUMBER',
                            'validations': [
                                {
                                    'key': 'numberAfterComma',
                                    'value': '4'
                                },
                                {
                                    'key': 'numberBeforeComma',
                                    'value': '1'
                                },
                                {
                                    'key': 'numberIsPercentage',
                                    'value': '0'
                                },
                                {
                                    'key': 'numberMaxValue',
                                    'value': '1.0'
                                },
                                {
                                    'key': 'numberMinValue',
                                    'value': '0.0'
                                }
                            ]
                        },
                        'dimensions': 0,
                        'fieldLabel': 'do1-field1',
                        'source': null,
                        'version': null,
                        'fields': null,
                        'instances': null
                    },
                    {
                        'fieldName': 'DO11',
                        'fieldType': {
                            'name': 'DO11',
                            'cod': null,
                            'description': 'DO11',
                            'elementaryType': null,
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'DO11',
                        'source': null,
                        'version': null,
                        'fields': [
                            {
                                'fieldName': 'do11-field11',
                                'fieldType': {
                                    'id': 14,
                                    'name': 'N_1000',
                                    'cod': 'BSTYP_14',
                                    'description': 'numerica naturali',
                                    'elementaryType': 'NUMBER',
                                    'validations': [
                                        {
                                            'key': 'numberAfterComma',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberBeforeComma',
                                            'value': '1000'
                                        },
                                        {
                                            'key': 'numberIsPercentage',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberMaxValue',
                                            'value': '1000.0'
                                        },
                                        {
                                            'key': 'numberMinValue',
                                            'value': '0.0'
                                        }
                                    ]
                                },
                                'dimensions': 0,
                                'fieldLabel': 'do11-field11',
                                'source': null,
                                'version': null,
                                'fields': null,
                                'instances': null
                            }
                        ],
                        'instances': null
                    }
                ],
                'instances': [
                    {
                        'dimensions': 0,
                        'name': 'DO1'
                    }
                ]
            }];
    }

    function getSingleDataObjectWithOneField() {
        return [
            {
                'fieldName': 'DO1',
                'fieldType': {
                    'name': 'DO1',
                    'cod': null,
                    'description': 'DO1',
                    'elementaryType': null,
                    'validations': null
                },
                'dimensions': 0,
                'fieldLabel': 'DO1',
                'source': null,
                'version': null,
                'fields': [
                    {
                        'fieldName': 'do1-field1',
                        'fieldType': {
                            'id': 11,
                            'name': 'Coefficiente',
                            'cod': 'BSTYP_11',
                            'description': 'coefficiente di aggravamento',
                            'elementaryType': 'NUMBER',
                            'validations': [
                                {
                                    'key': 'numberAfterComma',
                                    'value': '4'
                                },
                                {
                                    'key': 'numberBeforeComma',
                                    'value': '1'
                                },
                                {
                                    'key': 'numberIsPercentage',
                                    'value': '0'
                                },
                                {
                                    'key': 'numberMaxValue',
                                    'value': '1.0'
                                },
                                {
                                    'key': 'numberMinValue',
                                    'value': '0.0'
                                }
                            ]
                        },
                        'dimensions': 0,
                        'fieldLabel': 'do1-field1',
                        'source': null,
                        'version': null,
                        'fields': null,
                        'instances': null
                    }
                ],
                'instances': [
                    {
                        'dimensions': 0,
                        'name': 'DO1'
                    }
                ]
            }];
    }

    function getDataObjects() {
        return [
            {
                'fieldName': 'DO1',
                'fieldType': {
                    'name': 'DO1',
                    'cod': null,
                    'description': 'DO1',
                    'elementaryType': null,
                    'validations': null
                },
                'dimensions': 0,
                'fieldLabel': 'DO1',
                'source': null,
                'version': null,
                'fields': [
                    {
                        'fieldName': 'do1-field1',
                        'fieldType': {
                            'id': 11,
                            'name': 'Coefficiente',
                            'cod': 'BSTYP_11',
                            'description': 'coefficiente di aggravamento',
                            'elementaryType': 'NUMBER',
                            'validations': [
                                {
                                    'key': 'numberAfterComma',
                                    'value': '4'
                                },
                                {
                                    'key': 'numberBeforeComma',
                                    'value': '1'
                                },
                                {
                                    'key': 'numberIsPercentage',
                                    'value': '0'
                                },
                                {
                                    'key': 'numberMaxValue',
                                    'value': '1.0'
                                },
                                {
                                    'key': 'numberMinValue',
                                    'value': '0.0'
                                }
                            ]
                        },
                        'dimensions': 0,
                        'fieldLabel': 'do1-field1',
                        'source': null,
                        'version': null,
                        'fields': null,
                        'instances': null
                    },
                    {
                        'fieldName': 'DO11',
                        'fieldType': {
                            'name': 'DO11',
                            'cod': null,
                            'description': 'DO11',
                            'elementaryType': null,
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'DO11',
                        'source': null,
                        'version': null,
                        'fields': [
                            {
                                'fieldName': 'do11-field11',
                                'fieldType': {
                                    'id': 14,
                                    'name': 'N_1000',
                                    'cod': 'BSTYP_14',
                                    'description': 'numerica naturali',
                                    'elementaryType': 'NUMBER',
                                    'validations': [
                                        {
                                            'key': 'numberAfterComma',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberBeforeComma',
                                            'value': '1000'
                                        },
                                        {
                                            'key': 'numberIsPercentage',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberMaxValue',
                                            'value': '1000.0'
                                        },
                                        {
                                            'key': 'numberMinValue',
                                            'value': '0.0'
                                        }
                                    ]
                                },
                                'dimensions': 0,
                                'fieldLabel': 'do11-field11',
                                'source': null,
                                'version': null,
                                'fields': null,
                                'instances': null
                            }
                        ],
                        'instances': null
                    }
                ],
                'instances': [
                    {
                        'dimensions': 0,
                        'name': 'DO1'
                    }
                ]
            },
            {
                'fieldName': 'DO2',
                'fieldType': {
                    'name': 'DO2',
                    'cod': null,
                    'description': 'DO2',
                    'elementaryType': null,
                    'validations': null
                },
                'dimensions': 0,
                'fieldLabel': 'DO2',
                'source': null,
                'version': null,
                'fields': [
                    {
                        'fieldName': 'do2-field2',
                        'fieldType': {
                            'id': 3,
                            'name': 'BOOLEAN',
                            'cod': 'BSTYP_3',
                            'description': 'booleano',
                            'elementaryType': 'BOOLEAN',
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'do2-field2',
                        'source': null,
                        'version': null,
                        'fields': null,
                        'instances': null
                    },
                    {
                        'fieldName': 'DO22',
                        'fieldType': {
                            'name': 'DO22',
                            'cod': null,
                            'description': 'DO22',
                            'elementaryType': null,
                            'validations': null
                        },
                        'dimensions': 0,
                        'fieldLabel': 'DO22',
                        'source': null,
                        'version': null,
                        'fields': [
                            {
                                'fieldName': 'do22-field22',
                                'fieldType': {
                                    'id': 8,
                                    'name': 'YYYY',
                                    'cod': 'BSTYP_8',
                                    'description': 'definizione anno',
                                    'elementaryType': 'NUMBER',
                                    'validations': [
                                        {
                                            'key': 'numberAfterComma',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberBeforeComma',
                                            'value': '4'
                                        },
                                        {
                                            'key': 'numberIsPercentage',
                                            'value': '0'
                                        },
                                        {
                                            'key': 'numberMaxValue',
                                            'value': '9999.0'
                                        },
                                        {
                                            'key': 'numberMinValue',
                                            'value': '1.0'
                                        }
                                    ]
                                },
                                'dimensions': 0,
                                'fieldLabel': 'do22-field22',
                                'source': null,
                                'version': null,
                                'fields': null,
                                'instances': null
                            }
                        ],
                        'instances': null
                    }
                ],
                'instances': [
                    {
                        'dimensions': 0,
                        'name': 'DO2'
                    }
                ]
            }
        ];
    }

    function getAllBaseTypes() {
        return [{
            'id': 10,
            'name': 'NUMERO_0_99',
            'cod': 'BSTYP_10',
            'description': 'NUMERI DA 0 A 99 INTERI',
            'elementaryType': 'NUMBER',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 0.0,
            'numberMaxValue': 99.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 2,
            'numberAfterComma': 0,
            'dateStructure': 'dd/mm/yyyy',
            'insertionDate': 1478852513220,
            'insertionUser': 'e.rossi',
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 7,
            'name': 'NUMBER_-1000000000_1000000000_0_10_2',
            'cod': 'BSTYP_7',
            'description': 'float',
            'elementaryType': 'NUMBER',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': -1.0E9,
            'numberMaxValue': 1.0E9,
            'numberIsPercentage': 0,
            'numberBeforeComma': 10,
            'numberAfterComma': 2,
            'dateStructure': null,
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 8,
            'name': 'YYYY',
            'cod': 'BSTYP_8',
            'description': 'definizione anno',
            'elementaryType': 'NUMBER',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 1.0,
            'numberMaxValue': 9999.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 4,
            'numberAfterComma': 0,
            'dateStructure': 'dd/mm/yyyy',
            'insertionDate': 1478688132158,
            'insertionUser': 'e.rossi',
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 5,
            'name': 'NUMBER_0_100_0_3_0',
            'cod': 'BSTYP_5',
            'description': 'naturale 0 a 100',
            'elementaryType': 'NUMBER',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 0.0,
            'numberMaxValue': 100.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 3,
            'numberAfterComma': 0,
            'dateStructure': null,
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 6,
            'name': 'NUMBER_0_1_1_2_2',
            'cod': 'BSTYP_6',
            'description': 'percentuale',
            'elementaryType': 'NUMBER',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 0.0,
            'numberMaxValue': 1.0,
            'numberIsPercentage': 1,
            'numberBeforeComma': 2,
            'numberAfterComma': 2,
            'dateStructure': null,
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 3,
            'name': 'BOOLEAN',
            'cod': 'BSTYP_3',
            'description': 'booleano',
            'elementaryType': 'BOOLEAN',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 0.0,
            'numberMaxValue': 0.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 0,
            'numberAfterComma': 0,
            'dateStructure': null,
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 4,
            'name': 'DATE_4',
            'cod': 'BSTYP_4',
            'description': 'data formato solo data',
            'elementaryType': 'DATE',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 0.0,
            'numberMaxValue': 0.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 0,
            'numberAfterComma': 0,
            'dateStructure': 'dd/mm/yyyy',
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 1,
            'name': 'STRING_0_20',
            'cod': 'BSTYP_1',
            'description': 'nome beneficiario',
            'elementaryType': 'STRING',
            'stringMinLength': 0,
            'stringMaxLength': 20,
            'numberMinValue': 0.0,
            'numberMaxValue': 0.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 0,
            'numberAfterComma': 0,
            'dateStructure': null,
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 2,
            'name': 'STRING_16_16',
            'cod': 'BSTYP_2',
            'description': 'codice fiscale',
            'elementaryType': 'STRING',
            'stringMinLength': 16,
            'stringMaxLength': 16,
            'numberMinValue': 0.0,
            'numberMaxValue': 0.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 0,
            'numberAfterComma': 0,
            'dateStructure': null,
            'insertionDate': null,
            'insertionUser': null,
            'modificationDate': null,
            'modifyingUser': null
        }, {
            'id': 9,
            'name': 'Importo_6_2',
            'cod': 'BSTYP_9',
            'description': 'importo con 2 difre decimali',
            'elementaryType': 'NUMBER',
            'stringMinLength': 0,
            'stringMaxLength': 0,
            'numberMinValue': 0.0,
            'numberMaxValue': 999999.0,
            'numberIsPercentage': 0,
            'numberBeforeComma': 6,
            'numberAfterComma': 2,
            'dateStructure': 'dd/mm/yyyy',
            'insertionDate': 1478688713345,
            'insertionUser': 'e.rossi',
            'modificationDate': null,
            'modifyingUser': null
        }];
    }

    function getActivePortfolios() {
        return [{
            'name': 'portfolio1-anagrafica - Anagrafica Clienti',
            'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-anagrafica-services/AnagraficaClientiBusinessService/1.0',
            'methods': [{
                'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-anagrafica-services/AnagraficaClientiBusinessService/1.0',
                'version': 1.0,
                'name': 'searchCliente',
                'returnType': 'java.util.List',
                'parameters': [{
                    'fieldName': 'arg0',
                    'fieldType': 'ClienteFilter'
                }]
            },
                {
                    'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-anagrafica-services/AnagraficaClientiBusinessService/1.0',
                    'version': 1.0,
                    'name': 'caricaElencoIndirizziCliente',
                    'returnType': 'java.util.List',
                    'parameters': [{
                        'fieldName': 'arg0',
                        'fieldType': 'ClienteFilter'
                    }]
                },
                {
                    'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-anagrafica-services/AnagraficaClientiBusinessService/1.0',
                    'version': 1.0,
                    'name': 'caricaElencoIndirizziViviCliente',
                    'returnType': 'java.util.List',
                    'parameters': []
                },
                {
                    'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-anagrafica-services/AnagraficaClientiBusinessService/1.0',
                    'version': 1.0,
                    'name': 'leggiIndirizzoCliente',
                    'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.anagrafica_clienti.entities.IndirizzoCliente',
                    'parameters': [{
                        'fieldName': 'arg0',
                        'fieldType': 'Integer'
                    }]
                },
                {
                    'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-anagrafica-services/AnagraficaClientiBusinessService/1.0',
                    'version': 1.0,
                    'name': 'describe',
                    'returnType': 'java.util.List',
                    'parameters': []
                }]
        },
            {
                'name': 'portfolio1-vita - Piattaforma Vita',
                'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                'methods': [{
                    'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                    'version': 1.0,
                    'name': 'describe',
                    'returnType': 'java.util.List',
                    'parameters': []
                },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'leggiTipologica',
                        'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.piattaforma_vita.entities.Tipologica',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'TipologicaDTO'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'caricaElencoTipologica',
                        'returnType': 'java.util.List',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'String'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'generaChiaveContratto',
                        'returnType': 'java.util.UUID',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'scriviContratto',
                        'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.piattaforma_vita.entities.Contratto',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'ContrattoDTO'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'caricaElencoProposteDaAutorizzare',
                        'returnType': 'java.util.List',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'caricaElencoContrattiAttivi',
                        'returnType': 'java.util.List',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'generaChiaveRuoloContratto',
                        'returnType': 'java.util.UUID',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'scriviRuoloContratto',
                        'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.piattaforma_vita.entities.RuoliContratto',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'RuoliContrattoDTO'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'generaChiaveIndirizziRuoloContratto',
                        'returnType': 'java.util.UUID',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'scriviIndirizzoRuoloContratto',
                        'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.piattaforma_vita.entities.IndirizziRuoliContratto',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'IndirizziRuoliContrattoDTO'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'generaChiaveCopertura',
                        'returnType': 'java.util.UUID',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'scriviCopertura',
                        'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.piattaforma_vita.entities.Premi',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'PremiDTO'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'scriviCopertura',
                        'returnType': 'it.custom.insurance.platform.portfolio.clientedemo.piattaforma_vita.entities.Copertura',
                        'parameters': [{
                            'fieldName': 'arg0',
                            'fieldType': 'CoperturaDTO'
                        }]
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'generaChiavePremio',
                        'returnType': 'java.util.UUID',
                        'parameters': []
                    },
                    {
                        'source': 'it.custom.insurance.platform.portfolio.business-services:pf-portfolio1-vita-services/PiattaformaVitaBusinessService/1.0',
                        'version': 1.0,
                        'name': 'generaChiavePremioCopertura',
                        'returnType': 'java.util.UUID',
                        'parameters': []
                    }]
            }];
    }
})();

module.exports = mockData;
