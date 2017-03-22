'use-strict';

var $LayoutEditorConfig = {
  target: null,
  elementsContainer: true,
  cssTemplate: 'base-template',
  save: null,
  boxModel: {
    row: {
      "configurableAttributes": {
        "class": {
          "label": "class",
          "title": "Set class",
          "value": "",
          "input": "text"
        },
        "id": {
          "label": "id",
          "title": "Set id",
          "value": "",
          "input": "text"
        }
      },
      "style": {
        "text-align": {
          "label": "text-align",
          "title": "Set text-align",
          "input": "radio",
          "value": "left",
          "radio": [
            {
              "label": "left",
              "value": "left"
            },
            {
              "label": "center",
              "value": "center"
            },
            {
              "label": "right",
              "value": "right"
            }
          ]
        },
      }
    },
    column: {
      "configurableAttributes": {
        "class": {
          "label": "class",
          "title": "Set class",
          "value": "",
          "input": "text"
        },
        "id": {
          "label": "id",
          "title": "Set id",
          "value": "",
          "input": "text"
        }
      },
      "style": {
        "text-align": {
          "label": "text-align",
          "title": "Set text-align",
          "input": "radio",
          "value": "left",
          "radio": [
            {
              "label": "left",
              "value": "left"
            },
            {
              "label": "center",
              "value": "center"
            },
            {
              "label": "right",
              "value": "right"
            }
          ]
        }
      }
    },
    element: {
      "configurableAttributes": {
        "class": {
          "label": "class",
          "title": "Set class",
          "value": "",
          "input": "text"
        },
        "id": {
          "label": "id",
          "title": "Set id",
          "value": "",
          "input": "text"
        }
      }
    }
  },
  staticElements: [
    [
      {
        "tag": "h1",
        "attributes": {
          "innerHTML": "Heading 1",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Heading 1",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "h2",
        "attributes": {
          "innerHTML": "Heading 2",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Heading 2",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "h3",
        "attributes": {
          "innerHTML": "Heading 3",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Heading 3",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "h4",
        "attributes": {
          "innerHTML": "Heading 4",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Heading 4",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "h5",
        "attributes": {
          "innerHTML": "Heading 5",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Heading 5",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "h6",
        "attributes": {
          "innerHTML": "Heading 6",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Heading 6",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "p",
        "attributes": {
          "innerHTML": "Paragraph",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Paragraph",
            "input": "text"
          }
        }
      }
    ],
    [
      {
        "tag": "hr",
        "attributes": {

        }
      }
    ],
    [
      {
        "tag": "a",
        "attributes": {
          "href": "#",
          "innerHTML": "Link",
          "contenteditable": "true"
        },
        "configurableAttributes": {
          "href": {
            "label": "href",
            "title": "Set href",
            "value": "#",
            "input": "text"
          },
          "innerHTML": {
            "label": "text",
            "title": "Set text",
            "value": "Link",
            "input": "text"
          }
        }
      }
    ]
  ],
  dynamicElements: [],
  project: []
};

'use-strict';

function $LayoutDesigner(config) {
    var $scope = this;
    this.config = config;
    this.project = this.config.project;
    this.draggedElement = null;
    this.startCursorX = null;
    this.startCursorY = null;
    this.currentCursorX = null;
    this.currentCursorY = null;
    this.mouseDirection = null;
    this.projectJson = null;
    this.projectHtml = null;
    this.elementsMap = {
        "dynamic": new Array(),
        "static": new Array(),
        "static-dynamic": new Array()
    };

    this.initUI = function () {
        this.appContainer = this.config.target;
        this.container = document.createElement('div');
        this.container.setAttribute('class', 'LE-layoutEditorContainer');
        this.appContainer.setAttribute('class', 'LE-appContainer');
        this.appContainer.appendChild(this.container);

        this.container.ondragover = function (event) {
            event.preventDefault();
            var pageX = event.pageX;
            var pageY = event.pageY;
            if (!$scope.currentCursorX) {
                $scope.currentCursorX = pageX;
            }
            if (!$scope.currentCursorY) {
                $scope.currentCursorY = pageY;
            }
            if ($scope.currentCursorX < pageX) {
                $scope.currentCursorX = event.pageX;
                $scope.mouseDirection = 'RIGHT';
            }
            if ($scope.currentCursorX > pageX) {
                $scope.currentCursorX = event.pageX;
                $scope.mouseDirection = 'LEFT';
            }
            if ($scope.currentCursorY < pageY) {
                $scope.currentCursorY = event.pageY;
                $scope.mouseDirection = 'DOWN';
            }
            if ($scope.currentCursorY > pageY) {
                $scope.currentCursorY = event.pageY;
                $scope.mouseDirection = 'UP';
            }
        };
        this.container.ondrop = function (event) {
            event.preventDefault();
            if (document.getElementsByClassName('LE-placeholderElement')[0]) {
                var data = event.dataTransfer.getData('text/plain');
                var el = document.getElementById(data);

                if (document.getElementById(data).getAttribute('data-type') === 'static') {
                    var index = document.getElementById(data).getAttribute('data-index');
                    var currentIndex = 0;
                    if ($scope.elementsMap['static-dynamic'].length > 0) {
                        currentIndex = $scope.elementsMap['static-dynamic'][$scope.elementsMap['static-dynamic'].length - 1].index + 1;
                    }
                    var paletteElement = new $scope.PaletteElement($scope.elementsMap['static'][index].objArrayModel, currentIndex, 'static-dynamic');
                    el = paletteElement.container;
                }

                $scope.placeholderElement.parentNode.insertBefore(el, $scope.placeholderElement);
                $scope.placeholderElement.parentNode.removeChild($scope.placeholderElement);
                $scope.draggedElement.removeAttribute('draggable');
                if (el.id === 'temporaryId') {
                    el.removeAttribute('id');
                }
                $scope.draggedElement = null;
            }
        };

        this.toolbar = document.createElement('div');
        this.toolbar.setAttribute('class', 'LE-toolbar');
        this.container.appendChild(this.toolbar);

        this.backButton = document.createElement('button');
        $scope.Utils.createCircle(this.backButton, 'LE-light');
        this.backButton.setAttribute('class', 'LE-toolbar-button LE-back-button');
        this.backButton.onclick = function () {
            $scope.appContainer.classList.remove('LE-appContainer');
            setTimeout(function () {
                $scope.appContainer.innerHTML = '';
                $scope = null;
            }, 200);
        };
        this.toolbar.appendChild(this.backButton);

        this.toolbarLeft = document.createElement('div');
        this.toolbarLeft.setAttribute('class', 'LE-toolbar-left');
        this.toolbarLeft.innerHTML = 'Layout designer';
        this.toolbar.appendChild(this.toolbarLeft);

        this.toolbarRight = document.createElement('div');
        this.toolbarRight.setAttribute('class', 'LE-toolbar-right');

        this.saveButton = document.createElement('button');
        this.saveButton.setAttribute('class', 'LE-toolbar-button LE-save-button');
        this.saveButton.onclick = function () {
            $scope.projectJson = $scope.createProjectJson(false);
            $scope.projectHtml = $scope.clearHtml().outerHTML;
            $scope.config.save(function () {
                $scope.toast('Save successful!');
            }, function () {
                $scope.toast('Save failed!');
            });
        };
        this.toolbarRight.appendChild(this.saveButton);

        this.createPreview = function (div, html) {
            var $self = this;
            this.container = document.createElement('div');
            this.container.setAttribute('class', 'LE-preview-container');
            div.appendChild(this.container);

            this.closeButton = document.createElement('button');
            $scope.Utils.createCircle(this.closeButton, 'LE-dark');
            this.closeButton.setAttribute('class', 'LE-fabButton LE-fabButton--hidden');
            this.closeButton.onclick = function () {
                $scope.backPanel.click();
            };
            this.container.appendChild(this.closeButton);

            setTimeout(function () {
                $self.closeButton.classList.remove('LE-fabButton--hidden');
            }, 300);

            this.controls = document.createElement('div');
            this.controls.setAttribute('class', 'LE-preview-controls');
            this.container.appendChild(this.controls);

            var control_100pc = document.createElement('div');
            control_100pc.setAttribute('class', 'LE-preview-control-100pc LE-p-cont LE-selected');
            var l = document.createElement('div');
            l.innerHTML = '100%';
            control_100pc.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '100%';
            control_100pc.appendChild(r);
            control_100pc.setAttribute('data-width', '100pc');
            this.controls.appendChild(control_100pc);

            var control_1600 = document.createElement('div');
            control_1600.setAttribute('class', 'LE-preview-control-1600 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '1600';
            control_1600.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '1600';
            control_1600.appendChild(r);
            control_1600.setAttribute('data-width', '1600');
            this.controls.appendChild(control_1600);

            var control_1440 = document.createElement('div');
            control_1440.setAttribute('class', 'LE-preview-control-1440 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '1440';
            control_1440.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '1440';
            control_1440.appendChild(r);
            control_1440.setAttribute('data-width', '1440');
            this.controls.appendChild(control_1440);

            var control_1280 = document.createElement('div');
            control_1280.setAttribute('class', 'LE-preview-control-1280 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '1280';
            control_1280.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '1280';
            control_1280.appendChild(r);
            control_1280.setAttribute('data-width', '1280');
            this.controls.appendChild(control_1280);

            var control_1024 = document.createElement('div');
            control_1024.setAttribute('class', 'LE-preview-control-1024 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '1024';
            control_1024.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '1024';
            control_1024.appendChild(r);
            control_1024.setAttribute('data-width', '1024');
            this.controls.appendChild(control_1024);

            var control_720 = document.createElement('div');
            control_720.setAttribute('class', 'LE-preview-control-720 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '720';
            control_720.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '720';
            control_720.appendChild(r);
            control_720.setAttribute('data-width', '720');
            this.controls.appendChild(control_720);

            var control_600 = document.createElement('div');
            control_600.setAttribute('class', 'LE-preview-control-600 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '600';
            control_600.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '600';
            control_600.appendChild(r);
            control_600.setAttribute('data-width', '600');
            this.controls.appendChild(control_600);

            var control_360 = document.createElement('div');
            control_360.setAttribute('class', 'LE-preview-control-360 LE-p-cont');
            var l = document.createElement('div');
            l.innerHTML = '360';
            control_360.appendChild(l);
            var r = document.createElement('div');
            r.innerHTML = '360';
            control_360.appendChild(r);
            control_360.setAttribute('data-width', '360');
            this.controls.appendChild(control_360);

            this.content = document.createElement('div');
            this.content.setAttribute('class', 'LE-preview-content');
            this.content.innerHTML = html;
            this.container.appendChild(this.content);

            this.script = document.createElement('script');
            this.script.src = 'LE-template/scripts.js';
            this.content.appendChild(this.script);

            var conts = this.controls.getElementsByClassName('LE-p-cont');
            for (var i = 0; i < conts.length; i++) {
                conts[i].onclick = function (event) {
                    for (var x = 0; x < conts.length; x++) {
                        conts[x].classList.remove('LE-selected');
                    }
                    if (event.target.classList.contains('LE-p-cont')) {
                        event.target.classList.add('LE-selected');
                        $self.content.setAttribute('class', 'LE-preview-content LE-device-' + event.target.getAttribute('data-width'));
                    }
                    if ($scope.Utils.getParentByClass(event.target, 'LE-p-cont')) {
                        event.target.parentNode.classList.add('LE-selected');
                        $self.content.setAttribute('class', 'LE-preview-content LE-device-' + $scope.Utils.getParentByClass(event.target, 'LE-p-cont').getAttribute('data-width'));
                    }
                };
            }
        };

        this.showPreviewButton = document.createElement('button');
        this.showPreviewButton.setAttribute('class', 'LE-toolbar-button LE-preview-button');
        this.showPreviewButton.onclick = function () {
            var div = document.createElement('div');
            div.id = 'LE-dialog-showpreview';
            div.setAttribute('class', 'LE-dialog');
            $scope.createPreview(div, $scope.Utils.formatting($scope.clearHtml().outerHTML));
            $scope.dialog(div);
        };
        this.toolbarRight.appendChild(this.showPreviewButton);

        this.container.addEventListener('click', function (event) {
            if ($scope.menuContainer.classList.contains('LE-opened') && (event.target !== $scope.menuButton && $scope.Utils.getParentByClass(event.target, 'LE-menu-button') !== $scope.menuButton)) {
                $scope.menuContainer.classList.remove('LE-opened');
            }
        });

        this.menuButton = document.createElement('button');
        this.menuButton.setAttribute('class', 'LE-toolbar-button LE-menu-button');
        this.menuButton.onclick = function () {
            $scope.menuContainer.classList.add('LE-opened');
        };
        this.toolbarRight.appendChild(this.menuButton);

        this.menuContainer = document.createElement('div');
        this.menuContainer.setAttribute('class', 'LE-menu-container');

        this.menu = document.createElement('ul');

        this.li1 = document.createElement('li');
        this.li1.innerHTML = 'Show project';
        this.li1.onclick = function () {
            var projectJson = $scope.createProjectJson(true);
            var div = document.createElement('div');
            div.id = 'LE-dialog-showhtml';
            div.setAttribute('class', 'LE-dialog');

            var controlContainer = document.createElement('div');
            controlContainer.setAttribute('class', 'LE-dialog-control-container');
            div.appendChild(controlContainer);

            var button = document.createElement('button');
            button.setAttribute('class', 'LE-icon LE-copy-button LE-tooltip-container');
            $scope.tooltip(button, 'copy', 'top');
            $scope.Utils.createCircle(button, 'LE-dark');
            controlContainer.appendChild(button);

            var textarea = document.createElement('textarea');
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = projectJson;
            div.appendChild(textarea);
            $scope.dialog(div);

            button.onclick = function () {
                textarea.focus();
                textarea.setSelectionRange(0, textarea.value.length);
                var selection = window.getSelection();
                document.execCommand('copy');
                selection.removeAllRanges();
            };
        };
        this.menu.appendChild(this.li1);

        this.li2 = document.createElement('li');
        this.li2.innerHTML = 'Show HTML';
        this.li2.onclick = function () {
            var div = document.createElement('div');
            div.id = 'LE-dialog-showhtml';
            div.setAttribute('class', 'LE-dialog');

            var controlContainer = document.createElement('div');
            controlContainer.setAttribute('class', 'LE-dialog-control-container');
            div.appendChild(controlContainer);

            var button = document.createElement('button');
            button.setAttribute('class', 'LE-icon LE-copy-button LE-tooltip-container');
            $scope.tooltip(button, 'copy', 'top');
            $scope.Utils.createCircle(button, 'LE-dark');
            controlContainer.appendChild(button);

            var textarea = document.createElement('textarea');
            textarea.setAttribute('readonly', 'readonly');
            textarea.value = $scope.Utils.formatting($scope.clearHtml().outerHTML);
            div.appendChild(textarea);
            $scope.dialog(div);

            button.onclick = function () {
                textarea.focus();
                textarea.setSelectionRange(0, textarea.value.length);
                var selection = window.getSelection();
                document.execCommand('copy');
                selection.removeAllRanges();
            };
        };
        this.menu.appendChild(this.li2);

        this.menuContainer.appendChild(this.menu);
        this.container.appendChild(this.menuContainer);

        this.toolbar.appendChild(this.toolbarRight);

        this.toolbar.appendChild(this.toolbarRight);

        this.leftMenuContainer = document.createElement('div');
        this.leftMenuContainer.setAttribute('class', 'LE-left-menu-container');

        this.container.appendChild(this.leftMenuContainer);

        this.menuContentContainer = document.createElement('div');
        this.menuContentContainer.setAttribute('class', 'LE-left-menu-content-container');
        this.container.appendChild(this.menuContentContainer);

        if ($scope.config.dynamicElements.length) {
            this.dynamicPaletteButton = document.createElement('button');
            this.dynamicPaletteButton.setAttribute('data-paletteContainer', 'dynamicElementsPaletteContainer');
            this.dynamicPaletteButton.setAttribute('class', 'LE-icon LE-leftmenu-button LE-dynamic-palette-button');
            this.dynamicPaletteButton.onclick = function () {
                var menuContent = document.getElementsByClassName('LE-menu-content');
                for (var i = 0; i < menuContent.length; i++) {
                    document.getElementsByClassName('LE-leftmenu-button')[i].classList.remove('LE-selected');
                    menuContent[i].classList.remove('LE-opened');
                }
                this.classList.add('LE-selected');
                $scope.dynamicElementsPaletteContainer.classList.add('LE-opened');

                var leftmenuButton = document.getElementsByClassName('LE-leftmenu-button');
                for (var i = 0; i < leftmenuButton.length; i++) {
                    if (i % 2 === 1) {
                        $scope.leftMenuContainer.classList.remove('LE-light');
                    } else {
                        $scope.leftMenuContainer.classList.add('LE-light');
                    }
                }
            };
            this.leftMenuContainer.appendChild(this.dynamicPaletteButton);

            this.dynamicElementsPaletteContainer = document.createElement('div');
            this.dynamicElementsPaletteContainer.setAttribute('class', 'LE-dynamic-elements-palette-container LE-menu-content');
            this.dynamicElementsPaletteContainer.ondragover = function (event) {
                if ($scope.draggedElement.classList.contains('LE-palette-element-container') && (event.target.classList.contains('LE-dynamic-elements-palette-container') || $scope.Utils.getParentByClass(event.target, 'LE-palette-element-container'))) {
                    var el = $scope.Utils.getParentByClass(event.target, 'LE-palette-element-container');
                    $scope.placeholderElement.setAttribute('style', 'height: 50px');
                    if ($scope.draggedElement.id !== el.id) {
                        if (event.target.classList.contains('LE-palette-element-container') || $scope.Utils.getParentByClass(event.target, 'LE-palette-element-container')) {
                            if ($scope.mouseDirection === 'UP') {
                                el.parentNode.insertBefore($scope.placeholderElement, el);
                            } else if ($scope.mouseDirection === 'DOWN') {
                                el.parentNode.insertBefore($scope.placeholderElement, el.nextSibling);
                            }
                        } else {
                            $scope.dynamicElementsPaletteContainer.appendChild($scope.placeholderElement);
                        }
                    }
                }
            };
            this.menuContentContainer.appendChild(this.dynamicElementsPaletteContainer);
        }

        this.staticPaletteButton = document.createElement('button');
        this.staticPaletteButton.setAttribute('data-paletteContainer', 'staticElementsPaletteContainer');
        this.staticPaletteButton.setAttribute('class', 'LE-icon LE-leftmenu-button LE-static-palette-button');
        this.staticPaletteButton.onclick = function () {
            var menuContent = document.getElementsByClassName('LE-menu-content');
            for (var i = 0; i < menuContent.length; i++) {
                document.getElementsByClassName('LE-leftmenu-button')[i].classList.remove('LE-selected');
                menuContent[i].classList.remove('LE-opened');
            }
            this.classList.add('LE-selected');
            $scope.staticElementsPaletteContainer.classList.add('LE-opened');

            var leftmenuButton = document.getElementsByClassName('LE-leftmenu-button');
            for (var i = 0; i < leftmenuButton.length; i++) {
                if (i % 2 === 1) {
                    $scope.leftMenuContainer.classList.add('LE-light');
                } else {
                    $scope.leftMenuContainer.classList.remove('LE-light');
                }
            }
        };
        this.leftMenuContainer.appendChild(this.staticPaletteButton);

        this.staticElementsPaletteContainer = document.createElement('div');
        this.staticElementsPaletteContainer.setAttribute('class', 'LE-static-elements-palette-container LE-menu-content');
        this.menuContentContainer.appendChild(this.staticElementsPaletteContainer);

        this.editorContainer = document.createElement('div');
        this.editorContainer.setAttribute('class', 'LE-editor-container');
        this.container.appendChild(this.editorContainer);

        this.editor = document.createElement('div');
        this.editor.setAttribute('class', 'LE-editor ' + this.config.cssTemplate);
        this.editor.onscroll = function () {
            $scope.addRowButton.classList.add('LE-fabButton--hidden');
            setTimeout(function () {
                $scope.addRowButton.classList.remove('LE-fabButton--hidden');
            }, 500);
        };
        this.editorContainer.appendChild(this.editor);

        this.addRowButton = document.createElement('button');
        this.addRowButton.setAttribute('class', 'LE-fabButton LE-fabButton--hidden');
        this.addRowButton.onclick = function () {
            new $scope.Row(null, true);
        };
        this.editorContainer.appendChild(this.addRowButton);

        this.placeholderElement = document.createElement('div');
        this.placeholderElement.setAttribute('class', 'LE-placeholderElement');

        this.backPanel = document.createElement('div');
        this.backPanel.setAttribute('class', 'LE-back-panel');
        this.container.appendChild(this.backPanel);

        this.rightMenuContainer = document.createElement('div');
        this.rightMenuContainer.setAttribute('class', 'LE-right-menu-container');
        this.container.appendChild(this.rightMenuContainer);

        this.rightMenuCloseButton = document.createElement('button');
        this.rightMenuCloseButton.setAttribute('class', 'LE-icon LE-right-menu-close-button');
        this.rightMenuCloseButton.onclick = function () {
            $scope.rightMenuContainer.classList.remove('LE-opened');
            $scope.editorContainer.classList.remove('LE-resized');
            $scope.rightMenuContent.innerHTML = '';
            $scope.removeElementFocus();
        };
        this.rightMenuContainer.appendChild(this.rightMenuCloseButton);

        this.rightMenuContent = document.createElement('div');
        this.rightMenuContent.setAttribute('class', 'LE-right-menu-content');
        this.rightMenuContainer.appendChild(this.rightMenuContent);

        this.rightMenuCreateTable = function (thText) {
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            table.appendChild(thead);
            var tr = document.createElement('tr');

            thead.appendChild(tr);
            var th = document.createElement('th');
            th.setAttribute('colspan', '2');
            th.innerHTML = thText;
            tr.appendChild(th);
            var tbody = document.createElement('tbody');
            table.appendChild(tbody);

            $scope.rightMenuContent.appendChild(table);
            return tbody;
        };

        this.toastContainer = document.createElement('div');
        this.toastContainer.setAttribute('class', 'LE-toast');
        this.container.appendChild(this.toastContainer);
    };

    this.tooltip = function (el, msg, pos) {
        var span = document.createElement('span');
        span.setAttribute('class', 'LE-tooltip LE-tooltip-' + pos);
        span.innerHTML = msg;
        el.appendChild(span);

        el.addEventListener('mouseover', function () {
            span.removeAttribute('style');
            var offsetHalf = this.offsetWidth / 2;
            var rect = this.getBoundingClientRect();
            var left = rect.left + offsetHalf;
            var top = rect.top;
            span.setAttribute('style', 'left:' + left + 'px; top:' + top + 'px;');
        });
    };

    this.toast = function (msg) {
        var self = this;
        this.msg = msg || '';
        this.toastContainer.innerHTML = this.msg;
        this.toastContainer.classList.add('LE-opened');

        if ($scope.addRowButton) {
            $scope.addRowButton.setAttribute('style', 'bottom: 72px;');
        }

        setTimeout(function () {
            self.toastContainer.classList.remove('LE-opened');
            $scope.addRowButton.removeAttribute('style');
        }, 1500);
    };

    this.dialog = function (el) {
        var self = this;
        this.container = $scope.backPanel;
        this.open = true;
        this.container.classList.add('LE-opened');
        this.container.appendChild(el);
        this.container.addEventListener('click', function (event) {
            if (event.target === this) {
                if (self) {
                    self.close();
                }
            }
        });
        this.close = function () {
            this.container.classList.remove('LE-opened');
            this.container.innerHTML = '';
            self.open = false;
            self = null;
        };
    };

    this.Row = function (appendTarget, createColumn) {
        var $self = this;
        this.objModel = JSON.parse(JSON.stringify($scope.config.boxModel.row));
        this.container = document.createElement('div');
        this.container.id = 'row-' + new Date().getTime() + '-' + document.getElementsByClassName('LE-row-container').length;
        this.container.setAttribute('class', 'LE-row-container');
        this.container.ondragstart = function (event) {
            $scope.draggedElement = event.target;
            $scope.startCursorX = event.pageX;
            $scope.startCursorY = event.pageY;
            event.dataTransfer.setData('text/plain', event.target.id);
        };
        this.container.ondragover = function (event) {
            if ($scope.draggedElement.classList.contains('LE-row-container') && $scope.Utils.getParentByClass(event.target, 'LE-row-container')) {
                var el = $scope.Utils.getParentByClass(event.target, 'LE-row-container');
                if ($scope.mouseDirection === 'UP') {
                    el.parentNode.insertBefore($scope.placeholderElement, el);
                } else if ($scope.mouseDirection === 'DOWN') {
                    el.parentNode.insertBefore($scope.placeholderElement, el.nextSibling);
                }
                $scope.placeholderElement.setAttribute('style', 'height: 50px');
            }
        };

        this.controlsContainer = document.createElement('div');
        this.controlsContainer.setAttribute('class', 'LE-row-controls-container');
        this.container.appendChild(this.controlsContainer);

        this.settingsButton = document.createElement('button');
        this.settingsButton.setAttribute('class', 'LE-icon LE-settings-button LE-tooltip-container');
        $scope.tooltip(this.settingsButton, 'settings', 'top');
        $scope.Utils.createCircle(this.settingsButton, 'LE-dark');
        this.settingsButton.onclick = function () {
            $scope.rightMenuContent.innerHTML = '';
            $scope.removeElementFocus();
            this.parentNode.parentNode.classList.add('LE-focused');

            var tbody = $scope.rightMenuCreateTable('row');
            var confAttr = $scope.config.boxModel.row.configurableAttributes;
            for (var p in confAttr) {
                var trIn = document.createElement('tr');
                var tdLabel = document.createElement('td');
                tdLabel.innerHTML = confAttr[p].label;
                tdLabel.title = confAttr[p].title || '';
                trIn.appendChild(tdLabel);

                var input = document.createElement('input');
                input.type = confAttr[p].input || 'text';
                input.value = confAttr[p].value || '';
                input.placeholder = confAttr[p].label || '';
                input.value = $self.row.getAttribute(p);

                if (input.type === 'text') {
                    (function (p) {
                        input.onkeyup = function () {
                            $self.row.setAttribute(p, this.value);
                            if (p === 'class' && this.value.indexOf('LE-row ') === -1) {
                                $self.row.setAttribute(p, 'LE-row ' + this.value);
                                this.value = $self.row.getAttribute('class');
                            }
                            $self.objModel.configurableAttributes[p].value = this.value;
                        };
                    })(p);
                }

                var tdInput = document.createElement('td');
                tdInput.appendChild(input);
                trIn.appendChild(tdInput);
                tbody.appendChild(trIn);
            }

            var styleAttr = $scope.config.boxModel.row.style;
            if (Object.keys(styleAttr).length > 0) {
                var trH = document.createElement('tr');
                var tdHlabel = document.createElement('td');
                tdHlabel.setAttribute('colspan', '2');
                tdHlabel.innerHTML = 'style';
                trH.appendChild(tdHlabel);
                tbody.appendChild(trH);

                for (var p in styleAttr) {
                    var trIn = document.createElement('tr');
                    var tdLabel = document.createElement('td');
                    tdLabel.innerHTML = styleAttr[p].label;
                    tdLabel.title = styleAttr[p].title || '';
                    trIn.appendChild(tdLabel);

                    if (styleAttr[p].input === 'radio') {
                        var input = document.createElement('div');
                        for (var ra = 0; ra < styleAttr[p].radio.length; ra++) {
                            var label = document.createElement('label');

                            var radio = document.createElement('input');
                            radio.type = 'radio';
                            radio.name = p;
                            radio.value = styleAttr[p].radio[ra].value;
                            if (styleAttr[p].radio[ra].value === $self.objModel.style[p].value) {
                                radio.setAttribute('checked', 'checked');
                            }

                            (function (p) {
                                label.onclick = function () {
                                    $self.objModel.style[p].value = this.getElementsByTagName('input')[0].value;
                                    var style = '';
                                    for (var pp in $self.objModel.style) {
                                        if ($self.objModel.style[pp].value && $self.objModel.style[pp].value !== '') {
                                            style += pp + ':' + $self.objModel.style[pp].value + ';';
                                        }
                                    }
                                    $self.row.setAttribute('style', style);
                                };
                            })(p);

                            label.appendChild(radio);
                            label.innerHTML += styleAttr[p].radio[ra].label;
                            input.appendChild(label);
                        }
                    } else if (styleAttr[p].input === 'select') {
                        var input = document.createElement('select');
                        for (var op = 0; op < styleAttr[p].option.length; op++) {
                            var option = document.createElement('option');
                            option.value = styleAttr[p].option[op].value;
                            option.text = styleAttr[p].option[op].label;
                            input.appendChild(option);
                            if (styleAttr[p].option[op].value === $self.objModel.style[p].value) {
                                option.setAttribute('selected', 'selected');
                            }

                            (function (p) {
                                input.onchange = function () {
                                    $self.objModel.style[p].value = this.value;
                                    var style = '';
                                    for (var pp in $self.objModel.style) {
                                        if ($self.objModel.style[pp].value && $self.objModel.style[pp].value !== '') {
                                            style += pp + ':' + $self.objModel.style[pp].value + ';';
                                        }
                                    }
                                    $self.row.setAttribute('style', style);
                                };
                            })(p);
                        }
                    } else {
                        var input = document.createElement('input');
                        input.type = styleAttr[p].input || 'text';
                        input.value = styleAttr[p].value || '';
                        input.placeholder = styleAttr[p].label || '';
                        input.value = $self.objModel.style[p].value;

                        (function (p) {
                            input.onkeyup = function () {
                                $self.objModel.style[p].value = this.value;
                                var style = '';
                                for (var pp in $self.objModel.style) {
                                    if ($self.objModel.style[pp].value && $self.objModel.style[pp].value !== '') {
                                        style += pp + ':' + $self.objModel.style[pp].value + ';';
                                    }
                                }
                                $self.row.setAttribute('style', style);
                            };
                            input.change = function () {
                                $self.objModel.style[p].value = this.value;
                                var style = '';
                                for (var pp in $self.objModel.style) {
                                    if ($self.objModel.style[pp].value && $self.objModel.style[pp].value !== '') {
                                        style += pp + ':' + $self.objModel.style[pp].value + ';';
                                    }
                                }
                                $self.row.setAttribute('style', style);
                            };
                        })(p);
                    }
                    var tdInput = document.createElement('td');
                    tdInput.appendChild(input);
                    trIn.appendChild(tdInput);
                    tbody.appendChild(trIn);
                }
            }

            $scope.editorContainer.classList.add('LE-resized');
            $scope.rightMenuContainer.classList.add('LE-opened');
        };
        this.controlsContainer.appendChild(this.settingsButton);

        this.addColumnButton = document.createElement('button');
        this.addColumnButton.setAttribute('class', 'LE-icon LE-addcolumn-button LE-tooltip-container');
        $scope.tooltip(this.addColumnButton, 'add column', 'top');
        $scope.Utils.createCircle(this.addColumnButton, 'LE-dark');
        this.addColumnButton.onclick = function () {
            new $self.Column();
        };
        this.controlsContainer.appendChild(this.addColumnButton);

        this.draggableButton = document.createElement('button');
        this.draggableButton.setAttribute('class', 'LE-icon LE-drag-button LE-tooltip-container');
        $scope.tooltip(this.draggableButton, 'drag', 'top');
        $scope.Utils.createCircle(this.draggableButton, 'LE-dark');
        this.draggableButton.onmousedown = function () {
            $self.container.setAttribute('draggable', 'true');
        };
        this.draggableButton.onmouseup = function () {
            $self.container.removeAttribute('draggable');
        };
        this.controlsContainer.appendChild(this.draggableButton);

        this.deleteButton = document.createElement('button');
        this.deleteButton.setAttribute('class', 'LE-icon LE-delete-button LE-tooltip-container');
        $scope.tooltip(this.deleteButton, 'delete', 'top');
        $scope.Utils.createCircle(this.deleteButton, 'LE-dark');
        this.deleteButton.onclick = function () {
            var div = document.createElement('div');

            var p = document.createElement('p');
            p.innerHTML = 'Are you sure?';
            div.appendChild(p);
            div.setAttribute('class', 'LE-dialog');
            var d = new $scope.dialog(div);

            var controlContainer = document.createElement('div');
            controlContainer.setAttribute('class', 'LE-dialog-control-container');
            div.appendChild(controlContainer);

            var button = document.createElement('button');
            button.setAttribute('class', 'LE-delete');
            button.innerHTML = 'DELETE';
            button.onclick = function () {
                $self.delete();
                if (d) {
                    d.close();
                }
            };
            controlContainer.appendChild(button);
            button.focus();
        };
        this.controlsContainer.appendChild(this.deleteButton);

        this.container.appendChild(this.controlsContainer);

        this.row = document.createElement('div');
        this.row.setAttribute('class', 'LE-row');
        this.container.appendChild(this.row);

        this.delete = function () {
            if ($self.container.classList.contains('LE-focused')) {
                $scope.rightMenuCloseButton.click();
            }
            var types = $self.container.querySelectorAll('[data-type]');
            for (var i = 0; i < types.length; i++) {
                if (types[i].getAttribute('data-type') === 'dynamic') {
                    $scope.dynamicElementsPaletteContainer.appendChild(types[i]);
                }
            }
            $self.container.parentNode.removeChild($self.container);
            $self = null;
        };

        if (appendTarget) {
            appendTarget.appendChild(this.container);
        } else {
            this.container.classList.add('LE-row-layer-0');
            $scope.editor.appendChild(this.container);
        }

        this.Column = function () {
            var $$self = this;
            this.objModel = JSON.parse(JSON.stringify($scope.config.boxModel.column));
            this.container = document.createElement('div');
            this.container.id = $self.container.id + '_column-' + new Date().getTime() + '-' + document.getElementsByClassName('LE-column-container').length;
            this.container.setAttribute('class', 'LE-column-container');
            this.container.ondragstart = function (event) {
                $scope.draggedElement = event.target;
                $scope.startCursorX = event.pageX;
                $scope.startCursorY = event.pageY;
                event.dataTransfer.setData('text/plain', event.target.id);
            };

            this.container.ondragover = function (event) {
                var el = null;
                if ($scope.draggedElement.classList.contains('LE-column-container') && $scope.Utils.getParentByClass(event.target, 'LE-column-container')) {
                    el = $scope.Utils.getParentByClass(event.target, 'LE-column-container');
                    if ($scope.mouseDirection === 'LEFT') {
                        el.parentNode.insertBefore($scope.placeholderElement, el);
                    } else if ($scope.mouseDirection === 'RIGHT') {
                        el.parentNode.insertBefore($scope.placeholderElement, el.nextSibling);
                    }

                    $scope.placeholderElement.setAttribute('style', 'flex-grow: 0; -webkit-flex-grow: 0; -webkit-flex-basis: 100px; flex-basis: 100px;');
                } else if ($scope.draggedElement.classList.contains('LE-palette-element-container')) {
                    el = $scope.Utils.getParentByClass(event.target, 'LE-palette-element-container');
                    $scope.placeholderElement.setAttribute('style', 'height: flex-grow: 0; -webkit-flex-grow: 0; -webkit-flex-basis: 50px; flex-basis: 50px;');
                    if ($$self.container.getElementsByClassName('LE-palette-element-container').length !== 0) {
                        if (el) {
                            if ($scope.mouseDirection === 'UP') {
                                el.parentNode.insertBefore($scope.placeholderElement, el);
                            } else if ($scope.mouseDirection === 'DOWN') {
                                el.parentNode.insertBefore($scope.placeholderElement, el.nextSibling);
                            }
                        }
                    } else {
                        if ($$self.column.getElementsByClassName('LE-row-container').length === 0) {
                            $$self.column.appendChild($scope.placeholderElement);
                        }
                    }
                }
            };

            this.controlsContainer = document.createElement('div');
            this.controlsContainer.setAttribute('class', 'LE-column-controls-container');

            this.settingsButton = document.createElement('button');
            this.settingsButton.setAttribute('class', 'LE-icon LE-c-settings-button LE-tooltip-container');
            $scope.tooltip(this.settingsButton, 'settings', 'top');
            $scope.Utils.createCircle(this.settingsButton, 'LE-dark');
            this.settingsButton.onclick = function () {
                $scope.rightMenuContent.innerHTML = '';
                $scope.removeElementFocus();
                this.parentNode.parentNode.classList.add('LE-focused');

                var tbody = $scope.rightMenuCreateTable('column');
                var confAttr = $scope.config.boxModel.column.configurableAttributes;
                for (var p in confAttr) {
                    var trIn = document.createElement('tr');
                    var tdLabel = document.createElement('td');
                    tdLabel.innerHTML = confAttr[p].label;
                    tdLabel.title = confAttr[p].title || '';
                    trIn.appendChild(tdLabel);

                    var input = document.createElement('input');
                    input.type = confAttr[p].input || 'text';
                    input.value = confAttr[p].value || '';
                    input.placeholder = confAttr[p].label || '';
                    input.value = $$self.column.getAttribute(p);

                    if (input.type === 'text') {
                        (function (p) {
                            input.onkeyup = function () {
                                $$self.column.setAttribute(p, this.value);
                                if (p === 'class' && this.value.indexOf('LE-column ') === -1) {
                                    $$self.column.setAttribute(p, 'LE-column ' + this.value);
                                    this.value = $$self.column.getAttribute('class');
                                }
                            };
                        })(p);
                    }

                    var tdInput = document.createElement('td');
                    tdInput.appendChild(input);
                    trIn.appendChild(tdInput);
                    tbody.appendChild(trIn);
                }

                var styleAttr = $scope.config.boxModel.column.style;
                if (Object.keys(styleAttr).length > 0) {
                    var trH = document.createElement('tr');
                    var tdHlabel = document.createElement('td');
                    tdHlabel.setAttribute('colspan', '2');
                    tdHlabel.innerHTML = 'style';
                    trH.appendChild(tdHlabel);
                    tbody.appendChild(trH);

                    for (var p in styleAttr) {
                        var trIn = document.createElement('tr');
                        var tdLabel = document.createElement('td');
                        tdLabel.innerHTML = styleAttr[p].label;
                        tdLabel.title = styleAttr[p].title || '';
                        trIn.appendChild(tdLabel);

                        if (styleAttr[p].input === 'radio') {
                            var input = document.createElement('div');
                            for (var ra = 0; ra < styleAttr[p].radio.length; ra++) {
                                var label = document.createElement('label');

                                var radio = document.createElement('input');
                                radio.type = 'radio';
                                radio.name = p;
                                radio.value = styleAttr[p].radio[ra].value;
                                if (styleAttr[p].radio[ra].value === $$self.objModel.style[p].value) {
                                    radio.setAttribute('checked', 'checked');
                                }

                                (function (p) {
                                    label.onclick = function () {
                                        $$self.objModel.style[p].value = this.getElementsByTagName('input')[0].value;
                                        var style = '';
                                        for (var pp in $$self.objModel.style) {
                                            if ($$self.objModel.style[pp].value && $$self.objModel.style[pp].value !== '') {
                                                style += pp + ':' + $$self.objModel.style[pp].value + ';';
                                            }
                                        }
                                        $$self.column.setAttribute('style', style);
                                    };
                                })(p);

                                label.appendChild(radio);
                                label.innerHTML += styleAttr[p].radio[ra].label;
                                input.appendChild(label);
                            }
                        } else if (styleAttr[p].input === 'select') {
                            var input = document.createElement('select');
                            for (var op = 0; op < styleAttr[p].option.length; op++) {
                                var option = document.createElement('option');
                                option.value = styleAttr[p].option[op].value;
                                option.text = styleAttr[p].option[op].label;
                                input.appendChild(option);
                                if (styleAttr[p].option[op].value === $$self.objModel.style[p].value) {
                                    option.setAttribute('selected', 'selected');
                                }

                                (function (p) {
                                    input.onchange = function () {
                                        $$self.objModel.style[p].value = this.value;
                                        var style = '';
                                        for (var pp in $$self.objModel.style) {
                                            if ($$self.objModel.style[pp].value && $$self.objModel.style[pp].value !== '') {
                                                style += pp + ':' + $$self.objModel.style[pp].value + ';';
                                            }
                                        }
                                        $$self.column.setAttribute('style', style);
                                    };
                                })(p);
                            }
                        } else {
                            var input = document.createElement('input');
                            input.type = styleAttr[p].input || 'text';
                            input.value = styleAttr[p].value || '';
                            input.placeholder = styleAttr[p].label || '';
                            input.value = $$self.objModel.style[p].value;

                            (function (p) {
                                input.onkeyup = function () {
                                    $$self.objModel.style[p].value = this.value;
                                    var style = '';
                                    for (var pp in $$self.objModel.style) {
                                        if ($$self.objModel.style[pp].value && $$self.objModel.style[pp].value !== '') {
                                            style += pp + ':' + $$self.objModel.style[pp].value + ';';
                                        }
                                    }
                                    $$self.column.setAttribute('style', style);
                                };
                                input.onchange = function () {
                                    $$self.objModel.style[p].value = this.value;
                                    var style = '';
                                    for (var pp in $$self.objModel.style) {
                                        if ($$self.objModel.style[pp].value && $$self.objModel.style[pp].value !== '') {
                                            style += pp + ':' + $$self.objModel.style[pp].value + ';';
                                        }

                                        if (pp === 'flex-grow') {
                                            $$self.container.setAttribute('style', 'flex-grow:' + $$self.objModel.style[pp].value + ';');
                                        }
                                    }
                                    $$self.column.setAttribute('style', style);
                                };
                            })(p);
                        }
                        var tdInput = document.createElement('td');
                        tdInput.appendChild(input);
                        trIn.appendChild(tdInput);
                        tbody.appendChild(trIn);
                    }
                }

                $scope.editorContainer.classList.add('LE-resized');
                $scope.rightMenuContainer.classList.add('LE-opened');
            };
            this.controlsContainer.appendChild(this.settingsButton);

            this.addRowButton = document.createElement('button');
            this.addRowButton.setAttribute('class', 'LE-icon LE-c-addrow-button LE-tooltip-container');
            $scope.tooltip(this.addRowButton, 'add row', 'top');
            $scope.Utils.createCircle(this.addRowButton, 'LE-dark');
            this.addRowButton.onclick = function () {
                new $scope.Row($$self.column, true);
            };
            this.controlsContainer.appendChild(this.addRowButton);

            this.draggableButton = document.createElement('button');
            this.draggableButton.setAttribute('class', 'LE-icon LE-c-drag-button LE-tooltip-container');
            $scope.tooltip(this.draggableButton, 'drag', 'top');
            $scope.Utils.createCircle(this.draggableButton, 'LE-dark');
            this.draggableButton.onmousedown = function () {
                $$self.container.setAttribute('draggable', 'true');
            };
            this.draggableButton.onmouseup = function () {
                $$self.container.removeAttribute('draggable');
            };
            this.controlsContainer.appendChild(this.draggableButton);

            this.deleteButton = document.createElement('button');

            this.deleteButton.setAttribute('class', 'LE-icon LE-c-delete-button LE-tooltip-container');
            $scope.tooltip(this.deleteButton, 'delete', 'top');
            $scope.Utils.createCircle(this.deleteButton, 'LE-dark');

            this.deleteButton.onclick = function () {
                var div = document.createElement('div');

                var p = document.createElement('p');
                p.innerHTML = 'Are you sure?';
                div.appendChild(p);
                div.setAttribute('class', 'LE-dialog');
                var d = new $scope.dialog(div);

                var controlContainer = document.createElement('div');
                controlContainer.setAttribute('class', 'LE-dialog-control-container');
                div.appendChild(controlContainer);

                var button = document.createElement('button');
                button.setAttribute('class', 'LE-delete');
                button.innerHTML = 'DELETE';
                button.onclick = function () {
                    $$self.delete();
                    if (d) {
                        d.close();
                    }
                };
                controlContainer.appendChild(button);
                button.focus();
            };
            this.controlsContainer.appendChild(this.deleteButton);

            this.container.appendChild(this.controlsContainer);

            this.column = document.createElement('div');
            this.column.setAttribute('class', 'LE-column');
            this.container.appendChild(this.column);

            $self.row.appendChild(this.container);

            this.delete = function () {
                if ($$self.container.classList.contains('LE-focused')) {
                    $scope.rightMenuCloseButton.click();
                }
                var types = $$self.container.querySelectorAll('[data-type]');
                for (var i = 0; i < types.length; i++) {
                    if (types[i].getAttribute('data-type') === 'dynamic') {
                        $scope.dynamicElementsPaletteContainer.appendChild(types[i]);
                    }
                }
                $$self.container.parentNode.removeChild($$self.container);
                $$self = null;
                if ($self.row.getElementsByClassName('LE-column-container').length === 0) {
                    $self.delete();
                }
            };
        };

        if (createColumn) {
            this.Col = new this.Column();
        }
    };

    this.PaletteElement = function (array, index, pos, parent) {
        var $self = this;
        this.index = index;
        this.pos = pos;
        this.objArrayModel = JSON.parse(JSON.stringify(array));

        this.container = document.createElement('div');
        this.container.id = 'element-' + pos + '-' + new Date().getTime() + '-' + this.index;
        this.container.setAttribute('class', 'LE-palette-element-container');
        this.container.setAttribute('data-type', pos);
        this.container.setAttribute('data-index', this.index);
        this.container.ondragstart = function (event) {
            $scope.draggedElement = event.target;
            event.dataTransfer.setData('text/plain', event.target.id);
            if (!$scope.draggedElement.id) {
                $scope.draggedElement.id = 'temporaryId';
            }
        };

        this.controlsContainer = document.createElement('div');
        this.controlsContainer.setAttribute('class', 'LE-element-controls-container');

        this.settingsButton = document.createElement('button');
        this.settingsButton.setAttribute('class', 'LE-icon LE-e-settings-button LE-tooltip-container');
        $scope.tooltip(this.settingsButton, 'settings', 'top');
        $scope.Utils.createCircle(this.settingsButton, 'LE-dark');

        this.keyupChange = function (el, i, p) {
            if (p === 'innerHTML') {
                $self.elements[i].innerHTML = el.value;
                $self.objArrayModel[i].attributes['innerHTML'] = el.value;
            } else {
                $self.elements[i].setAttribute(p, el.value);
            }
            if (el.value === '') {
                $self.elements[i].removeAttribute(p);
            }
            $self.objArrayModel[i].configurableAttributes[p].value = el.value;
        };

        this.setAttributes = function () {
            for (var i = 0; i < $self.objArrayModel.length; i++) {
                var confAttr = $self.objArrayModel[i].configurableAttributes;
                for (var p in confAttr) {
                    if (confAttr[p].input === 'text' || confAttr[p].input === 'number' || confAttr[p].input === 'date') {
                        if (p === 'innerHTML') {
                            $self.elements[i].innerHTML = confAttr[p].value;
                        } else {
                            if (confAttr[p].value !== '') {
                                if (p === 'maxlength') {
                                    (function (i, p) {
                                        $self.elements[i].onblur = function () {
                                            $self.elements[i].setAttribute(p, confAttr[p].value);
                                        };
                                    })(i, p);
                                    $self.elements[i].focus();
                                    var e = new Event('blur');
                                    $self.elements[i].dispatchEvent(e);
                                } else {
                                    $self.elements[i].setAttribute(p, confAttr[p].value);
                                }
                            }
                        }
                        if (el.value === '') {
                            $self.elements[i].removeAttribute(p);
                        }
                    } else if (confAttr[p].input === 'checkbox') {
                        if (confAttr[p].checked === 'checked') {
                            $self.elements[i].setAttribute(p, confAttr[p].value);
                        }
                    }
                }
            }
        };

        this.createSettings = function (t) {
            $scope.rightMenuContent.innerHTML = '';
            $scope.removeElementFocus();
            t.parentNode.parentNode.classList.add('LE-focused');
            for (var i = 0; i < $self.objArrayModel.length; i++) {
                var confAttr = $self.objArrayModel[i].configurableAttributes;
                if (confAttr) {
                    var tbody = $scope.rightMenuCreateTable($self.objArrayModel[i].tag);
                }
                for (var p in confAttr) {
                    var trIn = document.createElement('tr');
                    var tdLabel = document.createElement('td');
                    tdLabel.innerHTML = confAttr[p].label;
                    tdLabel.title = confAttr[p].title || '';
                    trIn.appendChild(tdLabel);

                    var input = document.createElement('input');
                    input.type = confAttr[p].input || 'text';
                    input.value = confAttr[p].value || '';

                    input.placeholder = confAttr[p].label || '';

                    if (input.type === 'text' || input.type === 'number' || input.type === 'date') {
                        (function (i, p) {
                            input.onkeyup = function () {
                                $self.keyupChange(this, i, p);
                            };
                            input.onchange = function () {
                                $self.keyupChange(this, i, p);
                            };
                        })(i, p);
                    } else if (input.type === 'checkbox') {
                        if (confAttr[p].checked === 'checked') {
                            input.setAttribute('checked', 'checked');
                            $self.elements[i].setAttribute(p, input.value);
                        }
                        (function (i, p) {
                            input.onclick = function () {
                                if (this.checked === true) {
                                    $self.elements[i].setAttribute(p, this.value);
                                    $self.objArrayModel[i].configurableAttributes[p].checked = 'checked';
                                } else {
                                    $self.elements[i].removeAttribute(p);
                                    $self.objArrayModel[i].configurableAttributes[p].checked = '';
                                }
                            };
                        })(i, p);
                    }

                    var tdInput = document.createElement('td');
                    tdInput.appendChild(input);
                    trIn.appendChild(tdInput);
                    tbody.appendChild(trIn);
                }
            }

            $scope.editorContainer.classList.add('LE-resized');
            $scope.rightMenuContainer.classList.add('LE-opened');
        };

        this.settingsButton.onclick = function () {
            $self.createSettings(this);
        };
        this.controlsContainer.appendChild(this.settingsButton);

        this.draggableButton = document.createElement('button');
        this.draggableButton.setAttribute('class', 'LE-icon LE-e-drag-button LE-tooltip-container');
        $scope.tooltip(this.draggableButton, 'drag', 'top');
        $scope.Utils.createCircle(this.draggableButton, 'LE-dark');
        this.draggableButton.onmousedown = function () {
            this.parentNode.parentNode.setAttribute('draggable', 'true');
        };
        this.draggableButton.onmouseup = function () {
            this.parentNode.parentNode.removeAttribute('draggable');
        };
        this.controlsContainer.appendChild(this.draggableButton);

        if (this.pos === 'static-dynamic') {
            this.deleteButton = document.createElement('button');
            this.deleteButton.setAttribute('class', 'LE-icon LE-e-delete-button LE-tooltip-container');
            $scope.tooltip(this.deleteButton, 'delete', 'top');
            $scope.Utils.createCircle(this.deleteButton, 'LE-dark');
            this.deleteButton.onclick = function () {
                var div = document.createElement('div');

                var p = document.createElement('p');
                p.innerHTML = 'Are you sure?';
                div.appendChild(p);
                div.setAttribute('class', 'LE-dialog');
                var d = new $scope.dialog(div);

                var controlContainer = document.createElement('div');
                controlContainer.setAttribute('class', 'LE-dialog-control-container');
                div.appendChild(controlContainer);

                var button = document.createElement('button');
                button.setAttribute('class', 'LE-delete');
                button.innerHTML = 'DELETE';
                button.onclick = function () {
                    $scope.elementsMap[$self.pos].splice($scope.elementsMap[$self.pos].indexOf($self), 1);
                    $self.container.parentNode.removeChild($self.container);
                    if ($self.container.classList.contains('LE-focused')) {
                        $scope.rightMenuCloseButton.click();
                    }
                    if (d) {
                        d.close();
                    }
                };
                controlContainer.appendChild(button);
                button.focus();
            };
            this.controlsContainer.appendChild(this.deleteButton);
        }

        this.container.appendChild(this.controlsContainer);

        this.element = document.createElement('div');
        this.element.setAttribute('class', 'LE-element');

        this.elements = new Array();

        for (var i = 0; i < array.length; i++) {
            var el = $scope.Utils.createElement(array[i]);
            this.elements.push(el);
            if (el.getAttribute('contenteditable') === 'true') {
                el.onkeyup = function () {
                    for (var i = 0; i < $scope.elementsMap[pos].length; i++) {
                        if ($scope.elementsMap[pos][i].index === $self.index) {
                            var objArrayModel = $scope.elementsMap[pos][i].objArrayModel;
                            for (var x = 0; x < objArrayModel.length; x++) {
                                if (objArrayModel[x].attributes['contenteditable'] === 'true') {
                                    objArrayModel[x].attributes['innerHTML'] = this.innerHTML;
                                    objArrayModel[x].configurableAttributes['innerHTML'].value = this.innerHTML;
                                }
                            }
                            if ($scope.rightMenuContainer.classList.contains('LE-opened')) {
                                $self.createSettings($self.settingsButton);
                            }
                        }
                    }
                };
            }
            this.element.appendChild(el);
        }
        this.container.appendChild(this.element);
        if (pos === 'dynamic') {
            $scope.dynamicElementsPaletteContainer.appendChild(this.container);
        } else if (pos === 'static') {
            $scope.staticElementsPaletteContainer.appendChild(this.container);
        } else if (pos === 'static-dynamic') {
            if (parent) {
                parent.appendChild(this.container);
            }
        }
        $scope.elementsMap[pos].push($self);
    };

    this.removeElementFocus = function () {
        for (var i = 0; i < document.getElementsByClassName('LE-focused').length; i++) {
            document.getElementsByClassName('LE-focused')[i].classList.remove('LE-focused');
        }
    };

    this.createProjectJson = function (separator) {
        var project = [];

        this.createRow = function (el, project) {
            var obj = {
                "class": el.querySelector('.LE-row').getAttribute('class'),
                "id": el.querySelector('.LE-row').id,
                "type": "row",
                "style": el.querySelector('.LE-row').getAttribute('style'),
                "childs": []
            };
            if (el.querySelector('.LE-row').children.length) {
                var children = el.querySelector('.LE-row').children;
                for (var i = 0; i < children.length; i++) {
                    this.createChilds(children[i], obj.childs);
                }
            }
            project.push(obj);
        };

        this.createColumn = function (el, project) {
            var obj = {
                "class": el.querySelector('.LE-column').getAttribute('class'),
                "id": el.querySelector('.LE-column').id,
                "type": "column",
                "style": el.querySelector('.LE-column').getAttribute('style'),
                "childs": []
            };
            if (el.querySelector('.LE-column').children.length) {
                var children = el.querySelector('.LE-column').children;
                for (var i = 0; i < children.length; i++) {
                    this.createChilds(children[i], obj.childs);
                }
            }
            project.push(obj);
        };

        this.createElement = function (el, project) {
            var obj = {
                "index": null,
                "elementType": null,
                "objArrayModel": null,
                "type": "element"
            };
            var elArray = $scope.elementsMap[el.getAttribute('data-type')];
            for (var i = 0; i < elArray.length; i++) {
                if (parseInt(el.getAttribute('data-index')) === elArray[i].index) {
                    obj.index = el.getAttribute('data-index');
                    obj.elementType = el.getAttribute('data-type');
                    obj.objArrayModel = elArray[i].objArrayModel;
                }
            }
            project.push(obj);
        };

        this.createChilds = function (el, project) {
            if (el.classList.contains('LE-row-container')) {
                this.createRow(el, project);
            } else if (el.classList.contains('LE-column-container')) {
                this.createColumn(el, project);
            } else if (el.classList.contains('LE-palette-element-container')) {
                this.createElement(el, project);
            }
        };

        if ($scope.editor.getElementsByClassName('LE-row-layer-0').length) {
            var layer = $scope.editor.getElementsByClassName('LE-row-layer-0');
            for (var i = 0; i < layer.length; i++) {
                this.createChilds(layer[i], project);
            }
        }

        $scope.project = project;

        if (separator) {
            return JSON.stringify(project, null, "  ");
        } else {
            return JSON.stringify(project);
        }
    };

    this.clearHtml = function () {
        var container = document.createElement('div');
        container.setAttribute('class', 'LE-container ' + $scope.config.cssTemplate);
        container.innerHTML = $scope.editor.innerHTML;

        var row = container.getElementsByClassName('LE-row');
        var rowArray = new Array();
        for (var i = row.length - 1; i >= 0; i--) {
            var r = row[i];
            var p = row[i].parentNode.parentNode;
            p.removeChild(row[i].parentNode);
            rowArray.push(new Array(p, r));
        }
        rowArray.reverse();
        for (var i = 0; i < rowArray.length; i++) {
            rowArray[i][0].appendChild(rowArray[i][1]);
        }

        var column = container.getElementsByClassName('LE-column');
        var columnArray = new Array();
        for (var i = column.length - 1; i >= 0; i--) {
            var c = column[i];
            var p = column[i].parentNode.parentNode;
            p.removeChild(column[i].parentNode);
            columnArray.push(new Array(p, c));
        }
        columnArray.reverse();
        for (var i = 0; i < columnArray.length; i++) {
            columnArray[i][0].appendChild(columnArray[i][1]);
        }

        var element = container.getElementsByClassName('LE-element');
        var elementArray = new Array();
        for (var i = element.length - 1; i >= 0; i--) {
            var e = element[i];
            var p = element[i].parentNode.parentNode;
            p.removeChild(element[i].parentNode);
            elementArray.push(new Array(p, e));
        }
        elementArray.reverse();
        for (var i = 0; i < elementArray.length; i++) {
            if ($scope.config.elementsContainer) {
                elementArray[i][0].appendChild(elementArray[i][1]);
            } else {
                elementArray[i][0].innerHTML += elementArray[i][1].innerHTML;
            }
        }

        var contenteditable = container.querySelectorAll('[contenteditable]');
        for (var i = contenteditable.length - 1; i >= 0; i--) {
            contenteditable[i].removeAttribute('contenteditable');
        }

        var draggable = container.querySelectorAll('[draggable]');
        for (var i = draggable.length - 1; i >= 0; i--) {
            draggable[i].removeAttribute('draggable');
        }

        var dataHidden = container.querySelectorAll('[data-hidden]');
        for (var i = dataHidden.length - 1; i >= 0; i--) {
            dataHidden[i].removeAttribute('data-hidden');
            dataHidden[i].removeAttribute('class');
            dataHidden[i].setAttribute('hidden', 'hidden');
        }

        var buttonVisibility = container.getElementsByClassName('LE-button-visibility');
        for (var i = buttonVisibility.length - 1; i >= 0; i--) {
            var p = buttonVisibility[i].parentNode;
            p.removeChild(buttonVisibility[i]);
        }

        return container;
    };

    this.Utils = {
        getParentByClass: function (el, cl) {
            if (el !== document) {
                if (el.classList.contains(cl)) {
                    return el;
                } else {
                    return this.getParentByClass(el.parentNode, cl);
                }
            } else {
                return false;
            }
        },
        createElement: function (obj) {
            var el = document.createElement(obj.tag);
            if (obj.attributes) {
                for (var attr in obj.attributes) {
                    var value = obj.attributes[attr];
                    if (value !== '') {
                        if (attr === 'innerHTML') {
                            el[attr] = obj.attributes[attr];
                        } else {
                            el.setAttribute(attr, value);
                        }
                    }
                }
            }
            if (obj.childs) {
                for (var i = 0; i < obj.childs.length; i++) {
                    el.appendChild(this.createElement(obj.childs[i]));
                }
            }
            if (obj.target) {
                obj.target.appendChild(el);
            }
            return el;
        },
        createCircle: function (el, cl) {
            var span = document.createElement('span');
            span.setAttribute('class', 'LE-round');
            el.appendChild(span);
            el.addEventListener('click', function () {
                el.getElementsByTagName('span')[0].classList.add(cl);
                setTimeout(function () {
                    el.getElementsByTagName('span')[0].classList.remove(cl);
                }, 300);
            });
        },
        copyNode: function copy(el) {
            this.setEvents = function (el, clone) {
                for (var p in el) {
                    if (p.substring(0, 2) === 'on') {
                        clone[p] = el[p];
                    }
                }
                return clone;
            };
            var clone = el.cloneNode(false);
            clone = this.setEvents(el, clone);
            var childNodes = el.childNodes;
            for (var i = 0; i < childNodes.length; i++) {
                clone.appendChild(copy(childNodes[i], el));
            }
            return clone;
        },
        formatting: function (node, lev) {
            var level = lev || 0;
            if (typeof node === 'string') {
                var div = document.createElement('div');
                div.innerHTML = node.trim();
                node = div;
            }
            var indentBefore = new Array(level++ + 1).join('  ');
            var indentAfter = new Array(level - 1).join('  ');
            var textNode;
            var br = '';
            for (var i = 0; i < node.children.length; i++) {
                if (lev) {
                    br = '\n';
                }
                textNode = document.createTextNode(br + indentBefore);
                node.insertBefore(textNode, node.children[i]);
                this.formatting(node.children[i], level);
                if (node.lastElementChild === node.children[i]) {
                    textNode = document.createTextNode('\n' + indentAfter);
                    node.appendChild(textNode);
                }
            }
            return node.innerHTML;
        }
    };

    this.initProject = function (project) {
        this.createRow = function (parent, project) {
            var r = new $scope.Row(parent, false);
            if (project.id) {
                r.row.id = project.id;
                r.objModel.configurableAttributes.class.id = project.id;
            }
            if (project.class) {
                r.row.setAttribute('class', project.class);
                r.objModel.configurableAttributes.class.value = project.class;
            }
            if (project.style) {
                r.row.setAttribute('style', project.style);
                var styleArray = project.style.split(';');
                styleArray.pop();
                for (var i = 0; i < styleArray.length; i++) {
                    var p = styleArray[i].split(':');
                    r.objModel.style[p[0]].value = p[1];
                }
            }
            if (project.childs.length > 0) {
                var children = project.childs;
                for (var i = 0; i < children.length; i++) {
                    this.createChilds(r, children[i]);
                }
            }
        };

        this.createColumn = function (parent, project) {
            var c = new parent.Column();
            if (project.id) {
                c.column.id = project.id;
            }
            if (project.class) {
                c.column.setAttribute('class', project.class);
            }
            if (project.style) {
                c.column.setAttribute('style', project.style);
                var styleArray = project.style.split(';');
                styleArray.pop();
                for (var i = 0; i < styleArray.length; i++) {
                    var p = styleArray[i].split(':');
                    c.objModel.style[p[0]].value = p[1];
                }
            }
            if (project.childs.length > 0) {
                var children = project.childs;
                for (var i = 0; i < children.length; i++) {
                    this.createChilds(c.column, children[i]);
                }
            }
        };

        this.createElement = function (parent, project) {
            if (project.elementType === 'dynamic') {
                var elArray = $scope.elementsMap['dynamic'];
                for (var i = 0; i < elArray.length; i++) {
                    if (parseInt(project.index) === elArray[i].index) {
                        elArray[i].objArrayModel = project.objArrayModel;
                        elArray[i].setAttributes();
                        parent.appendChild(elArray[i].container);
                    }
                }
            } else if (project.elementType === 'static-dynamic') {
                new $scope.PaletteElement(project.objArrayModel, parseInt(project.index), 'static-dynamic', parent);
            }
        };

        this.createChilds = function (parent, project) {
            if (project.type === 'row') {
                this.createRow(parent, project);
            } else if (project.type === 'column') {
                this.createColumn(parent, project);
            } else if (project.type === 'element') {
                this.createElement(parent, project);
            }
        };

        for (var i = 0; i < project.length; i++) {
            this.createChilds(null, project[i]);
        }
    };

    this.initButtons = function () {
        var leftmenuButton = document.getElementsByClassName('LE-leftmenu-button');
        for (var i = 0; i < leftmenuButton.length; i++) {
            this.Utils.createCircle(leftmenuButton[i], 'LE-light');
        }
        this.Utils.createCircle(this.staticPaletteButton, 'LE-light');
        this.Utils.createCircle(this.addRowButton, 'LE-light');
        this.Utils.createCircle(this.saveButton, 'LE-light');
        this.Utils.createCircle(this.showPreviewButton, 'LE-light');
        this.Utils.createCircle(this.menuButton, 'LE-light');
        this.Utils.createCircle(this.rightMenuCloseButton, 'LE-dark');
    };

    this.initPalette = function () {
        for (var i = 0; i < $scope.config.dynamicElements.length; i++) {
            new $scope.PaletteElement($scope.config.dynamicElements[i], i, 'dynamic');
        }
        for (var i = 0; i < $scope.config.staticElements.length; i++) {
            new $scope.PaletteElement($scope.config.staticElements[i], i, 'static');
        }
    };

    this.initTables = function () {
        var thCheckbox = document.getElementsByClassName('LE-th-checkbox');
        for (var i = 0; i < thCheckbox.length; i++) {
            this.Utils.createCircle(thCheckbox[i].parentNode, 'LE-blue');
            thCheckbox[i].onclick = function () {
                var tdCheckbox = document.getElementsByClassName('LE-td-checkbox');
                if (this.checked) {
                    for (var i = 0; i < tdCheckbox.length; i++) {
                        tdCheckbox[i].checked = true;
                        tdCheckbox[i].setAttribute('checked', 'checked');
                        tdCheckbox[i].parentNode.parentNode.parentNode.classList.add('LE-selected');
                    }
                } else {
                    for (var i = 0; i < tdCheckbox.length; i++) {
                        tdCheckbox[i].checked = false;
                        tdCheckbox[i].removeAttribute('checked');
                        tdCheckbox[i].parentNode.parentNode.parentNode.classList.remove('LE-selected');
                    }
                }
            };
        }

        var tdCheckbox = document.getElementsByClassName('LE-td-checkbox');
        for (var i = 0; i < tdCheckbox.length; i++) {
            this.Utils.createCircle(tdCheckbox[i].parentNode, 'LE-blue');
            tdCheckbox[i].onclick = function () {
                if (this.checked) {
                    this.parentNode.parentNode.parentNode.classList.add('LE-selected');
                } else {
                    this.parentNode.parentNode.parentNode.classList.remove('LE-selected');
                }
            };
        }

        var tdRadio = document.getElementsByClassName('LE-td-radio');
        for (var i = 0; i < tdRadio.length; i++) {
            this.Utils.createCircle(tdRadio[i].parentNode, 'LE-blue');
            tdRadio[i].onclick = function () {
                var tdRadio = document.getElementsByClassName('LE-td-radio');
                for (var i = 0; i < tdRadio.length; i++) {
                    tdRadio[i].parentNode.parentNode.parentNode.classList.remove('LE-selected');
                }
                if (this.checked) {
                    this.parentNode.parentNode.parentNode.classList.add('LE-selected');
                }
            };
        }

        var buttonVisibility = document.getElementsByClassName('LE-button-visibility');
        for (var i = 0; i < buttonVisibility.length; i++) {
            this.Utils.createCircle(buttonVisibility[i], 'LE-dark');
            buttonVisibility[i].onclick = function () {
                if (this.parentNode.getAttribute('data-hidden')) {
                    this.parentNode.removeAttribute('data-hidden');
                    this.parentNode.removeAttribute('class');
                } else {
                    this.parentNode.setAttribute('data-hidden', 'true');
                    this.parentNode.setAttribute('class', 'LE-hidden');
                }
            };
        }
    };

    this.init = function () {
        this.initUI();
        this.initButtons();
        this.initPalette();
        this.initProject($scope.project);
        this.initTables();
        setTimeout(function () {
            var leftmenuButton = document.getElementsByClassName('LE-leftmenu-button');
            if (leftmenuButton[0]) {
                leftmenuButton[0].classList.add('LE-selected');
                $scope[leftmenuButton[0].getAttribute('data-paletteContainer')].classList.add('LE-opened');
            }
            $scope.addRowButton.classList.remove('LE-fabButton--hidden');
        }, 10);
    };

    this.init();
}

module.exports = {
    $LayoutEditorConfig: $LayoutEditorConfig,
    $LayoutDesigner: $LayoutDesigner
};
