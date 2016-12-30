(function() {
    'use strict';

    angular
        .module('commonLib', [])
        .service('commonService', CommonService);

    function CommonService() {
        var api = {
            helloWorld: helloWorld
        };

        function helloWorld() {
            console.log('hello world');
            return 'CommonSays: hello, world!'
        }

        return api;
    }

})();