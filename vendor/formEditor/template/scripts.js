'use-strict';

function $TemplateFunction(templateClass) {
  var $scope = this;

  var tempPos = 0;
  if (document.getElementsByClassName(templateClass)[1]) {
    var tempPos = 1;
  }
  this.template = document.getElementsByClassName(templateClass)[tempPos];

  this.dataMultipleTable = function () {
    var childs = [];

    return childs;
  };

  this.dataSingleTable = function () {
    var childs = [];

    return childs;
  };

  this.initTables = function () {
    var table = $scope.template.getElementsByClassName('LE-table');
    var ps = [];
    for (var i = 0; i < table.length; i++) {
      var res = $scope[table[i].getAttribute('data-tabledata')]();
      var p = new Promise(function (resolve, reject) {
        var th = table[i].getElementsByTagName('th');

        for (var x = 0; x < res.length; x++) {
          var el = $scope.Utils.createElement(res[x]);
          var td = el.getElementsByTagName('td');
          for (var y = 0; y < th.length; y++) {
            if (th[y].getAttribute('hidden') === 'hidden') {
              td[y].setAttribute('hidden', 'hidden');
            }
          }
          table[i].getElementsByTagName('tbody')[0].appendChild(el);
        }
        resolve({status: true});
      });
      ps.push(p);
    }

    Promise.all(ps).then(function (values) {
      var thCheckbox = $scope.template.getElementsByClassName('LE-th-checkbox');
      for (var i = 0; i < thCheckbox.length; i++) {
        $scope.Utils.createCircle(thCheckbox[i].parentNode, 'LE-blue');
        thCheckbox[i].onclick = function () {
          var tdCheckbox = $scope.template.getElementsByClassName('LE-td-checkbox');
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

      var tdCheckbox = $scope.template.getElementsByClassName('LE-td-checkbox');
      for (var i = 0; i < tdCheckbox.length; i++) {
        $scope.Utils.createCircle(tdCheckbox[i].parentNode, 'LE-blue');
        tdCheckbox[i].onclick = function () {
          if (this.checked) {
            this.parentNode.parentNode.parentNode.classList.add('LE-selected');
          } else {
            this.parentNode.parentNode.parentNode.classList.remove('LE-selected');
          }
        };
      }

      var tdRadio = $scope.template.getElementsByClassName('LE-td-radio');
      for (var i = 0; i < tdRadio.length; i++) {
        $scope.Utils.createCircle(tdRadio[i].parentNode, 'LE-blue');
        tdRadio[i].onclick = function () {
          var tdRadio = $scope.template.getElementsByClassName('LE-td-radio');
          for (var i = 0; i < tdRadio.length; i++) {
            tdRadio[i].parentNode.parentNode.parentNode.classList.remove('LE-selected');
          }
          if (this.checked) {
            this.parentNode.parentNode.parentNode.classList.add('LE-selected');
          }
        };
      }

    });
  };

  this.Utils = {
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
    }
  };

  this.init = function () {
    this.initTables();
  };
}

var templateFunction = new $TemplateFunction('base-template');
templateFunction.init();
