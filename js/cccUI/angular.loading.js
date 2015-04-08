/**
 * Project: CCC WebSuite
 *
 * File Name: angular.loading.js
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
        .directive("cccLoading", function (/**Utils*/ utils,
                                           /**LoadingService*/ LoadingService,
                                           /**Messages*/ Messages) {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    $scope.$watch(attrs["cccLoading"], function (newVal, oldVal) {
                        if(newVal == oldVal){
                            return;
                        }
                        if (newVal) {
                            LoadingService.block(element);
                        } else {
                            LoadingService.unblock(element);
                        }
                    });
                }
            }
        });
})(window, window.angular);