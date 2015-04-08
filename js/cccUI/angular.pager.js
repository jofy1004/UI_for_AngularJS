/**
 * Project: CCC WebSuite
 *
 * File Name: angular.pager.js
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

// angular的公共模块定义列在这里面
(function(window, angular) {
    angular
            .module("commonServices")
            .directive(
                    "cccPager",
                    function($parse, $timeout) {
                        // 最多显示的页码
                        var MAX_PAGER = 10;
                        return {
                            restrict : 'E',
                            scope : {
                                currentPage : "=",
                                pageSize : "=",
                                totalRecord : "=",
                                pageOptions : "=",
                                pageChange : "&"
                            },
                            template : '<div class="k-pager-wrap k-grid-pager k-widget">'
                                    + '    <a ng-show="totalRecord > 0" ng-click="!hasPrev || gotoPage(1)" title="首页" ng-class="{\'k-link k-pager-nav k-pager-first\':hasPrev, \'k-link k-pager-nav k-pager-first k-state-disabled\':!hasPrev}" tabindex="-1">'
                                    + '        <span class="k-icon k-i-seek-w">首页</span>'
                                    + '    </a>'
                                    + '    <a ng-show="totalRecord > 0" ng-click="!hasPrev || gotoPage(currentPage - 1)" title="上一页" ng-class="{\'k-link k-pager-nav\':hasPrev, \'k-link k-pager-nav k-state-disabled\':!hasPrev}" tabindex="-1">'
                                    + '        <span class="k-icon k-i-arrow-w">上一页</span>'
                                    + '    </a>'
                                    + '    <ul ng-show="totalRecord > 0" class="k-pager-numbers k-reset">'
                                    + '        <li ng-if="hasPrevMore"><a tabindex="-1" ng-click="gotoPage(prevMore)" class="k-link" title="More pages">...</a></li>'
                                    + '        <li ng-repeat="i in pages">'
                                    + '           <span ng-if="i==currentPage" class="k-state-selected" >{{i}}</span>'
                                    + '           <a ng-if="i!=currentPage" tabindex="-1" class="k-link" ng-click="gotoPage(i)">{{i}}</a></li>'
                                    + '        </li>'
                                    + '        <li ng-if="hasNextMore"><a tabindex="-1" ng-click="gotoPage(nextMore)" class="k-link" title="More pages">...</a></li>'
                                    + '    </ul>'
                                    + '    <a ng-show="totalRecord > 0" ng-click="!hasNext || gotoPage(currentPage + 1)" title="下一页" ng-class="{\'k-link k-pager-nav k-pager-first\':hasNext, \'k-link k-pager-nav k-pager-first k-state-disabled\':!hasNext}" tabindex="-1">'
                                    + '        <span class="k-icon k-i-arrow-e">下一页</span>'
                                    + '    </a>'
                                    + '    <a ng-show="totalRecord > 0" ng-click="!hasNext || gotoPage(totalPage)" title="尾页" ng-class="{\'k-link k-pager-nav k-pager-last\':hasNext, \'k-link k-pager-nav k-pager-last k-state-disabled\':!hasNext}" tabindex="-1">'
                                    + '        <span class="k-icon k-i-seek-e">尾页</span>'
                                    + '    </a>'
                                    + '    <span class="k-pager-sizes k-label" ng-show="totalRecord > 0 && showPageSize">'
                                    + '        <input kendo-drop-down-list k-data-source="pageOptions" ng-model="pageSize"/>每页显示'
                                    + '    </span>'
                                    + '    <span class="k-pager-sizes k-label" ng-show="totalRecord > 0 && !showPageSize">每页显示{{pageSize}}</span>'
                                    + '    <span ng-show="totalRecord > 0" class="k-pager-info k-label">当前 {{startRecord}} - {{endRecord}} 条，总共 {{totalRecord}} 条</span>'
                                    + '</div>',
                            link : function($scope, element, attrs) {
                                // 默认值
                                if (!angular.isDefined($scope.totalRecord)) {
                                    $scope.totalRecord = 0;
                                }
                                if (!angular.isDefined($scope.currentPage)) {
                                    $scope.currentPage = 0;
                                }
                                if (!angular.isDefined($scope.pageSize)) {
                                    $scope.pageSize = 10;
                                }
                                $scope.showPageSize = angular.isDefined($scope.pageOptions);

                                // 计算总页数
                                var calculateTotalPage = function() {
                                    var p = divide($scope.totalRecord, $scope.pageSize);
                                    var mod = $scope.totalRecord % $scope.pageSize;

                                    // 总页数
                                    $scope.totalPage = mod == 0 ? p : p + 1;
                                };

                                // 计算本页第一条记录和最后一条记录
                                var calculateStartAndEndRecord = function() {
                                    $scope.startRecord = ($scope.currentPage - 1) * $scope.pageSize + 1;
                                    $scope.endRecord = Math.min($scope.currentPage * $scope.pageSize,
                                            $scope.totalRecord);
                                };

                                // 计算各种数据
                                var calculate = function() {
                                    // 总页数
                                    calculateTotalPage();
                                    calculateStartAndEndRecord();

                                    // 总共有几个区域.
                                    var p = divide($scope.totalPage, MAX_PAGER);
                                    var mod = $scope.totalPage % MAX_PAGER;
                                    var maxPager = mod == 0 ? p - 1 : p;
                                    // 当前页处于哪个区域, [0..10],[11..20]...
                                    var cp = divide($scope.currentPage, MAX_PAGER);
                                    var cmod = $scope.currentPage % MAX_PAGER;
                                    cp = cmod == 0 ? cp - 1 : cp;

                                    // 开始页
                                    $scope.startPage = cp * MAX_PAGER + 1;
                                    // 结束页
                                    $scope.endPage = Math.min((cp + 1) * MAX_PAGER, $scope.totalPage);

                                    // 页码
                                    $scope.pages = [];
                                    for ( var i = $scope.startPage; i <= $scope.endPage; i++) {
                                        $scope.pages.push(i);
                                    }

                                    // 前面的页面
                                    $scope.hasPrevMore = (cp > 0);
                                    $scope.prevMore = cp * MAX_PAGER;
                                    // 后面的页码
                                    $scope.hasNextMore = (cp < maxPager);
                                    $scope.nextMore = (cp + 1) * MAX_PAGER + 1;

                                    // 上一页
                                    $scope.hasPrev = ($scope.currentPage != 1);
                                    // 下一页
                                    $scope.hasNext = ($scope.currentPage != $scope.totalPage);
                                };

                                // 跳转到某页
                                $scope.gotoPage = function(page) {
                                    if ($scope.currentPage != page) {
                                        $scope.currentPage = page;
                                        calculate();
                                        $timeout(function() {
                                            $scope.pageChange();
                                        }, 0);
                                    }
                                };

                                // 每页记录数变了时, 要重重新加载数据
                                $scope.$watch("pageSize", function(newValue, oldValue) {
                                    if (newValue !== oldValue) {
                                        calculate();
                                        $timeout(function() {
                                            $scope.pageChange();
                                        }, 0);
                                    }
                                });

                                // 当总记录数发生变化时,重新计算页码
                                $scope.$watch("totalRecord", function(newValue, oldValue) {
                                    if (newValue !== oldValue) {
                                        calculate();
                                    }
                                });

                                // 先计算一遍
                                calculate();

                                /**
                                 * 整除两个数值
                                 * @param exp1 被除数
                                 * @param exp2 除数
                                 * @returns {number}
                                 */
                                function divide(exp1, exp2) {
                                    var n1 = Math.round(exp1); //四舍五入
                                    var n2 = Math.round(exp2); //四舍五入
                                    var rslt = n1 / n2; //除
                                    if (rslt >= 0) {
                                        rslt = Math.floor(rslt); //返回值为小于等于其数值参数的最大整数值。
                                    } else {
                                        rslt = Math.ceil(rslt); //返回值为大于等于其数字参数的最小整数。
                                    }
                                    return rslt;
                                }
                            }
                        }
                    });
})(window, window.angular);