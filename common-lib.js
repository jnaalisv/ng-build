(function() {
    'use strict';

    angular
        .module('commonLib', [])
        .service('commonService', CommonService);

    function CommonService() {
        var api = {
            helloWorld: helloWorld,
            getGreeting: getGreeting,
        };

        function helloWorld() {
            return 'CommonSays: hello, world!'
        }

        function getGreeting() {
            return 'Hello Hello, '
        }

        return api;
    }

})();