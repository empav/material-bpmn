/**
 * Created by brero on 21/02/2017.
 */


var ModalController = function($modalInstance, options) {
    var vm = this;

    vm.modalSize = options.size;
    vm.modalHeader = options.header;
    vm.modalContent = options.content;
    vm.modalName = options.name;
    vm.modalEndMark = options.endMark;
    vm.modalAction = options.action;

    vm.modalButtonYes = function () {
        vm.modalButtonCancel();
        vm.modalAction();
    }

    vm.modalButtonCancel = function () {
        $modalInstance.close();
    }
};

ModalController.$inject = ['$modalInstance', 'options'];

module.exports = ModalController;
