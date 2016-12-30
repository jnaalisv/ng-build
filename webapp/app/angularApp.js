(function() {
    'use strict';

    angular
        .module('osuva', ['commonLib', 'osuva.directives'])
        .controller('AppCtrl', AppCtrl);

    function AppCtrl(commonService) {
        var vm = this;

        vm.message = 'this is a message from your controller';
        commonService.helloWorld();
    }

})();