/**
 * Project: CCC WebSuite
 *
 * File Name: angular.sort.js
 *
 * Copyright 2014 CCC Corporation Limited.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * CCC Company. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with http://ccc.cccis.com/
 */

// Grid排序
(function (window, angular, undefined) {
    angular.module("commonServices")
        .directive("cccSort", function () {
            return {
                restrict: 'A',
                compile: function (element, attrs) {
                    // thead下的所有的th都要看一下有没有ccc-field, 如果有就加上排序功能
                    element.find("th").each(function (idx, el) {
                        var $el = angular.element(el);
                        var sortable = $el.attr("sortable");
                        if (sortable != null) {
                            // 将action和数据设置到th上
                            $el.attr("ccc-sort-header", attrs["cccSort"]);
                            $el.attr("ccc-sort-data", attrs["cccSortData"]);
                        }
                    });

                    return function ($scope, element, attrs) {

                    };
                }
            };
        })
        .directive("cccSortHeader", function ($timeout) {
            return {
                scope: {
                    // 排序参数
                    data: "=cccSortData",
                    // 排序动作
                    action: "&cccSortHeader"
                },
                restrict: 'A',
                replace : false,
                transclude: true,
                template: '<a class="k-link" ng-click="doSort()" href="#">' +
                    '   <span ng-transclude></span>' +
                    '   <span class="k-icon k-i-arrow-s" ng-if="state==\'asc\' && field == data.field"></span>' +
                    '   <span class="k-icon k-i-arrow-n" ng-if="state==\'desc\' && field == data.field"></span>' +
                    '</a>',
                link: function ($scope, element, attrs) {
                    $scope.state = '';
                    $scope.field = attrs["field"];
                    $scope.doSort = function () {
                        // 如果当前没有设置排序字段, 或者当前排序的是别的字段, 则应该从降序重新开始
                        if ($scope.data.dir == null || $scope.field != $scope.data.field) {
                            $scope.data.field = $scope.field;
                            $scope.data.dir = "desc";
                            $scope.state = "desc";
                        }
                        // 如果已经是降序, 接下来应该是升序
                        else if ($scope.data.dir == "desc") {
                            $scope.data.field = $scope.field;
                            $scope.data.dir = "asc";
                            $scope.state = "asc";
                        }
                        // 如果已经是升序, 接下来应该是不排序
                        else if ($scope.data.dir == "asc") {
                            $scope.data.field = null;
                            $scope.data.dir = null;
                            $scope.state = "";
                        }

                        // 触发排序事件
                        $timeout($scope.action, 0);
                    };
                }
            };
        });
})(window, window.angular);