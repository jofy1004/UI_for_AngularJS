/**
 * Project: CCC WebSuite
 *
 * File Name: angular.nodata.js
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
(function (window, angular, undefined) {
    angular.module("commonServices")
        .directive("cccNoData", function ($parse, /**Utils*/utils, $timeout, /**Messages*/ Messages) {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    $scope.$watch(attrs["cccNoData"], function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            if (newVal === 0) {
                                element.append('<div class="k-grid-content-expander" style="width: ' + element.width() + 'px;"></div>' +
                                    '<div class="noDataFound">' + Messages.NO_DATA_FOUND + '</div>');
                                // 滚动条在翻页时自动回到顶端
                                element.animate({'scrollTop': '0px'}, 10);
                            } else {
                                element.find('.k-grid-content-expander').remove();
                                element.find('.noDataFound').remove();
                            }
                        }
                    });
                }
            }
        });
})(window, window.angular);