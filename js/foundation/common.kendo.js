/**
 * kendo的通用扩展或定制化
 * @namespace KendoUtils
 */
KendoUtils = (function ($) {
    return {
        /**
         * 设置kendoGrid的数据操作标识
         * @memberOf KendoUtils
         * @param {kendo.ui.Grid} kendoGridObj
         */
        getKendoGridItemEdited: function (kendoGridObj) {
            var itemsObj = [];
            var editedItems = kendoGridObj.dataSource.getGridChanged();
            var allUpdataItemsList = [];
            var gridDelete = editedItems.deleteArr;//0:delete
            var gridUpdate = editedItems.updateArr;//1:update
            var gridAdd = editedItems.addArr;//2:add
            $(gridDelete).each(function () {
                this.editedFlag = GRID_ITEM_STATUS.GRID_DELETE;
                allUpdataItemsList.push(this);
            });
            $(gridUpdate).each(function () {
                this.editedFlag = GRID_ITEM_STATUS.GRID_UPDATE;
                allUpdataItemsList.push(this);
            });
            $(gridAdd).each(function () {
                this.editedFlag = GRID_ITEM_STATUS.GRID_ADD;
                allUpdataItemsList.push(this);
            });

            //1.添加所有的dataSource数据
            itemsObj = kendoGridObj.dataSource.data().toJSON();
            //3.重新设置model中数据的更新标志位
            for (var i = 0; i < itemsObj.length; i++) {
                for (var j = 0; j < allUpdataItemsList.length; j++) {
                    if (itemsObj[i].clientId == allUpdataItemsList[j].clientId) {
                        itemsObj[i] = allUpdataItemsList[j];
                    }
                }
            }
            return itemsObj.concat(gridDelete);
        },

        /**
         * 设置kendo dropdownlist的值
         * @memberOf KendoUtils
         * @param {String} elementId
         * @param {Object} value
         */
        setKendoDropdownlistValue: function (elementId, value) {
            var $dropdownlist = $("#" + elementId);
            var dropdownlist = $dropdownlist.data("kendoDropDownList");
            if (dropdownlist) {
                dropdownlist.value(value);
            } else {
                $dropdownlist.val(value);
            }
        },


        /**
         * 设置kendo 数字控件的值
         * @memberOf KendoUtils
         * @param {String} elementId
         * @param {Number|String} value
         */
        setKendoNumricTextValue: function (elementId, value) {
            var $numerictextbox = $("#" + elementId);
            var numerictextbox = $numerictextbox.data("kendoNumericTextBox");
            if (numerictextbox) {
                numerictextbox.value(value);
            } else {
                $numerictextbox.val(value);
            }
        },

        /**
         * 设置kendo dropdownlist的有效性
         * @memberOf KendoUtils
         * @param {String} elementId
         * @param {Boolean} enable
         */
        setKendoDropdownListEnable: function (elementId, enable) {
            var $dropdownlist = $("#" + elementId);
            var dropdownlist = $dropdownlist.data("kendoDropDownList");
            if (dropdownlist) {
                dropdownlist.enable(enable);
            } else {
                $dropdownlist.attr("disabled", "disabled");
            }
        },

        /**
         * 设置kendo 数字控件的有效性
         * @memberOf KendoUtils
         * @param {String} elementId
         * @param {Boolean} enable
         */
        setKendoNumericTextBoxEnable: function (elementId, enable) {
            var $numerictextbox = $("#" + elementId);
            var numerictextbox = $numerictextbox.data("kendoNumericTextBox");
            if (numerictextbox) {
                numerictextbox.enable(enable);
            } else {
                $numerictextbox.attr("disabled", "disabled");
            }
        },

        /**
         * 设置只读元素的tooltip
         * @memberOf KendoUtils
         * @param {String} parentContainerId
         */
        showElementTooltips: function (parentContainerId) {
            var $container;
            if (parentContainerId.indexOf("#") == 0) {
                $container = $(parentContainerId);
            } else {
                $container = $("#" + parentContainerId);
            }
            //只读文本框
            $container.find(".k-textbox.disabled,.datepickerInput[disabled],.k-formatted-value[disabled]").each(function (index, item) {
                item.title = item.value;
            });
            //只读文本框
            $container.find(" input[type='text'].disabled").each(function (index, item) {
                item.title = item.value;
            });
            //只读文本域
            $container.find("textarea[disabled]").each(function (index, item) {
                item.title = item.value;
            });
            //下拉框-加载显示(k-input类型)
            $container.find(".k-dropdown-wrap").each(function (index, item) {
                item.title = $(item).find(".k-input").html();
            });
            //树状结构-加载显示(k-in类型)
            $container.find(".k-in").each(function (index, item) {
                item.title = $(item).html();
            });
            //下拉框-加载显示(k-select类型)
            $container.find(".k-dropdown-wrap.k-state-disabled[tabindex='-1']").each(function (index, item) {
                var selectVal = $(item).find(".k-select[tabindex='-1']").text();
                if (selectVal === 'select') {
                    item.title = "请选择";
                }
            });
        },

        /**
         * 显示ToolTips
         * @memberOf KendoUtils
         */
        showSelectedElementTooltips: function () {
            var item = $(this).parent().find(".k-dropdown-wrap");
            item.attr("title", item.find(".k-input").html());
        },

        /**
         * 构建DropDownList
         * @memberOf KendoUtils
         * @param {HTMLElement|String} id
         * @param {String} textField
         * @param {String} valueField
         * @param {String} placeholder
         * @param {Boolean} disabled
         * @param {Boolean} autoBind
         * @param {Array|kendo.data.DataSource} dataSource
         * @returns {*}
         */
        initDropDownList: function (id, textField, valueField, placeholder, disabled, autoBind, dataSource) {
            return $(id).kendoDropDownList({
                autoBind: autoBind,// 是否自动绑定数据
                optionLabel: placeholder,
                dataTextField: textField,// select option text的key值，对应dataSource
                dataValueField: valueField,// select option value的key值，对应dataSource
                enable: disabled,// 是否可用
                height: 190,
                dataSource: dataSource
            }).data("kendoDropDownList");
        },
        /**
         * 构建DropDownList
         * @memberOf KendoUtils
         * @param {{id: HTMLElement|String, format: String, decimals: Number|String, min: Number, max: Number, step: Number, change: Function}} config
         * @returns {kendo.ui.NumericTextBox}
         */
        initNumericTextBox: function (config) {
            return $(config.id).kendoNumericTextBox({
                format   : config.format,
                decimals : config.decimals,
                min      :  config.min,
				max	: config.max,
				step: config.step,
                change: config.change
            }).data("kendoNumericTextBox");
        },
        /**
         * 解码html
         * @memberOf KendoUtils
         * @param {Object} value
         * @returns {string}
         */
        htmlDecode: function(value){
            var ampRegExp = /(&amp;)/g, ltRegExp = /(&lt;)/g, gtRegExp = /(&gt;)/g, quotRegExp = /(&quot;)/g;
            return ("" + value).replace(ampRegExp, "&").replace(ltRegExp, "<").replace(gtRegExp, ">").replace(quotRegExp, "\"");
        },

        /**
         * 单击分组行直接展开或收缩内容
         * @memberOf KendoUtils
         * @param {kendo.ui.Grid} kendoGrid
         */
        singleClickToExpand : function(kendoGrid){
        	kendoGrid.element.on("click", "tbody>tr[class='k-grouping-row']", function(e) {
                $(this).find(".k-reset a.k-icon").click();
            });
        }

    };
})(jQuery);
