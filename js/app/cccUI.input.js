(function(angular) {

    var cccUIInputApp = angular.module("cccUIInputApp", [ "commonServices" ]);

    /**
     * tabStrip
     */
    cccUIInputApp.controller("InputController", InitInputController);

    InitInputController.$inject = [ "$scope" ];

    function InitInputController($scope) {
        $scope.custom = {
            name : "Jack",
            age : 18,
            dirty : false,
            birthday : "1999-01-01",
            startDate : "2014-01-01",
            endDate : "2014-12-12"
        };

        $scope.canEdit = function(){
            return true;
        }
    }
})(angular);
