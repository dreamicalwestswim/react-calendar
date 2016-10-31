import React from 'react'



/*interface P {
    viewData:number[][],
    datePick(e):void,
    prevMonth():void,
    nextMonth():void,
    month:number,
    day:number
}*/

/**
 * 获取每一年每一月的日历天数，每一月显示42个数，包含了上个月当前月下个月的日期
 */
const displayDaysPerMonth = (year)=> {

    //定义每个月的天数，如果是闰年第二月改为29天
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //4年一闰，100年不闰，400年一闰。
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
    }

    //以下为了获取一年中每一个月在日历选择器上显示的数据，
    //从上个月开始，接着是当月，最后是下个月开头的几天

    //定义一个数组，保存上一个月的天数
    let daysInPreviousMonth = [].concat(daysInMonth);
    daysInPreviousMonth.unshift(daysInPreviousMonth.pop());

    //获取每一个月显示数据中需要补足上个月的天数
    let addDaysFromPreMonth = new Array(12).fill(null).map((item, index)=> {
        //获得每一月的1号是星期几0-6
        let day = new Date(year, index, 1).getDay();
        //0是周日,等于0的时候需要返回6
        if (day === 0) {
            return 6
        } else {
            //其他递减1按照0-6对应周1-日的顺序
            return day - 1
        }
    });

    //已数组形式返回一年中每个月的显示数据,每个数据为6行*7天
    return new Array(12).fill([]).map((month, monthIndex)=> {
        //上月需要补多少天
        let addDays = addDaysFromPreMonth[monthIndex],
            //当月的天数
            daysCount = daysInMonth[monthIndex],
            //上个月的天数
            daysCountPrevious = daysInPreviousMonth[monthIndex],
            //日历显示的数
            monthData = [];

        //补足上一个月
        for (; addDays > 0; addDays--) {
            monthData.unshift(daysCountPrevious--)
        }
        //添入当前月
        for (let i = 0; i < daysCount;) {
            monthData.push(++i)
        }
        //补足下一个月
        for (let i = 42 - monthData.length, j = 0; j < i;) {
            monthData.push(++j)
        }
        return monthData
    })
};


export default class CalendarMain extends React.Component {

    //处理日期选择事件
    handleDatePick(index, styleName) {
        if(styleName === 'disabled')return;
        switch (styleName) {
            case 'prevMonth':
                this.props.prevMonth();
                break
            case 'nextMonth':
                this.props.nextMonth();
                break
        }
        let month = displayDaysPerMonth(this.props.year)[this.props.month];
        this.props.datePick(month[index]);
    }

    //处理日期超出范围禁用
    disabledDate(current) {

        let value = this.props.value;
        value = value&&value.split("-");
        const date = value?new Date(value[0],value[1]-1,value[2]):new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        //毫秒数转成天数
        var calendarDay = parseInt(current.getTime()/1000/60/60/24);
        var nowDay = parseInt(date.getTime()/1000/60/60/24);

        return this.props.frontDay && calendarDay+(Number.isFinite(this.props.frontDay)?this.props.frontDay:0)<nowDay || this.props.laterDay && calendarDay - (Number.isFinite(this.props.laterDay)?this.props.laterDay-1:0)>nowDay;
    }

    render() {
        //确定当前月数据中每一天所属的月份，以此赋予不同className
        let month = displayDaysPerMonth(this.props.year)[this.props.month],
            rowsInMonth = [],
            i = 0,
            styleOfDays = (()=> {
                //当前月1号索引
                let i = month.indexOf(1),
                    //下一月1号索引
                    j = month.lastIndexOf(1),
                    arr = new Array(42);
                //设置上一月、下一月、当前天的className
                arr.fill('prevMonth', 0, i);
                //arr.fill('thisMonth', i, j);
                arr.fill('nextMonth', j);

                //选中的某天class,只有在选中年月和日历年月相等的情况下才添加某天class
                if(this.props.year === this.props.selectedYear && this.props.month === this.props.selectedMonth)
                {
                    let today = month.indexOf(parseFloat(this.props.day),i);
                    arr.fill('today', today,today+1);
                }

                //把日历每月的42天传入禁用方法去计算是否需要禁用
                if(this.props.frontDay||this.props.laterDay){

                    for(let k = 0;k<42;k++){

                        let tempYear = this.props.year;
                        let tempMonth = this.props.month;
                        if(k<i)tempMonth = this.props.month - 1;
                        else if(k>=j)tempMonth = this.props.month + 1;

                        if(tempMonth === 12)
                        {
                            tempMonth = 0;
                            tempYear = this.props.year + 1;
                        }
                        else if(tempMonth < 0)
                        {
                            tempMonth = 11;
                            tempYear = this.props.year - 1;
                        }

                        //禁用日期
                        if(this.disabledDate(new Date(tempYear,tempMonth,month[k])))arr[k] = 'disabled';
                    }
                }

                return arr
            })();

        //把每一个月的显示数据以7天为一组等分
        month.forEach((day, index)=> {
            if (index % 7 === 0) {
                rowsInMonth.push(month.slice(index, index + 7));
            }
        });

        return (
            <table className="main">
                <thead>
                <tr>
                    <th>一</th>
                    <th>二</th>
                    <th>三</th>
                    <th>四</th>
                    <th>五</th>
                    <th>六</th>
                    <th>日</th>
                </tr>
                </thead>
                <tbody>
                {
                    rowsInMonth.map((row, rowIndex)=> {
                        return (
                            <tr key={rowIndex}>
                                {
                                    row.map((day)=> {
                                        return (
                                            <td className={styleOfDays[i]}
                                                onClick={this.handleDatePick.bind(this, i, styleOfDays[i])}
                                                key={i++}>
                                                <span>{day}</span>
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        )
    }
}