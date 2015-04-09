(function(angular) {
    var kendoUITabStripApp = angular.module("kendoUITabStripApp", [ "kendo.directives" ]);

    /**
     * tabStrip
     */
    kendoUITabStripApp.controller("TabStripController", InitTabStripController);

    InitTabStripController.$inject = [ "$scope" ];

    function InitTabStripController($scope) {
        $scope.contentURLs = [ null, null, "../html/tabInclude.html" ];

    }
})(angular);
