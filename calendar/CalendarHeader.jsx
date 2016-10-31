import React from 'react'

/*interface P {
    prevMonth():void,
    nextMonth():void,
    prevYear():void,
    nextYear():void,
    year:number,
    month:number
}*/

export default class CalendarHeader extends React.Component {
    render() {
        return (
            <div className="head">
                <span title="上一年" className="prev" onClick={this.props.prevYear}>《</span>
                <span title="上一月" className="prev" onClick={this.props.prevMonth}>〈</span>

                <span title="下一年" className="next" onClick={this.props.nextYear}>》</span>
                <span title="下一月" className="next" onClick={this.props.nextMonth}>〉</span>

                <span className="date-info">{this.props.year}年</span><span className="date-info">{this.props.month + 1}月</span>
            </div>
        )
    }
}