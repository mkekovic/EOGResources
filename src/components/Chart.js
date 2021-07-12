import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';
import '../styles/Chart.css'
import Chip from '../components/Chip';
import Avatar from '@material-ui/core/Avatar';

const format = () => tick => prettyDate2(tick);

function prettyDate2(time) {
  var date = new Date(parseInt(time));
  var localeSpecificTime = date.toLocaleTimeString();
  return localeSpecificTime.replace(/:\d+ /, ' ');
}

const ValueLabel = (props) => {
  const { text } = props;
  return (
    <ValueAxis.Label
      {...props}
      text={`${text} `}
    />
  );
};


export default (props) => (
  <div className="div-alignment">
    <div className="metric">
      <Chip avatar={<Avatar>{props.yLabel}</Avatar>} label={`${props.yLabel === 'PSI' ? 'Pressure' : props.yLabel === 'F' ? 'Farenheight' : 'Percent'}`} />
    </div>
    <Paper>
      <Chart
        data={props.title}
      >
        <ArgumentAxis tickFormat={format} />  
        <ValueAxis max={50} labelComponent={ValueLabel} />

        <LineSeries  valueField="metricValue" argumentField="time" />
      </Chart>
    </Paper>
  </div>
);
