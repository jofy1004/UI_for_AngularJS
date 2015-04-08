(function(angular) {

    var kendoUISelectApp = angular.module("kendoUISelectApp", [ "kendo.directives", "httpModule" ]);

    /**
     * dropDownList
     */
    kendoUISelectApp.controller("DropDownListController", InitDropDownListController);

    InitDropDownListController.$inject = [ "$scope", "ajaxService" ];

    function InitDropDownListController($scope, http) {
        var url = "http://jofy1004.github.io/blog/data/grid.json";
        http.httpGet(url).success(function(data) {
            $scope.dropDownListData = data;
        });

        $scope.dropDownListOptions = {
            dataTextField : "name",
            dataValueField : "id"
        };

        $scope.doSomething = function() {
            console.log("第一个选择后，干点事情！" + $scope.myData.id + "-" + $scope.myData.name);
        };

        $scope.myData = {
            id : 3,
            name : 'Baz'
        };

    }

    /**
     * comboBox
     */
    kendoUISelectApp.controller("ComboBoxController", InitComboBoxController);

    InitComboBoxController.$inject = [ "$scope", "ajaxService" ];

    function InitComboBoxController($scope, http) {
        var url = "http://jofy1004.github.io/blog/data/grid.json";
        http.httpGet(url).success(function(data) {
            $scope.comboBoxData = data;
        });

        $scope.comboBoxOptions = {
            dataTextField : "name",
            dataValueField : "id"
        };

        $scope.myData = {
            id : 2,
            name : 'Bar'
        };
    }

})(angular);
