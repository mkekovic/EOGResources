import * as React from 'react';
import '../styles/Metrics.css'
import '../styles/MetricCard.css'

export default function DropDown(props) {
    return (
        <div className="metric-item" >
            <div className="metric-item-text" >{props.metric} </div>
            <div className="metric-item-text" style={{"color":"#fc7b03", "font-size": "2.5rem"}}>{props.metricValue}</div>
            <p></p>
        </div>
    )
};




