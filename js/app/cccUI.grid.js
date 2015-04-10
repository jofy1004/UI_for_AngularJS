(function(angular) {

    var cccUIGridApp = angular.module("cccUIGridApp", [ "commonServices", "httpModule" ]);

    /**
     * tabStrip
     */
    cccUIGridApp.controller("GridAppController", InitGridAppController);

    InitGridAppController.$inject = [ "$scope", "ajaxService" ];

    function InitGridAppController($scope, http) {
        var url = "http://jofy1004.github.io/UI_for_AngularJS/data/gridData.json";
        http.httpGet(url).success(function(data) {
            $scope.gridData = data;
        });

        $scope.canEdit = function() {
            return true;
        }

    }
})(angular);
