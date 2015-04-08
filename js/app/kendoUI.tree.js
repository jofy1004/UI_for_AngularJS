(function(angular) {

    var kendoUITreeViewApp = angular.module("kendoUITreeViewApp", [ "kendo.directives", "httpModule" ]);

    /**
     * tabStrip
     */
    kendoUITreeViewApp.controller("TreeViewController", InitTreeViewController);

    InitTreeViewController.$inject = [ "$scope" ];

    function InitTreeViewController($scope) {


    }
})(angular);
