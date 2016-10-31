# react-calendar

在运行react-calendar之前需要先配置好webpack+react+es6环境

参数说明

    disabled:禁用选择器 布尔值类型 默认false
    onSelect:选择一个日期回调 func类型 返回值string类型 格式范例1970-1-1
    defaultValue:初始日期 初始化只会设置一次 格式范例1970-1-1
    value:当前日期 会被异步设置 格式范例1970-1-1
    laterDay:禁用后面几天以后的日期 numer类型 不能为0
    frontDay:禁用前面几天以前的日期 numer类型 不能为0
    className:新增的class名字 string类型

使用
```js
import Calendar from 'Calendar.jsx';
<Calendar />
```

##ie浏览器兼容tips

由于是es6编写的组件，里面某些新api ie浏览器不支持，需要做一个老浏览器填充。

```js
/**
 * 填充Number对象
 */
if(Number.MAX_SAFE_INTEGER === undefined)Number.MAX_SAFE_INTEGER=9007199254740991;
if(Number.MIN_SAFE_INTEGER === undefined)Number.MIN_SAFE_INTEGER=-Number.MAX_SAFE_INTEGER;

/*-----------是否为可用数字----------*/
Number.isFinite = Number.isFinite || function(value) {
        return typeof value === "number" && isFinite(value);
    }
/*-----------是否为NaN----------*/
Number.isNaN = Number.isNaN || function(value) {
        return typeof value === "number" && isNaN(value);
    }
/*-----------是否为安全整数，就是计算精确范围之内的整数----------*/
Number.isSafeInteger = Number.isSafeInteger || function (value) {
        return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
    };
/*-----------是否为整数----------*/
Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
            isFinite(value) &&
            Math.floor(value) === value;
    };

Number.parseFloat = parseFloat;

Number.parseInt = parseInt;


/*-----------数组填充fill----------*/
if (!Array.prototype.fill) {
    Array.prototype.fill = function(value) {

        // Steps 1-2.
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        var O = Object(this);

        // Steps 3-5.
        var len = O.length >>> 0;

        // Steps 6-7.
        var start = arguments[1];
        var relativeStart = start >> 0;

        // Step 8.
        var k = relativeStart < 0 ?
            Math.max(len + relativeStart, 0) :
            Math.min(relativeStart, len);

        // Steps 9-10.
        var end = arguments[2];
        var relativeEnd = end === undefined ?
            len : end >> 0;

        // Step 11.
        var final = relativeEnd < 0 ?
            Math.max(len + relativeEnd, 0) :
            Math.min(relativeEnd, len);

        // Step 12.
        while (k < final) {
            O[k] = value;
            k++;
        }

        // Step 13.
        return O;
    };
}
```
