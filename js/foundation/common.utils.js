/**
 * 一些通用方法的Module
 * @namespace Utils
 */
var Utils = (function ($) {

    /**
     * 其它允许的键盘key
     * @param {Number} key
     * @returns {boolean}
     */
    var isOtherAllowKey = function (key) {
        // Backspace(回格) || 回车 || 左 || 右 || delete || 大小写切换键 || shift
        return key === 8 || key == 13 || key == 37 || key == 39 || key == 46 || key == 20 || key == 16;
    };

    /**
     * 如果是键盘小数
     * @param {Number} key
     * @returns {boolean}
     */
    var isNumberKeyCode = function (key) {
        return (key >= 96 && key <= 105) || (key >= 48 && key <= 57); // 键盘右边数字区 || 键盘字母区域上方数字
    };

    /**
     * 如果是键盘输入字母，除去3个字母：I O Q
     * @param {Number} key
     * @returns {boolean}
     */
    var isEnglishLetter = function (key) {
        // 如果是输入了字母：I O Q
        if (key === 73 || key === 79 || key === 81) {
            return false;
        }
        return key >= 65 && key <= 90;
    };

    return {
        /**
         * 手动刷新时，记录当前选中页面
         * @param {String} controlId
         * @memberOf Utils
         */
        setLocationHash: function (controlId) {
            window.location.hash = controlId;
            document.cookie = "hash=" + controlId.replace(",", "+");

            // bug #13961
            setTimeout(function () {
                $(window).scrollTop();
            }, 0);
        },

        /**
         * 手动刷新时，记录当前选中页面
         * @returns {string}
         * @memberOf Utils
         */
        getLocationHash: function () {
            return window.location.hash;
        },
        /**
         * 取消画面上的文字选择, 一般用于在双击时把选择的文字取消掉
         * @memberOf Utils
         */
        unselectedText: function () {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        },

        /**
         * A 乘以 B 返回结果 fractionalDigits:保留几位小数
         * @param a {String|Number} 一个数字
         * @param b {String|Number} 另外一个数字
         * @param fractionalDigits {Number} 几位小数
         * @returns {Number} 结果
         * @memberOf Utils
         */
        multiply: function (a, b, fractionalDigits) {
            if (!a) {
                a = 0;
            } else {
                a = parseFloat(a + "");
            }

            if (!b) {
                b = 0;
            } else {
                b = parseFloat(b + "");
            }
            return parseFloat((Number(a * b)).toFixed(fractionalDigits));
        },

        /**
         * 功能: 函数节流避免程序频繁被调用，只有被调用的时间间隔大于延迟时间时函数才会被执行。
         * 参数: 传递一个执行函数和时间间隔
         * @param {Function} fn
         * @param {Number} delay
         * @returns {Function}
         * @memberOf Utils
         */
        throttle: function (fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },

        /**
         * 心跳函数：
         * 这个函数返回一个函数，当这个函数被频繁调用时，就会心跳，否则停止心跳。
         * @param func {function()} 心跳函数
         * @param interval {Number} 心跳时间
         * @returns {function()}
         * @memberOf Utils
         */
        heartbeat: function (func, interval) {
            var lastAliveTime = (new Date()).getTime();
            setInterval(function () {
                if ((new Date()).getTime() - lastAliveTime < interval) {
                    func();
                }
            }, interval);
            return function () {
                lastAliveTime = (new Date()).getTime();
            };
        },
        /**
         * 页面刷新/离开提示
         * @param {Function=} validateChangeFun
         * @memberOf Utils
         */
        addLeavePageConfirm: function (validateChangeFun) {
            var title = document.title;
            $(window).bind("beforeunload", function () {
                document.title = title;
                if (validateChangeFun && typeof(validateChangeFun) == "function" && !validateChangeFun()) {//无修改
                    return undefined;
                }
                return "";
            });
        },

        /**
         * 页面刷新/离开提示
         * @memberOf Utils
         */
        removeLeavePageConfirm: function () {
            $(window).unbind("beforeunload");
        },

        /**
         * 同步ajax调用
         * @param {{}} param
         * @param {String} url
         * @param {String=} type
         * @param {Boolean=} async
         * @returns {ConfigUnit}
         * @memberOf Utils
         */
        loadAjaxData: function (param, url, type, async) {
            var returnData = null;
            $.ajax({
                url: url,
                data: param,
                type: type || "POST",
                async: async || false,
                success: function (data) {
                    returnData = data;
                }
            });
            return returnData;
        },

        /**
         * url加时间戳
         * @param {String} url
         * @memberOf Utils
         * @returns {string}
         */
        addTimeStamp4URL: function (url) {
            var timstamp = (new Date()).valueOf();
            url = url + "?timstamp=" + timstamp;
            return url;
        },

        /**
         * 功能：金额按千位逗号分割，返回格式化后的数值字符串.
         * @param {Number|String} s, 需要格式化的金额数值.
         * @param {Number|String} type, 判断格式化后的金额是否需要小数位.
         * @returns {String}
         * @memberOf Utils
         */
        formatMoney: function (s, type) {
            if (!s && "0" != s) return "";
            if (/^[+\-][^0-9\.]/.test(s)) return "0.00";
            if (s == null || s == "") return "0.00";
            s = s.toString().replace(/^(\d*)$/, "$1.");
            s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
            s = s.replace(".", ",");
            var re = /(\d)(\d{3},)/;
            while (re.test(s))
                s = s.replace(re, "$1,$2");
            s = s.replace(/,(\d\d)$/, ".$1");
            if (type == 0) {// 不带小数位(默认是有小数位)
                var a = s.split(".");
                if (a[1] == "00") {
                    s = a[0];
                }
            }
            return s;
        },

        /**
         * 将数值四舍五入后格式化(千分位), 返回格式的字符串,如'1,234,567.00'
         * @memberOf Utils
         * @param {Number|String} num
         * @param {Number} maxCent 要保留的最大小数位数
         * @param {Number} minCent 要保留的最小小数位数
         * @param {Number} isThousand 是否需要千分位 0:不需要,1:需要(数值类型)
         * @returns {string}
         */
        formatNumberForThousand: function (num, maxCent, minCent, isThousand) {
            num = (num + "").replace(/[ ]/g, "");
            if (num === 'null' || num === "") {
                return "";
            }
            var signVal = num; // 用来判断正负号
            num = Math.abs(num);// 去掉合法数字前的0，如‘0098’转为‘98’
            num = num.toString().replace(/\$|\,/g, '');
            //检查传入数值为数值类型.
            if (isNaN(num)) {
                num = "0";
            }
            //确保传入小数位为数值型数值.
            if (isNaN(maxCent)) {
                maxCent = 0;
            }
            if (isNaN(minCent)) {
                minCent = 0;
            }
            //求出小数位数,确保为正整数.
            maxCent = parseInt(maxCent);
            maxCent = Math.abs(maxCent);
            minCent = parseInt(minCent);
            minCent = Math.abs(minCent);

            //确保传入是否需要千分位为数值类型.
            if (isNaN(isThousand)) {
                isThousand = 0;
            }
            isThousand = parseInt(isThousand);
            if (isThousand < 0) {
                isThousand = 0;
            }
            if (isThousand >= 1) {//确保传入的数值只为0或1
                isThousand = 1;
            }

            var cent = 0;// 前台显示的数据的小数的位数(minCent~maxCent)
            var decimalPart = '0'; // 整数部分数据
            var integerPart = '0'; // 小数部分数据
            var valueStr = num.toString();
            var index = valueStr.indexOf(".");
            if (index == -1) {
                cent = minCent;
                integerPart = valueStr;
            } else {
                decimalPart = valueStr.substring(index + 1, valueStr.length);
                var decimalLen = decimalPart.length;
                if (decimalLen <= minCent) {
                    cent = minCent;
                } else if (decimalLen >= maxCent) {
                    cent = maxCent;
                } else {
                    cent = decimalLen;
                }
                //Math.floor:返回小于等于其数值参数的最大整数
                integerPart = Math.floor(num * Math.pow(10, cent) + 0.50000000001);//把指定的小数位先转换成整数.多余的小数位四舍五入.
                decimalPart = integerPart % Math.pow(10, cent); //求出小数位数值.
                integerPart = Math.floor(integerPart / Math.pow(10, cent)).toString();//求出整数位数值.
                decimalPart = decimalPart.toString();//把小数位转换成字符串,以便求小数位长度.
            }

            while (decimalPart.length < cent) {//补足小数位到指定的位数.
                decimalPart = "0" + decimalPart;
            }

            var sign = (signVal == (signVal = Math.abs(signVal)));//获取符号(正/负数)
            if (isThousand == 0) { //不需要千分位符.
                return (((sign) ? '' : '-') + integerPart + '.' + decimalPart);
            } else {//对整数部分进行千分位格式化.
                var reg = /(-?\d+)(\d{3})/;
                while (reg.test(integerPart)) {
                    integerPart = integerPart.replace(reg, "$1,$2");
                }
                return (((sign) ? '' : '-') + integerPart + '.' + decimalPart);
            }
        },

        /**
         * 如果指定项目不存在与数组则添加进去,如果存在,则替换成最新的值
         * @param {Array} array
         * @param {Object} item 项目
         * @param {Function=} comparator 比较器
         * @memberOf Utils
         */
        pushIfNotExist: function (array, item, comparator) {
            var exists = false;
            for (var i = 0, len = array.length; i < len; i++) {
                var obj = array[i];
                if (comparator && comparator.apply({}, [obj, item]) || obj === item) {
                    exists = true;
                    // 存在,替换成最新的值
                    array[i] = item;
                    break;
                }
            }
            // 不存在,则添加
            if (!exists) {
                array.push(item);
            }

            return !exists;
        },

        /**
         * 移除制定项目或者方法的数据
         * @param {Array} array 数组
         * @param item {Object|Function},项目
         * @return {Array} 已经删除的数组对象
         * @memberOf Utils
         */
        remove: function (array, item) {
            // 存放删除的对象
            var removeList = [];
            if (array == null || array.length <= 0) {
                return removeList;
            }

            var len = array.length;
            while (len--) {
                var obj = array[len];
                if (typeof item === "function" && item.apply(obj, [obj]) || item === obj) {
                    array.splice(len, 1);
                    // push删除的对象.
                    removeList.push(obj);
                }
            }
            return removeList;
        },

        /**
         * 判断value值是否超过n个字节
         * @param {String} value 传入值
         * @param {Number} n 字节数
         * @return {Boolean} value值是否超过n个字节
         * @memberOf Utils
         */
        characterWidthCheck: function (value, n) {
            var length = 0;
            for (var i = 0; i < value.length; i++) {
                var c = value.charCodeAt(i);
                // 单字节加1, 双字节加2
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                    length++;
                } else {
                    length += 2;
                }
            }
            return length > n;

        },
        /**
         * 获取str的前n个字节的值
         * @param {String} str 传入值
         * @param {Number} n 字节数
         * @return {String}
         * @memberOf Utils
         */
        getDifiniteValue: function (str, n) {
            return str.replace(/([\u0391-\uffe5])/ig, '$1a').substring(0, n).replace(/([\u0391-\uffe5])a/ig, '$1');
        },

        /**
         * add by Losyn 2013-09-18
         * 半角转换为全角函数，全角空格为12288，半角空格为32 其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248
         * @memberOf Utils
         * @param {String} txtString
         * @returns {string}
         */
        toDBC: function (txtString) {
            var tmp = "";
            for (var i = 0; i < txtString.length; i++) {
                if (txtString.charCodeAt(i) == 32) {
                    tmp = tmp + String.fromCharCode(12288);
                }
                if (txtString.charCodeAt(i) < 127) {
                    tmp = tmp + String.fromCharCode(txtString.charCodeAt(i) + 65248);
                }
            }
            return tmp;
        },

        /**
         * 全角转换为半角函数
         * @memberOf Utils
         * @param {String} str
         * @returns {string}
         */
        toCDB: function (str) {
            var tmp = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                    tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
                } else {
                    tmp += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return tmp;
        },

        /**
         * 兼容性文本选择范围的方法
         * @param {HTMLElement} html 元素
         * @param {Number} position 文本选择结束的位置
         * @memberOf Utils
         */
        caret: function (element, position) {
            var range, isPosition = position !== undefined;
            if (element.selectionStart !== undefined) {
                if (isPosition) {
                    element.focus();
                    element.setSelectionRange(0, position);
                }
            } else if (document.selection) {
                if ($(element).is(":visible")) {
                    element.focus();
                }
                range = document.selection.createRange();
                if (isPosition) {
                    range.move("character", position);
                    range.select();
                }
            }
        },
        /**
         * val为null时返回默认值
         * @param {Object} val
         * @param {Object} defaultVal 默认值
         * @memberOf Utils
         */
        defaultValue: function (val, defaultVal) {
            return val == null ? defaultVal : val;
        },
        /**
         * 获取对象中属性的值, 例：getFieldValueByPath(CLAIMMODEL, "referenceInfo.accidentInfo.reporter")
         * @param {Object} obj
         * @param {String} fieldPath 属性路径，如"referenceInfo.accidentInfo.reporter"
         * @memberOf Utils
         */
        getFieldValueByPath: function (obj, fieldPath) {
            var subFieldPaths = fieldPath.split(".");
            var fieldValue = obj;
            for (var i = 0; i < subFieldPaths.length; i++) {
                fieldValue = fieldValue[subFieldPaths[i]];
                if (fieldValue == null) {
                    return null;
                }
            }
            return fieldValue;
        },

        /**
         * 深度clone
         * @param {Object} obj 要克隆的对象
         * @memberOf Utils
         */
        deepClone: function (obj) {
            return (obj instanceof Array) ? $.extend(true, [], obj) : $.extend(true, {}, obj);
        },

        /**
         * 校验身份证，驾驶证
         * @param {String} idCard
         * @returns {Boolean}
         * @memberOf Utils
         */
        testID: function (idCard) {
            var Errors = ["TRUE", "RES_1039", "RES_2178", "RES_2178", "RES_2178", "RES_2178"];
            var area = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
                21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
                33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
                41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西",
                46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南",
                54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏",
                65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"};
            var Y, JYM;
            var S, M;
            var ereg;
            var idcard_array = idCard.split("");
            switch (idCard.length) {
                case 15:
                    ereg = /^[0-9]{15}$/;
                    if (!ereg.test(idCard)) {
                        return Errors[5];
                    }
                    if (area[parseInt(idCard.substr(0, 2))] == null) return Errors[4];

                    if ((parseInt(idCard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idCard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idCard.substr(6, 2)) + 1900) % 4 == 0 )) {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                    }
                    else {
                        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                    }
                    if (ereg.test(idCard))
                        return Errors[0];
                    else
                        return Errors[2];
                    break;
                case 18:
                    ereg = /^[0-9]{17}[0-9X]$/;
                    if (!ereg.test(idCard)) {
                        return Errors[5];
                    }
                    if (area[parseInt(idCard.substr(0, 2))] == null) return Errors[4];
                    if (parseInt(idCard.substr(6, 4)) % 4 == 0 || ( parseInt(idCard.substr(6, 4)) % 100 == 0 && parseInt(idCard.substr(6, 4)) % 4 == 0 )) {
                        ereg = /^[1-9][0-9]{5}[1-2][0-9]{3}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                    }
                    else {
                        ereg = /^[1-9][0-9]{5}[1-2][0-9]{3}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                    }
                    if (ereg.test(idCard)) {
                        S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                        Y = S % 11;
                        M = "F";
                        JYM = "10X98765432";
                        M = JYM.substr(Y, 1);
                        if (M == idcard_array[17])
                            return Errors[0];
                        else
                            return Errors[3];
                    }
                    else
                        return Errors[2];
                    break;
                default:
                    return Errors[1];
                    break;
            }
        },

        /**
         * 取得文件名的前面部分
         * @param {String} filename
         * @memberOf Utils
         */
        getMainFileName: function (filename) {
            var pos = filename.lastIndexOf(".");
            if (pos < 0 || pos == filename.length) {
                return filename;
            } else {
                return filename.substring(0, pos);
            }
        },

        /**
         * 取得文件名的后面部分
         * @param {String} filename
         * @memberOf Utils
         */
        getExtFileName: function (filename) {
            var pos = filename.lastIndexOf(".");
            if (pos < 0 || pos == filename.length) {
                return "";
            } else {
                return filename.substring(pos + 1);
            }
        },

        /**
         * @memberOf Utils
         * @param {HTMLElement|String|jQuery} $selectors
         * @return {string}
         */
        getGroupValueByUI: function ($selectors) {
            var groupValue = [];
            $($selectors).each(function () {
                $(this).prop("checked") ? groupValue.push($(this).val()) : null;
            });
            return groupValue.toString();
        },

        /**
         * 取得形如yy-MM-dd hh:mm:ss 日期的年月日
         * @param {String} obj
         * @return {string}
         * @memberOf Utils
         */
        getFormatDate: function (obj) {
            if (obj == '') {
                return '';
            }
            else if (typeof obj == 'date') {
                return kendo.toString(obj, "yyyy-MM-dd");
            }
            else if (typeof obj == 'string') {
                return kendo.toString(StringToDate(obj), "yyyy-MM-dd");
            }
            else {
                return '';
            }
        },
        /**
         *  取得形如yy-MM-dd hh:mm:ss 日期的时分秒
         * @param {String} obj
         * @returns {string}
         * @memberOf Utils
         */
        getFormatTime: function (obj) {
            if (obj == '') {
                return '';
            }
            else if (typeof obj == 'date') {
                return kendo.toString(obj, "HH:mm:ss");
            }
            else if (typeof obj == 'string') {
                return kendo.toString(StringToDate(obj), "HH:mm:ss");
            }
            else {
                return '';
            }
        },

        /**
         *  对定损单状态进行加工，去掉‘转送’字样
         * @param {String} obj
         * @returns {String}
         */
        getStatus: function (obj) {
           if (obj == '') {
               return '';
           } else if (typeof obj == 'string') {
                 if (obj.indexOf('(') < 0) {
                     return obj;
                 } else {
                     return obj.substr(0, obj.indexOf('('));
                 }
           } else {
              return '';
           }
        },

        /**
         *  对定损单状态进行加工，去掉‘转送’字样
         * @param {String} obj
         * @returns {String}
         */
        getSuffix: function (obj) {
            if (obj == '') {
                return '';
            } else if (typeof obj == 'string') {
                if (obj.indexOf('(') < 0) {
                    return '';
                } else {
                    return obj.substr(obj.indexOf('('), obj.length);
                }
            } else {
                return '';
            }
        },

        /**
         * 获取当前时间yy-MM-dd hh:mm:ss 日期的时分秒
         * @returns {string}
         * @memberOf Utils
         */
        getCurrentTime: function () {
            var date = new Date();
            var month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            return  date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        },
        
        
        getDaysDiffAbs :function(date1,date2){
        	if(!date1 || !date2){
        		return 0;
        	}else{
        		return Math.abs((date1.getTime()-date2.getTime())/(24*60*60*1000));
        	}
        },

        /**
         * VIN码是否正确判断 1. VIN码是否只包含除I、O、Q之外的大写字母和数字； 2. VIN码是否满足17位；
         * @param {String} vinCode
         * @memberOf Utils
         */
        checkVinCodeIsRight: function (vinCode) {
            return !(vinCode == null || vinCode.length < 17);
        },

        /**
         * VIN码是否非法校验，VIN的第九位字码（即VDS部分的第六位）为检验位
         * @param {String} vinCode
         * @returns {boolean}
         */
        checkVinCodeValid: function (vinCode) {
            // 车辆识别代号中的数字和字母对应值
            var vds = new Map();
            // 0 1 2 3 4 5 6 7 8 9
            // 0 1 2 3 4 5 6 7 8 9
            vds.put("0", 0);
            vds.put("1", 1);
            vds.put("2", 2);
            vds.put("3", 3);
            vds.put("4", 4);
            vds.put("5", 5);
            vds.put("6", 6);
            vds.put("7", 7);
            vds.put("8", 8);
            vds.put("9", 9);

            // A B C D E F G H J K L M N P R S T U V W X Y Z
            // 1 2 3 4 5 6 7 8 1 2 3 4 5 7 9 2 3 4 5 6 7 8 9
            vds.put("A", 1);
            vds.put("B", 2);
            vds.put("C", 3);
            vds.put("D", 4);
            vds.put("E", 5);
            vds.put("F", 6);
            vds.put("G", 7);
            vds.put("H", 8);
            vds.put("J", 1);
            vds.put("K", 2);
            vds.put("L", 3);
            vds.put("M", 4);
            vds.put("N", 5);
            vds.put("P", 7);
            vds.put("R", 9);
            vds.put("S", 2);
            vds.put("T", 3);
            vds.put("U", 4);
            vds.put("V", 5);
            vds.put("W", 6);
            vds.put("X", 7);
            vds.put("Y", 8);
            vds.put("Z", 9);
            // 车辆识别代号中的每一位指定一个加权系数
            // 1 2 3 4 5 6 7 8  9 10 11 12 13 14 15 16 17
            // 8 7 6 5 4 3 2 10 * 9  8  7  6  5  4  3  2
            var wfData = [ 8, 7, 6, 5, 4, 3, 2, 10, "*", 9, 8, 7, 6, 5, 4, 3, 2 ];
            var vdsWfSum = 0;
            for (var i = 0; i < wfData.length; i++) {
                if (i != 8) {
                    var indexChar = vinCode.charAt(i);
                    var indexVDS = vds.get(indexChar);
                    vdsWfSum = vdsWfSum + (indexVDS * wfData[i]);
                }
            }
            var index9Char = vinCode.charAt(8);
            var checkBit = vdsWfSum % 11;
            if (checkBit == 10) {
                if (index9Char != "X") {
                    return false;
                }
            } else if (checkBit != index9Char) {
                return false;
            }
            return true;
        },

        /**
         * 返回VIN码基本校验后的值
         * @param {HTMLElement|String|jQuery} obj
         * @returns {string}
         */
        getVinCodeCheckedValue: function (obj) {
            var reg = /[^A-Ha-hJ-Nj-nPpR-Zr-z0-9]/g;
            return $(obj).val().replace(reg, "").toUpperCase();
        },

        /**
         * VIN码按键处理
         * @param {jQuery} $vinInputField
         */
        pressValidKeyAsVin: function ($vinInputField) {
            var key;
            if (document.all) {
                key = window.event.keyCode;
            } else {
                key = window.event.which;
            }
            if (!(key && (isNumberKeyCode(key) || isEnglishLetter(key) || isOtherAllowKey(key)))) {
                window.event.returnValue = false;
                // 如果是中文输入法状态
                if (key === 229) {
                    $vinInputField.val(this.getVinCodeCheckedValue($vinInputField));
                }
            }
        },
        /**
         * 模仿出2列的表格使内容垂直居中,并且每列都拥有同样的高度
         * @param {Array} elements
         * @param {Number} columns
         */
        simulateTable: function (elements, columns) {
            var $elements = elements;
            var temp = [];
            //构造出[[{},{}],[{},{}]] 的二维数组
            for (var x = 0; x < $elements.length; x++) {
                var childArray = [];
                for (var y = 0; y < columns; y++) {
                    if (!$elements[x + x + y]) {
                        continue;
                    }
                    childArray.push([$elements[x + x + y]]);
                }
                temp.push(childArray);
            }

            //循环数组取到最大高度并赋值
            $.each(temp, function (n, data) {
                var tempCopy = [];
                for (var y = 0; y < columns; y++) {
                    var dataH = data[y] ? $(data[y]).height() : 0;
                    tempCopy.push(dataH);
                }
                for (var y = 0; y < columns; y++) {
                    $(data[y]).height(tempCopy.sort()[columns - 1]);
                }
            });
        },

        /**
         * 是否值Deferred对象
         * @param {Deferred} obj
         */
        isDeferred: function (obj) {
            return obj && obj.promise && typeof obj.promise == "function";
        },

        /**
         * 处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
         * @param {Event} e
         * @returns {boolean}
         */
        forbidBackSpace: function (e) {
            var ev = e || window.event; //获取event对象   
            var obj = ev.target || ev.srcElement; //获取事件源   
            var t = obj.type || obj.getAttribute('type'); //获取事件源类型   
            //获取作为判断条件的事件类型   
            var vReadOnly = obj.readOnly;
            var vDisabled = obj.disabled;
            //处理undefined值情况   
            vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
            vDisabled = (vDisabled == undefined) ? true : vDisabled;
            //当敲Backspace键时，事件源类型为密码或单行、多行文本的，   
            //并且readOnly属性为true或disabled属性为true的，则退格键失效   
            var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
            //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效   
            var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
            //判断   
            if (flag2 || flag1) return false;
        },

        /**
         * Number的toFixed方法有bug, 3.445 -> 3.45
         * @param {Number} number
         * @param {Number} precision
         * @returns {number}
         */
        toFixed: function (number, precision) {
            var multiplier = Math.pow(10, precision),
                wholeNumber = Math.round(number * multiplier);
            return wholeNumber / multiplier;
        }
    };
})(jQuery);


//=============================================================================
//StopWatch, 用于性能调优
//=============================================================================
var StopWatch = (function () {
    var records = [];

    return {
        start: function () {
            records.push(new Date().getTime());
        },

        /**
         * @param {String} flag
         * @returns {number}
         */
        stop: function (flag) {
            if (records.length == 0) {
                return 0;
            }
            flag = flag || "duration";
            var end = new Date().getTime();
            var start = records.pop();
            var duration = end - start;
            alert(flag + ":" + (end - start) + "ms");
            return duration;
        }
    };
})();

/**
 * 比较日期，返回相差的天数, sDate1和sDate2是2002-12-18格式
 * @param {String} sDate1
 * @param {STring} sDate2
 * @returns {number}
 */
function dateDiff(sDate1, sDate2) {
    var d1 = StringToDate(sDate1);
    var d2 = StringToDate(sDate2);
    var str1 = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
    var str2 = d2.getFullYear() + "-" + (d2.getMonth() + 1) + "-" + d2.getDate();
    d1 = StringToDate(str1);
    d2 = StringToDate(str2);
    //把相差的毫秒数转换为天数
    return (d2 - d1) / (1000 * 60 * 60 * 24);
}

//=============================================================================
//Browser, 判断浏览器版本
//=============================================================================

var Browser = {};
try {
    (function () {
        var flash = "";
        if (navigator && navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash']
            && navigator.mimeTypes['application/x-shockwave-flash'].description) {
            flash = navigator.mimeTypes['application/x-shockwave-flash'].description.toLowerCase();
        }
        var idSeed = 0,
            ua = navigator.userAgent.toLowerCase(),
            check = function (r) {
                return r.test(ua);
            },
            DOC = document,
            isStrict = DOC.compatMode == "CSS1Compat",
            isOpera = check(/opera/),
            isChrome = check(/\bchrome\b/) && flash.indexOf('shockwave') > -1,
            isChrome360 = check(/\bchrome\b/) && flash.indexOf('adobe') > -1,
            isWebKit = check(/webkit/),
            isSafari = !isChrome && check(/safari/),
            isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
            isSafari3 = isSafari && check(/version\/3/),
            isSafari4 = isSafari && check(/version\/4/),
            isIE = !isOpera && check(/msie/),
            isIE7 = isIE && check(/msie 7/),
            isIE8 = isIE && check(/msie 8/),
            isIE9 = isIE && check(/msie 9/),
            isIE10 = isIE && check(/msie 10/),
            isIE11 = isIE && check(/msie 11/),
            isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
            isGecko = !isWebKit && check(/gecko/),
            isGecko2 = isGecko && check(/rv:1\.8/),
            isGecko3 = isGecko && check(/rv:1\.9/),
            isBorderBox = isIE && !isStrict,
            isWindows = check(/windows|win32/),
            isMac = check(/macintosh|mac os x/),
            isAir = check(/adobeair/),
            isLinux = check(/linux/),
            isIpad = check(/ipad/),
            isSecure = /^https/i.test(window.location.protocol);
        $.extend(Browser, {
            isOpera: isOpera,
            isIE: isIE,
            isIE6: isIE6,
            isIE7: isIE7,
            isIE8: isIE8,
            isIE9: isIE9,
            isIE10: isIE10,
            isIE11: isIE11,
            isFirefox: isGecko,
            isSafari: isSafari,
            isChrome: isChrome,
            isChrome360: isChrome360,
            isIpad: isIpad,
            isScroll: function () {
                return !!($(window).height() < ($(document).height() - 4));
            }
        });
    })();
} catch (e) {
    alert("init Browser false...");
}

/**
 * @param {HTMLElement|String} gridId
 * @param {String} clientId
 * @param {String} fieldName
 */
function setGridCellEditByClientId(gridId, clientId, fieldName) {
    var grd = $(gridId).data("kendoGrid");
    if (grd) {
        var data = grd.dataSource.data();
        if (data.length > 0) {
            var dataItem = data.filter(function (o, index) {
                return o.clientId === clientId;
            });
            if (dataItem.length > 0) {
                var uid = dataItem[0].uid;
                var cell = grd.tbody.find(">tr[data-uid='" + uid + "'] >td[columnfield='" + fieldName + "']");
                if (!cell.hasClass("gridCellEdit")) {
                    cell.addClass("gridCellEdit");
                }
                grd.editCell(cell);
            }
        }
    }
}

/**
 * @param {HTMLElement|String} gridId
 */
function clearGridCellEdit(gridId) {
    var grd = $(gridId).data("kendoGrid");
    if (grd) {
        var cell = grd.tbody.find("td.gridCellEdit");
        cell.removeClass("gridCellEdit");
    }

}

//验证身份证号并获取籍贯
function getProvinceNameByIdNo(idcard) {
     var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
         21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
         33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北",
       43: "湖南", 44: "广东", 45: "广西",
       46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西",
        62: "甘肃", 63: "青海", 64: "宁夏",
        65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    };
    var provinceName = "";
     var provinceNo = idcard.substr(0, 2);
     if (area[parseInt(provinceNo)] != null) {
        provinceName = area[parseInt(provinceNo)];
    }
    return provinceName;
}

/**
 * 字符转日期 ,可转化 yyyy-MM-dd hh:mm:ss格式
 * @param {String} DateStr
 * @returns {Date}
 * @constructor
 */
function StringToDate(DateStr) {
    if (typeof DateStr == "undefined")
        return new Date(0);
    if (typeof DateStr == "date")
        return DateStr;
    var converted = Date.parse(DateStr);
    var myDate = new Date(converted);
    if (isNaN(myDate)) {
        DateStr = DateStr.replace(/:/g, "-");
        DateStr = DateStr.replace(" ", "-");
        DateStr = DateStr.replace(".", "-");
        DateStr = DateStr.replace("T", "-");
        var arys = DateStr.split('-');
        switch (arys.length) {
            case 7:
                myDate = new Date(arys[0], --arys[1], arys[2], arys[3], arys[4], arys[5], arys[6]);
                break;
            case 6:
                myDate = new Date(arys[0], --arys[1], arys[2], arys[3], arys[4], arys[5]);
                break;
            default:
                myDate = new Date(arys[0], --arys[1], arys[2]);
                break;
        }
    }
    return myDate;
}


function MultiSelect(selectIdObject) {
    /*
     change事件触发的时候，通过 preLiCount 与当前 li个数比较来判断执行的操作是"删除"，还是"选择"
     执行"选择操作"的时候，需要判断当前最多能显示的li的个数,把不能显示的li隐藏
     执行"删除操作"的时候，判断当前有没有隐藏的列,如果没有直接删除，如果有需要进行宽度判断确定显示几个li
     */
    var required = selectIdObject.data("kendoMultiSelect");
    var $multiselectWrap = selectIdObject.siblings(".k-multiselect-wrap");
    var wrapWidth = $multiselectWrap.width() - 40;  //wrapWidth表示ul内部li最大宽
    var preLiCount = 0; //preLiCount 表示 选择之前 li 个数

    required.bind("change", multiselectChange);
    required.bind("select", multiselectSelect);

    function multiselectChange() {
        var liCount = $multiselectWrap.find("li.k-button").length;

        if (preLiCount < liCount) {//表示当前为添加状态
            hideLi(calculateWidth());
        } else if (preLiCount >= liCount) {// 表示当前为删除状态
            showLi(calculateWidth());
        }
    }

    function multiselectSelect() {
        preLiCount = $multiselectWrap.find("li.k-button").length;
    }

    //计算select时列表的总宽度
    function calculateWidth() {
        var totalWidth = 0;
        $multiselectWrap.find(".k-reset li.k-button").each(function () {
            totalWidth += $(this).width();
        });
        return totalWidth;
    }

    //超出宽度隐藏列
    function hideLi(width) {
        var flag = width > wrapWidth ? true : false;
        var $li = $multiselectWrap.find("li.k-button");
        var last = $multiselectWrap.find("li.k-button:last");
        if (flag) { //如果溢出，隐藏前面的列
            var lastIndex = last.index();
            var commonWidth = 0; //定义能让li正常显示的li宽度和

            //从最后一列开始计算宽度，获取临界li的索引
            for (var i = lastIndex; i >= 0; i--) {
                commonWidth += $li.eq(i).width();
                if (commonWidth > wrapWidth) {
                    $li.slice(0, i + 1).addClass("k-multiselect-li-hide").hide();
                    break;
                }
            }
        }
    }

    //显示列操作
    function showLi(width) {
        var flag = width > wrapWidth ? true : false;
        var $li = $multiselectWrap.find("li.k-button");
        var last = $multiselectWrap.find("li.k-button:last");

        if (flag) {
            var $liHide = $multiselectWrap.find("li.k-multiselect-li-hide");
            if ($liHide.length > 0) {
                var lastIndex = last.index();
                var commonWidth = 0; //定义能让li正常显示的li宽度和
                //从最后一列开始计算宽度，获取临界li的索引
                for (var i = lastIndex; i >= 0; i--) {
                    commonWidth += $li.eq(i).width();
                    if (commonWidth > wrapWidth && i > 0) {
                        $li.slice(i + 1, lastIndex + 1).removeClass("k-multiselect-li-hide").show();
                        break;
                    } else if (i === 0) {
                        $li.slice(0, lastIndex).removeClass("k-multiselect-li-hide").show();
                    }
                }
            }
        } else {
            $li.removeClass("k-multiselect-li-hide").show();
        }
    }
}
