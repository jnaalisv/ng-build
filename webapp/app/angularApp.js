(function() {
    'use strict';

    angular
        .module('osuva', ['commonLib'])
        .controller('AppCtrl', AppCtrl);

    function AppCtrl(commonService) {
        var vm = this;

        vm.message = 'this is a message from your controller';
        vm.messageFromCommon = commonService.helloWorld();
    }

})();