/**
 * Project: CCC WebSuite
 *
 * File Name: angular.loading.service.js
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

/**
 * @namespace LoadingService
 */
(function (window, angular, $, undefined) {
    angular.module("commonServices")
        .factory("LoadingService", function (/**Messages*/ Messages, getEstimatingURL) {
            $.blockUI.defaults.message = "<img src='" + getEstimatingURL("/css/kendo/Silver/loading-image.gif' />")
                + "<br/><div class='fontstyle'>" + Messages.STR_BLOCK_MESSAGE + "</div>";
            $.blockUI.defaults.css.textAlign = "center";
            $.blockUI.defaults.css.border = "none";
            $.blockUI.defaults.css.backgroundColor = "none";
            $.blockUI.defaults.overlayCSS.opacity = .5;
            $.blockUI.defaults.overlayCSS.backgroundColor = "#fff";
            $.blockUI.defaults.centerX = false;
            $.blockUI.defaults.centerY = false;

            var findMask = function ($el) {
                return $el.find(".k-loading-mask");
            };

            var addMask = function(){
                return angular.element("<div class='k-loading-mask'></div>");
            };


            return /** @lends LoadingService */{
                /**
                 * 显示加载中
                 * @param {HTMLElement} el
                 */
                block: function (el) {
                    var $el = angular.element(el);
                    var mask = findMask($el);
                    if (!mask.length) {
                        mask = addMask();
                        $el.block();
                    }
                },
                /**
                 * 隐藏加载中
                 * @param {HTMLElement} el
                 */
                unblock: function (el) {
                    var $el = angular.element(el);
                    var mask = findMask($el);
                    mask.remove();
                    $el.unblock();
                }
            }
        });
})(window, window.angular, jQuery);