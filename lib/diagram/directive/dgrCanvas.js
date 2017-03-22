'use strict';

var fs = require('fs');

var directiveTemplate = fs.readFileSync(__dirname + '/dgrCanvas.html', {encoding: 'utf-8'});


module.exports = function () {
    return {
        scope: {
            'diagramManager': '='
        },
        template: directiveTemplate,
        link: function (scope, element) {

            var diagramManager = scope.diagramManager;

            // listen to undo / redo action on an element
            // triggered by (CTRL|META)+(Y|Z)
            function listenUndoRedo(e) {
                if (e.ctrlKey || e.metaKey) {

                    if (e.which === 89 || e.which === 90) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    // Y = 89
                    if (e.which === 89) {
                        try {
                            scope.diagramManager.renderer.get('commandStack').redo();
                        } catch (e) {
                            // jup
                        }
                    }

                    // Z = 90
                    if (e.which === 90) {
                        try {
                            scope.diagramManager.renderer.get('commandStack').undo();
                        } catch (e) {
                            // jup
                        }
                    }
                }
            }

            // capture undo / redo if mouse focus is active only
            element.on('mouseenter', function (e) {
                document.addEventListener('keydown', listenUndoRedo);
            });

            element.on('mouseleave', function (e) {
                document.removeEventListener('keydown', listenUndoRedo);
            });

        }
    };
};

