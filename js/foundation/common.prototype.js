// TODO @deprecated, planned replace with Underscore.js OR high version IE
// Add ECMA262-5 method binding if not supported natively
if (!('bind' in Function.prototype)) {
    /**
     * @param {Object} owner
     */
    Function.prototype.bind = function (owner) {
        var that = this;
        if (arguments.length <= 1) {
            return function () {
                return that.apply(owner, arguments);
            };
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}

// Add ECMA262-5 string trim if not supported natively
if (!('trim' in String.prototype)) {
    /**
     * @return {String}
     */
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

// ECMAScript 6th Edition, JavaScript 1.8.5+
if (!('endsWith' in String.prototype)) {
    /**
     * @param {String} searchString
     * @param {Number} [position]
     * @return {Boolean}
     */
    String.prototype.endsWith = function (searchString, position) {
        position = position || this.length;
        position = position - searchString.length;
        var lastIndex = this.lastIndexOf(searchString);
        return lastIndex !== -1 && lastIndex === position;
    };
}

if(!('replaceAll' in String.prototype)) {
    /**
     * @param {String} s1
     * @param {String} s2
     * @return {String}
     */
    String.prototype.replaceAll  = function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    };
}


if (!('contains' in Array.prototype)) {
    /**
     * @param {String} item
     * @return {Boolean}
     */
    Array.prototype.contains = function (item) {
        return RegExp(item).test(this);
    };
}

if (!('contains' in String.prototype)) {
    /**
     * @param {String} str
     * @param {Number} [startIndex]
     * @return {Boolean}
     */
    String.prototype.contains = function (str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}

// Add ECMA262-5 Array methods if not supported natively
if (!('indexOf' in Array.prototype)) {
    /**
     * @param {String} find
     * @param {Number} [i]
     * @return {Number}
     */
    Array.prototype.indexOf = function (find, i /*opt*/) {
        if (i === undefined) i = 0;
        if (i < 0) i += this.length;
        if (i < 0) i = 0;
        for (var n = this.length; i < n; i++)
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
if (!('lastIndexOf' in Array.prototype)) {
    /**
     * @param {String} find
     * @param {Number} [i]
     * @return {Number}
     */
    Array.prototype.lastIndexOf = function (find, i /*opt*/) {
        if (i === undefined) i = this.length - 1;
        if (i < 0) i += this.length;
        if (i > this.length - 1) i = this.length - 1;
        for (i++; i-- > 0;) /* i++ because from-argument is sadly inclusive */
            if (i in this && this[i] === find)
                return i;
        return -1;
    };
}
if (!('forEach' in Array.prototype)) {
    /**
     * @param {function} action
     * @param {Object} [that] 
     */
    Array.prototype.forEach = function (action, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
}
if (!('map' in Array.prototype)) {
    /**
     * @param {function} mapper
     * @param {Object} [that] 
     * @return {Array}
     */
    Array.prototype.map = function (mapper, that /*opt*/) {
        var other = new Array(this.length);
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this)
                other[i] = mapper.call(that, this[i], i, this);
        return other;
    };
}
if (!('filter' in Array.prototype)) {
    /**
     * @param {function} filter
     * @param {Object} [that]
     * @return {Array}
     */
    Array.prototype.filter = function (filter, that /*opt*/) {
        var other = [], v;
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && filter.call(that, v = this[i], i, this))
                other.push(v);
        return other;
    };
}
if (!('every' in Array.prototype)) {
    /**
     * @param {function} tester
     * @param {Object} [that]
     * @return {Boolean}
     */
    Array.prototype.every = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && !tester.call(that, this[i], i, this))
                return false;
        return true;
    };
}
if (!('some' in Array.prototype)) {
     /**
     * @param {function} tester
     * @param {Object} [that]
     * @return {Boolean}
     */
    Array.prototype.some = function (tester, that /*opt*/) {
        for (var i = 0, n = this.length; i < n; i++)
            if (i in this && tester.call(that, this[i], i, this))
                return true;
        return false;
    };
}

if (!('remove' in Array.prototype)) {
    /**
     * 从Array里删除某个元素
     * @param {Object} s
     */
    Array.prototype.remove = function (s) {
        var len = this.length;
        while (len--) {
            if (s == this[len])
                this.splice(len, 1);
        }
    };
}

if (!('insertAt' in Array.prototype)) {
    /**
     * 将元素插入到Array里指定位置
     * @param {Number} index
     * @param value
     * @returns {Array}
     */
    Array.prototype.insertAt = function(index, value) {
        var part1 = this.slice( 0, index );
        var part2 = this.slice( index );
        part1.push( value );
        return(part1.concat(part2));
    };
}

if (!('removeAt' in Array.prototype)) {
    /**
     * 删除Array里指定位置某个元素
     * @param {Number} index
     * @returns {Array}
     */
    Array.prototype.removeAt = function(index){
        var part1 = this.slice(0, index );
        var part2 = this.slice(index);
        part1.pop();
        return(part1.concat(part2));
    }
}

if(!('format' in Date.prototype)){
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     * @param {String} fmt 
     * @return {String}
     */
    Date.prototype.format = function(fmt){
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };
}

// 保存原始的toFixed函数
Number.prototype._toFixed =  Number.prototype.toFixed;
/**
 * Number的toFixed方法有bug, 3.445 -> 3.44
 * @param {Number} precision
 * @returns {String}
 */
Number.prototype.toFixed = function(precision){
    var numStr = String(Utils.toFixed(this, precision));
    if(precision > 0){
        var zeros;
        // 计算
        if(numStr.indexOf('.') > 0){
            zeros = precision - numStr.split('.')[1].length;
        }else{
            numStr += ".";
            zeros = precision;
        }
        // 后面拼凑0
        for(var i = 0; i < zeros; i++){
            numStr += "0";
        }
    }
    return numStr;
};