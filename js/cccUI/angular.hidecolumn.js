/**
 * Project: CCC WebSuite
 *
 * File Name: angular.hidecolumn.js
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

// Grid隐藏列
(function (window, angular, undefined) {
    angular.module("commonServices")
        .directive("cccHideColumn", function (/**HideColumnService*/ HideColumnService, /**Messages*/ Messages, /**Utils*/ utils, /**ColumnHiderFactory*/ColumnHiderFactory) {
            // 最大4行
            var MAX_ROW_NUM = 4;

            return {
                scope: true,
                restrict: 'EA',
                replace: true,
                template: '<span class="columnHideButton columnHide" ng-click="show()">' +
                    '   <span class="gridSetIco" title="{{Messages.HIDE_COLUMN}}" ccc-hover-class="{\'enter\':\'gridSetHoverIco\',\'leave\':\'gridSetIco\'}"></span>' +
                    '   <div ccc-window="{visible:false,pinned:true,animation:false,modal:true, draggable:false, resizable:false, title:Messages.HIDE_COLUMN}" window-visible="settingVisible" window-close="close()" window-options="options">' +
                    '       <div class="gridSetting">' +
                    '           <table>' +
                    '               <tr ng-repeat="row in datas">' +
                    '                   <td ng-repeat="col in row track by $index" width="100">' +
                    '                       <label ng-click="switchSetting(col)"><input type="checkbox" ng-model="col.checked" data-field="{{col.field}}" style="margin-right: 5px"/>{{col.title}}</label>' +
                    '                   </td>' +
                    '               </tr>' +
                    '           </table>' +
                    '       </div>' +
                    '       <div class="gridSettingBottom windowBottom" align="center" ng-click="close()">' +
                    '           <span class="button comBtn popBtn">' +
                    '               <span class="buttonText comBtnRt popBtnRt">{{Messages.CLOSE}}</span>' +
                    '           </span>' +
                    '       </div>' +
                    '   </div>' +
                    '</span>',
                compile: function (element, attrs) {
                    var wnd = element.find("div");

                    // 关联的grid;
                    var gridId = attrs["cccHideColumn"];
                    var grid = element.closest("#" + gridId);
                    // 建立关联
                    wnd.data("columnsetting", gridId);

                    // 设置窗口的宽
                    // 找到所有可以隐藏的列
                    var ths = grid.find('th[field][canhidden!=false]');
                    // 个数
                    var length = ths.length;
                    var columnNumber = utils.divide(length, MAX_ROW_NUM);
                    columnNumber = length % MAX_ROW_NUM == 0 ? columnNumber + 1 : columnNumber;
                    var width = columnNumber * 100;
                    wnd.find(".gridSetting").width(width);

                    var hider = ColumnHiderFactory.get(gridId);

                    return function ($scope, element, attrs) {

                        // 把Messages放到Scope里面
                        $scope.Messages = Messages;
                        $scope.options = null;
                        $scope.datas = [];

                        /**
                         * 从grid中取得所有的隐藏列
                         * @param columns 数据库中的隐藏列
                         */
                        var getAllColumns = function (columns) {
                            // 然后竖着排列
                            // [1] [5] [..]
                            // [2] [6]
                            // [3] [7]
                            // [4] [8]

                            // 最大4行
                            $scope.datas = [];
                            for (var i = 0; i < Math.min(length, MAX_ROW_NUM); i++) {
                                $scope.datas.push([]);
                            }

                            // 更具th的设定填写数据
                            ths.each(function (idx, th) {
                                var $th = angular.element(th);
                                var rowIdx = idx % MAX_ROW_NUM;
                                $scope.datas[rowIdx].push({
                                    title: $th.text(),
                                    field: $th.attr("field"),
                                    checked: columns.contains($th.attr("field"))
                                });
                            });
                        };

                        // 显示设置窗口
                        $scope.show = function () {
                            $scope.settingVisible = true;
                            // 矫正窗口位置
                            $scope.options = {
                                position: {
                                    top: grid.offset().top + grid.find("th.k-header").parent().height(),
                                    left: element.offset().left - wnd.closest('.k-window').width() + element.width()
                                }
                            };
                        };

                        // 保存设定
                        $scope.close = function () {
                            $scope.settingVisible = false;
                            var columns = _.chain($scope.datas)
                                .flatten()
                                .select(function (obj) {return obj.checked})
                                .map(function (obj) {return obj.field})
                                .value();
                            HideColumnService.saveSettings(gridId, columns);
                        };

                        // 隐藏/显示列
                        $scope.switchSetting = function (cfg) {
                            if (cfg.checked) {
                                hider.hide(cfg.field);
                            } else {
                                hider.show(cfg.field);
                            }
                        };

                        // 当redraw绑定的值发生变化时
                        $scope.$watch(attrs["redraw"], function (newVal, oldVal) {
                            if(newVal == oldVal){
                                return;
                            }
                            var columns = _.chain($scope.datas)
                                .flatten()
                                .select(function (obj) {return obj.checked})
                                .map(function (obj) {return obj.field})
                                .value();
                            // 重新隐藏列
                            for (var i = 0; i < columns.length; i++) {
                                hider.hide(columns[i]);
                            }
                        });

                        // 加载设定
                        var loader = HideColumnService.loadSettings(gridId);
                        loader.success(function (columns) {
                            // 初始化列
                            getAllColumns(columns);
                            // 隐藏初始列
                            for (var i = 0; i < columns.length; i++) {
                                hider.hide(columns[i]);
                            }
                        });
                    }
                }
            }
        }).factory("HideColumnService", function ($http, getEstimatingURL) {
            /**
             * @namespace HideColumnService
             */
            return /** @lends HideColumnService*/ {
                /**
                 * 加载列隐藏设置
                 * @param {String} gridId 需要列隐藏的配置Grid
                 * @return {HttpPromise}
                 */
                loadSettings: function (gridId) {
                    var url = getEstimatingURL("foundation/checkgridsetting");
                    var params = {gridId: gridId};
                    return $http.post(url, JSON.stringify(params), {
                        responseType: "json",
                        headers: {
                            "Content-Type": 'application/json; charset=UTF-8'
                        }
                    });
                },

                /**
                 * 保存列隐藏设置
                 * @param {String} gridId 需要列隐藏的配置Grid
                 * @param {Array.<String>} columns 要隐藏的列
                 * @return {HttpPromise}
                 */
                saveSettings: function (gridId, columns) {
                    var url = getEstimatingURL("foundation/gridsetting");
                    var params = {gridId: gridId, columns: columns};
                    return $http.post(url, JSON.stringify(params), {
                        responseType: "json",
                        headers: {
                            "Content-Type": 'application/json; charset=UTF-8'
                        }
                    });
                }
            }
        }).factory("ColumnHiderFactory", function () {
            /**
             * @namespace ColumnHiderFactory
             */
            return /** @lends ColumnHiderFactory*/ {
                /**
                 * 取得用于隐藏和显示表格中的列的对象
                 *
                 * @param {jQuery} grid grid的Id
                 * @returns {ColumnHider}
                 */
                get: function (grid) {
                    // 初始化, 把所有列的信息先保持下来
                    var $grid = angular.element("#" + grid);
                    var thead = $grid.find("div.k-grid-header").find("thead");
                    var tbody = $grid.find("div.k-grid-content").find("tbody");
                    var theadColGrp = thead.prev("colgroup");
                    var tbodyColGrp = tbody.prev("colgroup");
                    var columns = [];
                    thead.find("tr:eq(0) > th").each(function (idx, th) {
                        columns.push({
                            th: thead.find("tr > th:nth-child(" + (idx + 1) + ")"),
                            field: angular.element(th).attr("field"),
                            idx: idx,
                            col: {
                                visible: true,
                                width: angular.element(theadColGrp.find("col:eq(" + idx + ")")).css("width")
                            },
                            show: function () {
                                this.th.show();
                                tbody.find("tr > td:nth-child(" + (idx + 1) + ")").show();
                                this.col.visible = true;
                            },
                            hide: function () {
                                this.th.hide();
                                tbody.find("tr > td:nth-child(" + (idx + 1) + ")").hide();
                                this.col.visible = false;
                            }
                        });
                    });

                    var redrawColGroups = function () {
                        theadColGrp.find("col").remove();
                        tbodyColGrp.find("col").remove();
                        var content = "";
                        for (var i = 0; i < columns.length; i++) {
                            if (columns[i].col.visible) {
                                content += "<col style='width:" + columns[i].col.width + "'/>";
                            }
                        }
                        theadColGrp.append(content);
                        tbodyColGrp.append(content);
                    };

                    /**
                     * @typedef Object ColumnHider
                     */
                    return /** @lends ColumnHider.prototype*/ {

                        /**
                         * 隐藏指定列
                         * @param columnName 要隐藏的列名(th上的field属性值)
                         */
                        hide: function (columnName) {
                            var col = _.find(columns, function (obj) {return obj.field == columnName;});
                            if (col) {
                                col.hide();
                            }
                            redrawColGroups();
                        },

                        /**
                         * 显示指定列
                         * @param columnName 要隐藏的列名(th上的field属性值)
                         */
                        show: function (columnName) {
                            var col = _.find(columns, function (obj) {return obj.field == columnName;});
                            if (col) {
                                col.show();
                            }
                            redrawColGroups();
                        }
                    }
                }
            }
        });
})(window, window.angular);