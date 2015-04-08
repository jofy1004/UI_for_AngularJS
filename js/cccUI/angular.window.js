/**
 * Project: CCC WebSuite
 *
 * File Name: angular.window.js
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

// Window
(function (window, angular, undefined) {
    angular.module("commonServices")
        .directive("cccWindow", function ($parse, /**Messages*/ Messages, $timeout) {
            return {
                scope: false,
                restrict: 'A',
                link: function ($scope, element, attrs) {
                    // Window选项
                    var options = $scope.$eval(attrs["cccWindow"]);
                    var closeFn = $parse(attrs["windowClose"]);
                    // 关闭事件
                    options.close = function (e) {
                        // 这里需要放一个标识, 因为closeFn里的行为有可能造成windowVisible发生变化从而调用wnd.close()
                        wnd.closing = true;
                        // 如果是用户点击关闭按钮, 需要手动触发$digest()
                        if (e.userTriggered) {
                            $scope.$apply(function () {
                                closeFn($scope, {e: e});
                            });
                        }
                        // 否则本来应该已经在$digest()中
                        else {
                            closeFn($scope, {e: e});
                        }
                        // 关闭事件处理完了以后要把状态置回来
                        wnd.closing = false;
                    };
                    // 打开事件
                    var openFn = $parse(attrs["windowOpen"]);
                    options.open = function (e) {
                        openFn($scope, {e: e});
                    };

                    // KendoWindow实例
                    var wnd = element.kendoWindow(options).data("kendoWindow");
                    wnd.center();

                    // 是否是第一次事件
                    var firstInit = true;

                    // 由windowVisible的值控制打开/关闭窗口
                    if (attrs["windowVisible"]) {
                        $scope.$watch(attrs["windowVisible"], function (newVal, oldVal) {
                            // 第一次触发属性变化不做处理
                            if (firstInit) {
                                firstInit = false;
                                return;
                            }
                            if (newVal != oldVal) {
                                if (newVal) {
                                    wnd.toFront();
                                    wnd.open();
                                } else if (!wnd.closing) {
                                    wnd.close();
                                }
                            }
                        });
                    }

                    // 设置window的属性
                    if (attrs["windowOptions"]) {
                        $scope.$watch(attrs["windowOptions"], function (newVal, oldVal) {
                            if (newVal != oldVal && newVal) {
                                wnd.setOptions(newVal);
                            }
                        }, true);
                    }

                }
            };
        });
})(window, window.angular);