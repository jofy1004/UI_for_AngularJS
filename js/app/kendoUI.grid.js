(function(angular) {

    var kendoUIGridApp = angular.module("kendoUIGridApp", [ "kendo.directives", "httpModule" ]);

    kendoUIGridApp.controller("GridController", InitGridController);
    InitGridController.$inject = [ "$scope", "ajaxService" ];

    /**
     * 初始化kendoGird
     * @param $scope
     */
    function InitGridController($scope, http) {
        var url = "http://jofy1004.github.io/blog/data/grid.json";
        http.httpGet(url).success(function(data) {
            $scope.gridOptions.dataSource.data(data);
        });

        var kendoGrid;

        /**
         * kendoGird 参数设置
         * @type {{dataSource: kendo.data.DataSource, selectable: string, columns: *[]}}
         */
        $scope.gridOptions = {
            dataSource : new kendo.data.DataSource({
                pageSize : 5,
                sort : [ {
                    field : "id",
                    dir : "desc"
                }, {
                    field : "name",
                    dir : "asc"
                } ]
            }),
            detailTemplate : kendo.template($("#template").html()),
            selectable : "row",
            pageable : {// 每页显示多少行
                refresh : false,
                pageSizes : [ 5, 10, 15 ],
                pageSize : 5
            },
            columns : [ {
                field : "",
                title : "",
                template : function() {
                    return '<input type="checkbox" />'
                }
            }, {
                field : "type",
                title : "性别"

            }, {
                field : "name",
                title : "名称"

            }, {
                field : "id",
                title : "编号"
            } ],
            dataBound : function() {
                kendoGrid = this;
            }
        };

        $scope.bindGridChange = function(selectedItem) {
            $scope.selectedGridData = selectedItem;
            kendoGrid.collapseRow(".k-master-row");
            kendoGrid.expandRow($(event.target).closest(".k-master-row"));
        };

    }
})(angular);
