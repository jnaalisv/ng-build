(function() {
    'use strict';

    angular
        .module('osuva', ['commonLib', 'osuva.directives', 'version'])
        .controller('AppCtrl', AppCtrl);

    function AppCtrl(commonService, FRONTEND_VERSION) {
        var vm = this;

        vm.message = 'this is a message from your controller';

        vm.FRONTEND_VERSION = FRONTEND_VERSION.BUILD_VERSION;
        vm.BUILD_DATE = FRONTEND_VERSION.BUILD_DATE;

        commonService.helloWorld();
    }

})();