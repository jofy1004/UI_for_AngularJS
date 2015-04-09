(function(angular) {

    var kendoUITreeViewApp = angular.module("kendoUITreeViewApp", [ "kendo.directives", "httpModule" ]);

    /**
     * tabStrip
     */
    kendoUITreeViewApp.controller("TreeViewController", InitTreeViewController);

    InitTreeViewController.$inject = [ "$scope", "ajaxService" ];

    function InitTreeViewController($scope, http) {
        var url = "http://jofy1004.github.io/blog/data/tree.json";
        http.httpGet(url).success(function(data) {
            $scope.treeViewData = data;
        });

        $scope.treeViewOptions = {
            template : '{{dataItem.text}}（{{dataItem.id}}）',
            autoBound : false
        };

        $scope.bindTreeChange = function(selectedItem) {
            $scope.selectTreeNode = selectedItem;
        };

    }
})(angular);
