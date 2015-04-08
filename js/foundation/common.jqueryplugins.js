(function ($) {

    /**
     * 计算备注字段字符数
     * @param {jQuery|string|HTMLElement} indicator
     * @param {Number=} max
     * @returns {$.fn}
     */
    $.fn.countRemark = function (indicator, max) {
        indicator = $(indicator);

        // 确定最大字符数
        if (max != null) {
            indicator.prop("maxlength", max);
        } else if (indicator.prop("maxlength")) {
            max = indicator.prop("maxlength");
        } else {
            // 默认300
            max = 300;
        }

        /**
         * 更新字符数标识函数
         * @param {Number} count
         */
        var updateIndicator = function (count) {
            if(count == null || count == ''){
                count = 0;
            }
            count = count > max ? max : count;
            indicator.text(count + "/" + max);   //这种方法在IE中字符数到10时会跳动
        };

        // 初始化Indicator
        updateIndicator($(this).text().length || ($(this).val() && $(this).val().length) );

        // 输入
        this.bind("keyup input", function () {
            var remark = $(this).val();
            if (remark.length > max) {
                remark = remark.substring(0, max);
                $(this).val(remark);
                updateIndicator(remark.length);
                return false;
            } else {
                updateIndicator(remark.length);
                return true;
            }
        });

        // 黏贴
        this.bind("change input propertychange", function () {
            var remark = $(this).val();
            updateIndicator(remark.length);
        });

        return this;
    };

})(jQuery);


(function ($) {
    // 回退键
    var BACKSPACE_CODE = 8;
    // 回车键
    var ENTER_CODE = 13;
    //Tab键
    var TAB_CODE = 9;

    /**
     * 添加占位符
     * @returns {*|HTMLElement}
     */
    $.fn.addPlaceHolder = function () {
        var parentObj = $(this).parent();
        var placeHolderValue = $(this).attr("placeHolderValue");
        var placeHolderId = $(this).attr("id") + "PlaceHolder";
        var labelElement = "<label id = '" + placeHolderId + "' class='placeholder'>" + placeHolderValue + "</label>";
        var placeHolderChange = function (e){
            var obj = $(e.target);
            if ((obj.val() === "") && !obj.is(":focus")) {
                $("#" + placeHolderId).show();
            } else {
                $("#" + placeHolderId).hide();
            }
        };
        if (placeHolderValue) {
            if ($("#" + placeHolderId).length === 0) {
                parentObj.append($(labelElement));
                $(this).bind('keydown',placeHolderChange);
                $(this).bind('keyup',placeHolderChange);
                $(this).bind('change',placeHolderChange);
                $(this).bind('focus',function(e){
                    $("#" + placeHolderId).hide();
                });
                $(this).bind('blur',function(e){
                    if($(this).val() === ""){
                        $("#" + placeHolderId).show();
                    }else{
                        $("#" + placeHolderId).hide();
                    }
                });
            }  else {
                $("#" + placeHolderId).show();
            }
        }
        return $("#" + placeHolderId);

    };

    /**
     * 取得占位符对象
     * @returns {*|HTMLElement}
     */
    $.fn.getPlaceHolderObj = function () {
        var placeHolderValue = $(this).attr("placeHolderValue");
        var placeHolderId = $(this).attr("id") + "PlaceHolder";
        if (placeHolderValue) {
            return $("#" + placeHolderId);
        }
        return null;
    };
})(jQuery);

(function ($) {
    /**
     * 限定指定的输入框只能输入小数(包括整数)，保留decimal位小数
     * @param {Number} digit
     * @param {Number} decimal
     * @param {Number} minValue
     */
    $.fn.decimalInput = function (digit, decimal, minValue) {
        if(!digit){
            digit = 10;
        }
        var regStr = '^\\d{0,' + digit + '}(\\.\\d{0,' + decimal + '})?$';
        if(minValue === undefined || minValue < 0){
            regStr = '^[-]?\\d{0,' + digit + '}(\\.\\d{0,' + decimal + '})?$';
        }
        var reg = new RegExp(regStr);

        $(this).css("ime-mode", "disabled");
        this.bind("keypress", function (e) {
            if (e.charCode === 0)
                return true; // 非字符键 for firefox
            var code = (e.keyCode ? e.keyCode : e.which); // 兼容火狐 IE
            if( code == 45) {
                //负数键
                if(minValue === undefined || minValue < 0){
                    //如果未指定最小值 或最小值允许小于0才可以输入负数
                    var pos = getCurPosition(this);//去鼠标所在位置
                    if(pos === 0){
                        //负数仅能出现在第一位
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (code >= 48 && code <= 57) {
                //如果输入的是0-9的数字
                var pos = getCurPosition(this);//去鼠标所在位置
                var selectedText =  getSelectedText(this);//取得选中文本
                var dotPos = this.value.indexOf(".");
                if (dotPos > 0 && pos > dotPos) {
                    if (pos > dotPos + decimal)
                        return false;
                    return selectedText.length > 0 || this.value.substr(dotPos + 1).length < decimal;
                }
                var curValue = this.value;
                var preValue = curValue.substring(0,pos);
                if(pos>0 &&  preValue.indexOf(".") < 0 && Number(preValue) === 0 &&  code === 48){
                    //不允许在你整数位0后输入0
                    return false;
                }
                var afterValue = curValue.substring(pos + selectedText.length,pos.length);
                var newValue =   preValue +   String.fromCharCode(e.keyCode) + afterValue;
                //var newValue = curValue.substring(0,pos) +  String.fromCharCode(e.keyCode) + curValue.substring(pos,pos.length);
                newValue = newValue.replace(selectedText,'');
                if(!isNaN(newValue)){
                    newValue = Number(newValue);
                    if(reg.test(newValue) ){
                        if(minValue !== undefined && parseFloat(newValue) < minValue){
                            return false;
                        }
                        return true;
                    }
                }

            } else if (code == 46 && decimal > 0) {
                // 输入"."
                var selectedText = getSelectedText(this);
                if (selectedText.indexOf(".") > 0 )
                    return true; // 选中文本包含"."
                else if (reg.test(this.value + String.fromCharCode(code)))
                    return true;
            }
            return false;
        });
        this.bind("keydown", function(e){
            this.oldValue = this.value;
        });
        this.bind("keyup",function(e){
            var newValue = this.value.replace(/[^0-9\.\-]/g, "");;
            if(!isNaN(newValue) || newValue === '-'){
                if(newValue === '-'){
                    newValue = 0;
                } else {
                    newValue = Number(newValue);
                }

                if(reg.test(newValue) ){
                    if(minValue !== undefined && parseFloat(newValue) < minValue){
                        if(this.oldValue){
                            this.value = this.oldValue;
                            return false;
                        }
                    }
                    return true;
                } else {
                    this.value = this.oldValue;
                    return false;
                }
            } else {
                this.value = this.oldValue;
                return false;
            }
        });
        this.bind("blur", function () {
            if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
                this.value = this.value.substr(0, this.value.length - 1);
            } else if (isNaN(this.value)) {
                this.value = "";
            }
            if (this.value)
                this.value = parseFloat(this.value).toFixed(decimal);
            $(this).trigger("input");
        });
        this.bind("paste", function (e) {
            var pasterValue = getPasteContext(e);
            if (pasterValue && !isNaN(pasterValue)) {
                var pos = getCurPosition(this);//去鼠标所在位置
                var selectedText = getSelectedText(this);//取得选中文本
                var curValue = this.value;
                var preValue = curValue.substring(0,pos);
                var afterValue = curValue.substring(pos + selectedText.length,pos.length);
                var newValue =   preValue +  pasterValue + afterValue;
                if(!isNaN(newValue)){
                    newValue = Number(newValue);
                    if(reg.test(newValue) ){
                        if(minValue !== undefined && parseFloat(newValue) < minValue){
                            return false;
                        }
                        return true;
                    }      
                }    
            }
            return false;
        });
        this.bind("dragenter", function () {
            return false;
        });        
        this.bind("propertychange", function (e) {           
            if (isNaN(this.value))
                this.value = this.value.replace(/[^0-9\.\-]/g, "");
        });
        this.bind("input", function (e) {           
            if (isNaN(this.value))
                this.value = this.value.replace(/[^0-9\.\-]/g, "");
        });
    };

    /**
     * @param {Event} e
     * @returns {string}
     */
    function getPasteContext(e){
        if (window.clipboardData) {
            //for IE
            return clipboardData.getData('text');           
        } else if(e.originalEvent.clipboardData){
            //for chrome
           return e.originalEvent.clipboardData.getData("Text");         
        }
    }

    /**
     * 获取当前光标在文本框的位置
     * @param {*|jQuery|HTMLInputElement} domObj
     * @returns {number}
     */
    function getCurPosition(domObj) {
        var position = 0;
        if (domObj.selectionStart || domObj.selectionStart == '0') {
            position = domObj.selectionStart;
        } else if (document.selection) { // for IE
            domObj.focus();
            var currentRange = document.selection.createRange();
            var workRange = currentRange.duplicate();
            domObj.select();
            var allRange = document.selection.createRange();
            while (workRange.compareEndPoints("StartToStart", allRange) > 0) {
                workRange.moveStart("character", -1);
                position++;
            }
            currentRange.select();
        }
        return position;
    }

    /**
     * 获取当前文本框选中的文本
     * @param {*|jQuery|HTMLInputElement} domObj
     * @returns {String}
     */
    function getSelectedText(domObj) {
        if (domObj.selectionStart || domObj.selectionStart == '0') {
            return domObj.value.substring(domObj.selectionStart, domObj.selectionEnd);
        } else if (document.selection) { // for IE
            domObj.focus();
            var sel = document.selection.createRange();
            return sel.text;
        } else
            return '';
    }
})(jQuery);

(function ($) {

    /**
     * 过滤掉window禁用字符
     * @param {String} str
     * @returns {string}
     */
    $.filterSpecialChar = function (str) {
        if (str == null || str == "") {
            return str;
        }
        //window文件名不许\/:*?"<>|字符出现,所以禁用
        var pattern = ["\\", "/", ":", "*", "?", "\"", "<", ">", "|"];
        var resule = "";
        for (var i = 0; i < str.length; i++) {
            var ch = str.substr(i, 1);
            if ($.inArray(ch, pattern) < 0) {
                resule = resule + str.substr(i, 1);
            }
        }
        return resule;
    };

    /**
     * 取得键盘的key的文字
     * @param {Event} e
     * @returns {String}
     */
    $.getChar = function (e) {
        /*** Convert to Char Code ***/
        var code = e.which;

        //Ignore Shift Key events & arrows \/:*?"<>|
        if ($.inArray(code, [16, 37, 38, 39, 40, 20, 17, 18, 91]) > -1){
            return null;
        }

        //These are special cases that don't fit the ASCII mapping
        var exceptions = {
            186: 59, // ;
            187: 61, // =
            188: 44, // ,
            189: 45, // -
            190: 46, // .
            191: 47, // /
            192: 96, // `
            219: 91, // [
            220: 92, // \
            221: 93, // ]
            222: 39  // '
        };
        if (typeof exceptions[code] != 'undefined') code = exceptions[code];

        var ch = String.fromCharCode(code);

        /*** Handle Shift ***/
        if (e.shiftKey) {
            var special = {
                1: '!',
                2: '@',
                3: '#',
                4: '$',
                5: '%',
                6: '^',
                7: '&',
                8: '*',
                9: '(',
                0: ')',
                ',': '<',
                '.': '>',
                '/': '?',
                ';': ':',
                "'": '"',
                '[': '{',
                ']': '}',
                '\\': '|',
                '`': '~',
                '-': '_',
                '=': '+'
            };

            if (typeof special[ch] != 'undefined') ch = special[ch];
        }
        else {
            ch = ch.toLowerCase();
        }

        return ch;
    };

    /**
     * 字符串格式化, 把{n}替换成第n个参数
     * @param {String} stringResource 要格式化的字符传
     * @returns {string} 格式化以后的字符串
     */
    $.formatStringRes = function (stringResource) {
        var args = arguments;
        var pattern = new RegExp("{([1-" + arguments.length + "])}", "g");
        return String(stringResource).replace(pattern, function (match, index) {
            return args[index];
        });
    };
})(jQuery);

(function($) {
    /**
     * 获取隐藏元素的尺寸
     * @param {Boolean}includeMargin
     * @returns {{width: number, height: number, innerWidth: number, innerHeight: number, outerWidth: number, outerHeight: number}}
     */
    $.fn.getHiddenDimensions = function(includeMargin) {
        var $item = this,
            props = { position: 'absolute', visibility: 'hidden', display: 'block' },
            dim = { width:0, height:0, innerWidth: 0, innerHeight: 0,outerWidth: 0,outerHeight: 0 },
            $hiddenParents = $item.parents().andSelf().not(':visible'),
            includeMargin = (includeMargin == null)? false : includeMargin;

        var oldProps = [];
        $hiddenParents.each(function() {
            var old = {};
            for ( var name in props ) {
                old[ name ] = this.style[ name ];
                this.style[ name ] = props[ name ];
            }

            oldProps.push(old);
        });

        dim.width = $item.width();
        dim.outerWidth = $item.outerWidth(includeMargin);
        dim.innerWidth = $item.innerWidth();
        dim.height = $item.height();
        dim.innerHeight = $item.innerHeight();
        dim.outerHeight = $item.outerHeight(includeMargin);

        $hiddenParents.each(function(i) {
            var old = oldProps[i];
            for ( var name in props ) {
                this.style[name] = old[name];
            }
        });
        return dim;
    };
}(jQuery));



