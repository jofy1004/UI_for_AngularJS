(function(angular) {
    var kendoUISelectApp = angular.module("kendoUISelectApp");

    /**
     * tabStrip
     */
    kendoUISelectApp.controller("TabStripController", InitTabStripController);

    InitTabStripController.$inject = [ "$scope" ];

    function InitTabStripController($scope) {
        $scope.contentURLs = [ null, null, "../html/kendoUI.select.html" ];

    }
})(angular);
