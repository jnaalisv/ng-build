(function() {
    'use strict';

    angular
        .module('osuva.directives', ['commonLib'])
        .directive('greeter', greeter);

    function greeter() {
        return {
            element: 'E',
            controller: GreeterController,
            controllerAs: 'greeterController',
            bindToController: true,
            scope: {
                name: '='
            },
            templateUrl: 'app/directives/greeter.html'
        }
    }

    function GreeterController(commonService) {
        var vm = this;
        vm.greeting = commonService.getGreeting();
    }
})();