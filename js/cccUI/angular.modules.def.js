/**
 * Project: CCC WebSuite
 *
 * File Name: angular.modules.js
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
    window.getEstimatingURL = function(subUrl){
        //var CONTEXT_PATH = "/web-suite";
        var CONTEXT_PATH = "/web-estimating";
        var estimatingURL = null;
        if (!subUrl){
            estimatingURL = CONTEXT_PATH + "/";
        }else if (subUrl.substring(0, 1) != "/"){
            estimatingURL = CONTEXT_PATH + "/" + subUrl;
        }else {
            estimatingURL = CONTEXT_PATH + subUrl;
        }
        return estimatingURL;
    };
    angular.module("commonServices", ["kendo.directives", "ngDialog"]).config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            showClose: false,
            closeByDocument: false,
            closeByEscape: false
        });
    }]).factory("getEstimatingURL",function(){
        return getEstimatingURL;
    });

    angular.module("RepairFactoryAdmin", ["commonServices", "ngDialog"]).run(function($rootScope, Messages){
        // 登录用户信息
        $rootScope.UserModel = USERMODEL;
        // 消息
        $rootScope.Messages = Messages;
    }).config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            showClose: false,
            closeByDocument: false,
            closeByEscape: false
        });
    }]);
    angular.module("ClaimInfo", ["commonServices"]).run(function($rootScope, Messages){
        // 消息
        $rootScope.Messages = Messages;
        $rootScope.actionErrorList = [];
    });

    angular.module("SysConfig", ["commonServices"]).run(function($rootScope, Messages){
        // 消息
        $rootScope.Messages = Messages;
    });
})(window, window.angular);
