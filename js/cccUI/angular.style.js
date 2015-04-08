/**
 * Project: CCC WebSuite
 *
 * File Name: angular.style.js
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

// 一些跟样式有关的directive
(function (window, angular, undefined) {
    angular.module("commonServices")
        .directive("cccHoverClass", function () {
            return {
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    var cfg = $scope.$eval(attrs["cccHoverClass"]);
                    element.mouseenter(function () {
                        $(this).removeClass().addClass(cfg.enter);
                    }).mouseleave(function () {
                        $(this).removeClass().addClass(cfg.leave);
                    });
                }
            };
        });
})(window, window.angular);