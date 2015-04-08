(function(jQuery, angular) {
    angular
            .module("commonServices")
            .directive(
                    "cccDatePicker",
                    function() {
                        return {
                            require : "ngModel",
                            scope : {
                                dateValue : "=ngModel",
                                cccMaxDate : "@"
                            },
                            replace : false,
                            template : '<span class="datepicker defaultDatePicker">\
                                            <\input class="datepickerInput" type="text" ng-model="dateValue" readonly/>\
                                            <span class="datepickerLine"></span>\
                                        </span>',
                            link : function($scope, $element, $attrs, $ctrl) {
                                var maxDate = "%y-%M-%d %H:%m:%s";
                                if ($scope.cccMaxDate == "max") {
                                    maxDate = "9999-12-31 23:59:59";
                                }

                                var onPicking = function(date) {
                                    var date = date.cal.getNewDateStr();
                                    $scope.$apply(function() {
                                        $scope.dateValue = date;
                                    });
                                };
                                var damageDateConfig = {
                                    dateSelector : $element.find('.datepicker'),
                                    maxDate : maxDate,
                                    format : "yyyy-MM-dd",
                                    onpicking : onPicking
                                };
                                DatePicker.initDatePicker(damageDateConfig);
                            }
                        }
                    })
            .directive(
                    "cccDateRange",
                    function() {
                        return {
                            scope : {
                                cccStartDate : "=",
                                cccEndDate : "=",
                                cccMaxDate : "@"
                            },
                            replace : false,
                            template : '<span id="startDatePicker" class="datepicker smallDatePicker startDateInput">\
                                            <input class="datepickerInput" type="text" ng-model="cccStartDate"/>\
                                            <span class="datepickerLine"></span>\
                                        </span>\
                                        <span class="horizontalLineIco"></span>\
                                        <span id="endDatePicker" class="datepicker smallDatePicker endDateInput">\
                                            <input class="datepickerInput" type="text" ng-model="cccEndDate" />\
                                            <span class="datepickerLine"></span>\
                                        </span>',
                            link : function($scope, $element, $attrs, $ctrl) {

                                var onPicking = function(date, e, a) {
                                    var date = date.cal.getNewDateStr();
                                    $scope.$apply(function() {
                                        $scope.cccStartDate = date;
                                    });
                                };

                                var damageDateConfig = {
                                    // onpicking : onPicking,
                                    startDateId : $element.find('.startDateInput'),
                                    endDateId : $element.find('.endDateInput'),
                                    currentDate : Utils.getCurrentTime(),
                                    format : "yyyy-MM-dd",
                                    datePickerParent : $element
                                };
                                DatePicker.initDateRange(damageDateConfig);
                            }
                        }
                    });

    /**
     * @namespace
     */
    var DatePicker = (function($, angular) {
        /**
         * 日期控件弹出层的宽度
         *
         * @type {number} width
         */
        var wdateWidth = 222;
        /**
         * @param {jQuery} target
         * @param {jQuery} targetWindow
         * @returns {{left: *, top: *}}
         * @constructor
         */
        var GetDatePickerPosition = function(target, targetWindow, isEndDate) {
            var windowWidth = $(window).width();//wind窗口的宽度
            var is1440Dpi = windowWidth > 1280 && windowWidth <= 1440;
            var is1680Dpi = windowWidth > 1440;
            var targetWindowWidth = targetWindow.width();//日期控件的input框的父窗口（.inquery）的宽度
            var wdateLeft = target.offset().left;//日期控件的input框的左偏移量
            var wdateRight = windowWidth - wdateLeft;//日期控件的input框的左边距wind窗口右边的距离
            var targetWindowLeft = targetWindow.offset().left;//日期控件的input框的父窗口（.inquery）的左偏移量
            var targetWindowRight = windowWidth - (targetWindowLeft + targetWindowWidth);//日期控件的input框的父窗口（.inquery）距wind窗口右边的距离
            var relativeDistance = wdateRight - targetWindowRight;//日期控件的input框右边与其父窗口（.inquery）的右边的距离
            wdateRight = windowWidth - wdateLeft - target.width();
            var datePickerLeft, datePickerTop, datePickerRight;
            if (relativeDistance > wdateWidth) {//如果日期控件的input框右边与其父窗口右边的距离大于日期控件的宽度时
                if (isEndDate) {
                    datePickerLeft = wdateWidth - target.width() - 3;
                } else {
                    datePickerLeft = Browser.isIE8 ? -1 : "";
                }
                datePickerRight = 0;
            } else {//否则
                datePickerRight = wdateRight - 1;
            }
            if (Browser.isIE7) {
                datePickerTop = 2;
            } else if (Browser.isIE9) {
                datePickerLeft -= 2;
            } else {
                datePickerLeft += 2;
            }
            return {
                left : datePickerLeft,
                top : datePickerTop,
                right : datePickerRight
            };
        };

        /**
         *
         * @param {{startDateId: String=, startMinDate: String=, endDateId: String=, endMaxDate: String=, format: String=, language:String=, datePickerParent: String=, datePickerLeft: Number=, datePickerTop: Number }} config
         * @param {jQuery} obj
         */
        var datePickerPosition = function(config, obj, isEndDate) {
            var datePickerParent = config.datePickerParent;
            if (datePickerParent) {//日期控件向右对齐向左展开需要提供日期控件的父级元素
                var dpPosition = new GetDatePickerPosition($(obj), $(datePickerParent), isEndDate);
                config.datePickerLeft = -dpPosition.left;
                config.datePickerTop = -dpPosition.top;
                config.datePickerRight = dpPosition.right;
            }
        };

        /**
         *
         * @param {{startDateId: String=, startMinDate: String=, endDateId: String=, endMaxDate: String=, format: String=, language:String=}} config
         * @constructor
         */
        var TimeChangeTrigger = function(config) {
            if (config.startDateId) {
                $(config.startDateId).trigger('change');
            }
            if (config.endDateId) {
                $(config.endDateId).trigger('change');
            }
        };

        var closeDatePicker = function() {
            /*$.subscribe(SCROLL_AFTER, function() {
                $dp.hide();
            });*/
        };

        /**
         *
         * @param {{startDateId: String=, startMinDate: String=, endDateId: String=, endMaxDate: String=, format: String=, language:String=, datePickerParent: String=}} config
         */
        var createWdatePicker = function(config) {
            debugger;
            WdatePicker({
                minDate : config.minDate,
                maxDate : config.maxDate,
                dateFmt : config.format,
                onpicked : config.onpicked,
                onpicking : config.onpicking,
                oncleared : config.oncleared,
                position : {
                    'left' : +config.datePickerLeft,
                    'top' : +config.datePickerTop,
                    'right' : +config.datePickerRight
                },
                Hchanged : TimeChangeTrigger(config)
            });
            closeDatePicker();
        };

        /**
         *
         * @param {string} dateId
         * @param {string} defaultDate
         * @returns {string}
         */
        var getDynamicDate = function(dateId, defaultDate) {
            debugger;
            var dynamicDate = "#F{$dp.$D( dateId ) || '" + defaultDate + "'}";
            return dynamicDate;
        };

        /**
         *
         * @param {{startDateId: String=, startMinDate: String=, endDateId: String=, endMaxDate: String=, format: String=, language:String=, datePickerParent: String=}} config
         */
        var instanceStartDate = function(config) {
            $(config.startDateId).click(function() {
                datePickerPosition(config, $(this));
                var startMaxDate = getDynamicDate(config.endDateId, config.currentDate);
                config.minDate = "";
                config.maxDate = startMaxDate;
                createWdatePicker(config);
            });
        };

        /**
         *
         * @param {{startDateId: String=, startMinDate: String=, endDateId: String=, endMaxDate: String=, format: String=, language:String=, datePickerParent: String=}} config
         */
        var instanceEndDate = function(config) {
            $(config.endDateId).click(function() {
                datePickerPosition(config, $(this), true);
                var endMinDate = getDynamicDate(config.startDateId, config.currentDate);
                config.minDate = endMinDate;
                config.maxDate = "";
                createWdatePicker(config);
            });
        };
        return {
            /**
             * 单一日期选择，lang可随用户选择动态配置
             * @param config {{dateSelector : String, minDate : String, maxDate : String, format : String, language : String}}
             * @memberOf DatePicker
             */
            initDatePicker : function(config) {
                $(config.dateSelector).click(function() {
                    datePickerPosition(config, $(this));
                    createWdatePicker(config);
                });
            },

            /**
             * 时间范围， lang可随用户选择动态配置
             * @param config {{startDateId: String=, startMinDate: String=, endDateId: String=, endMaxDate: String=, format: String=, language:String=, datePickerParent: String=}}
             * @memberOf DatePicker
             */
            initDateRange : function(config) {
                instanceStartDate(config);
                instanceEndDate(config);
            }
        };

    })(jQuery);
})(jQuery, angular);