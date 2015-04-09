/**
 * Project: CCC WebSuite
 *
 * File Name: angular.searchpanel.js
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
        .directive("cccSearchPanel", function (/**resetHeight*/resetHeight, $timeout) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div class="taskInquiry">' +
                    '   <div ng-transclude></div>' +
                    '   <div class="topLine" ng-if="!visible" style="display:block;"></div>' +
                    '   <div class="topLine" ng-if="visible" style="display:none;"></div>' +
                    '   <div ng-class="{\'toggleTop\':visible, \'toggleBot toggleTop\':!visible}" ng-click="togglePanel()">' +
                    '       <span class="currentTop"></span>' +
                    '   </div>' +
                    '</div>',
                link: function ($scope, element, attrs) {
                    var gridId = attrs["cccSearchPanel"];
                    $scope.visible = true;
                    $scope.togglePanel = function () {
                        $scope.visible = !$scope.visible;
                        if (gridId) {
                            $timeout(function(){
                                resetHeight({element: "#" + gridId, type: "grid"});
                            }, 0);
                        }
                    };
                }
            };
        }).directive("cccSearchPanelForm", function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div class="taskInquiryCon k-content" ng-show="visible" ng-transclude></div>',
                link: function ($scope, element, attrs) {
                }
            };
        }).directive("cccSearchPanelAction", function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div class="submit_from" ng-show="visible" ng-transclude></div>',
                link: function ($scope, element, attrs) {
                }
            };
        });
})(window, window.angular);