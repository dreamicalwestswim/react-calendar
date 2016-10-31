/**
 * Created by guojie on 2016/8/15.
 * name Loading
 */
import * as React from 'react';
import ClassNames from 'classnames';

import './style/component.less'

import CalendarHeader from './calendar/CalendarHeader.jsx';
import CalendarMain from './calendar/CalendarMain.jsx';

function zeroFront(v) {
    let zero = '';
    if(v<10)zero = '0';
    return zero + v;
}

export default class Calendar extends React.Component {

    constructor(props) {
        super(props);
        let defaultValue = this.props.value||this.props.defaultValue;
        defaultValue = defaultValue&&defaultValue.split("-");

        let now = defaultValue?new Date(defaultValue[0],defaultValue[1]-1,defaultValue[2]):new Date(),
            year = now.getFullYear(),
            month = now.getMonth(),
            day = now.getDate();

        this.state = {
            year: year,
            month: month,
            day: day,
            selectedYear:year,
            selectedMonth:month
        }
    }

    /**
     * 收到新的 props value的时候调用
     */
    componentWillReceiveProps(nextProps) {
        let nextValue = nextProps.value;
        if(this.props.value !== nextValue){
            let values = nextValue.split("-"),
                year = values[0],
                month = values[1]-1,
                day = values[2];

            this.setState({
                year: year,
                month: month,
                day: day,
                selectedYear:year,
                selectedMonth:month
            });
        }
    }

    //切换到下一个月
    nextMonth() {

        if (this.state.month === 11) {
            this.setState({
                year: ++this.state.year,
                month: 0
            })
        } else {
            this.setState({
                month: ++this.state.month
            })
        }
    }
    //切换到上一个月
    prevMonth() {
        if (this.state.month === 0) {
            this.setState({
                year: --this.state.year,
                month: 11
            })
        } else {
            this.setState({
                month: --this.state.month
            })
        }
    }

    //切换到下一年
    nextYear() {
        this.setState({
            year: ++this.state.year
        })
    }
    //切换到上一年
    prevYear() {
        this.setState({
            year: --this.state.year
        })
    }


    //选择日期
    datePick(day) {
        this.setState({
            day
        },function () {
            //等日期设置完后再设置选中年月、因为state数据有生命周期，并不会马上发生改变，为了保证正确所以在回调里面设置。
            this.setState({
                selectedYear:this.state.year,
                selectedMonth:this.state.month
            },function () {
                this.props.onSelect && this.props.onSelect(this.getValue());
                this.hidePicker();
            });

        });
    }

    //显示选择器
    showPicker(){
        this.setState({pickerVisible:true,calendarZIndex:9999});
    }

    //隐藏选择器
    hidePicker(){
        if(this.clickPicker){
            //点击选择器让input聚焦，为了自动监听input失焦隐藏选择器
            setTimeout(()=>{
                this.refs.datePicked.focus();
            },0);
            //记录点击选择器设为false,方便下一次记录
            this.clickPicker = false;
        }
        else this.setState({pickerVisible:false,calendarZIndex:null});
    }

    /**
     * 给外部提供一个获取value字符的方法
     */
    getValue(){
        return `${this.state.selectedYear}-${zeroFront(this.state.selectedMonth + 1)}-${zeroFront(this.state.day)}`;
    }

    render() {
        const {prefixCls,className,disabled,frontDay,laterDay,value,defaultValue} = this.props;

        const classes = ClassNames({
            [prefixCls]:true,
            [className]: className
        });

        return (
            <div className={classes} style={{zIndex:this.state.calendarZIndex}}>
                <input disabled={disabled?"disabled":false} readOnly="readOnly"  tabIndex="-1" className="datePicked" ref="datePicked" onBlur={()=>{this.hidePicker()}} onClick={()=>{if(!disabled)this.showPicker();}} value={this.getValue()}/>

                <section className="picker" style={{height:this.state.pickerVisible?300:0}} onMouseDown={()=>{this.clickPicker = true;}}>

                    <CalendarHeader
                        prevMonth={()=>{this.prevMonth()}}
                        nextMonth={()=>{this.nextMonth()}}
                        prevYear={()=>{this.prevYear()}}
                        nextYear={()=>{this.nextYear()}}
                        year={this.state.year}
                        month={this.state.month}/>

                    <CalendarMain
                        prevMonth={()=>{this.prevMonth()}}
                        nextMonth={()=>{this.nextMonth()}}
                        datePick={(e)=>{this.datePick(e)}}
                        year={this.state.year}
                        month={this.state.month}
                        day={this.state.day}
                        selectedYear={this.state.selectedYear}
                        selectedMonth={this.state.selectedMonth}
                        frontDay={frontDay}
                        laterDay={laterDay}
                        value={value||defaultValue}
                    />

                </section>

            </div>
        )
    }
}

Calendar.defaultProps = {
    prefixCls:"u-calendar",
}

/**
 * props类型
 */
Calendar.propTypes = {
    disabled:React.PropTypes.bool,
    onSelect:React.PropTypes.func,
    defaultValue:React.PropTypes.string,
    value:React.PropTypes.string,
    laterDay:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.bool]),
    frontDay:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.bool]),
    className:React.PropTypes.string
}