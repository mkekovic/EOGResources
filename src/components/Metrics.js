import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/Metrics.css'
// import { actions } from '../reducer';
import { Provider, createClient, useQuery } from 'urql';
import Chip from '../components/Chip';
import Demo from '../components/Chart'
import DropDown from '../components/dropDown'
import MetricCard from '../components/metricCard'

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

let data = [];

const getMetrics = `
query {
    getMetrics 
}
`;

const getMeasurements = `
query($metricData: MeasurementQuery) {
    getMeasurements(input: $metricData) {
        value
        at
  }
}
`;

const getLastMeasurement = `
query($selectedMetric: String!) {
    getLastKnownMeasurement(metricName: $selectedMetric) {
        value
  }
}
`;


const Metrics = () => {
    const [metric, setMetric] = React.useState("oilTemp");
    const changeMetric = (childData) => {
        setMetric(childData)
    }
    let timeNow = new Date()
    const chartBegining = new Date()
    chartBegining.setTime(timeNow.getTime() - 1800000)
    const metricData = {
        metricName: metric, before: timeNow.getTime(), after: chartBegining.getTime()
    };

    const [resultMetrics] = useQuery({
        query: getMetrics
    });
    const [resultMeasurements] = useQuery({
        query: getMeasurements,
        variables: {
            metricData,
        },
    });
    // const resultMeasurementValue = useQuery({
    //     query: getLastMeasurement,
    //     variables: {
    //         selectedMetric,
    //     },
    // });
    data = resultMeasurements.data?.getMeasurements.map(({ at, value }) => {
        let d = new Date(at);
        let rObj = { argument: d, value: value }
        return rObj
    })
    var test = resultMetrics.data?.getMetrics

    return (
        <div>
            <div className="metric-header">
                {metric !== '' ? <MetricCard metric={metric} metricValue={resultMeasurements.data?.getMeasurements[resultMeasurements.data?.getMeasurements.length - 1].value} /> : null}
                <DropDown list={test || []} parentCallback={changeMetric} />
            </div>

            {metric !== '' ? <Demo title={data || []} /> : null}

        </div >
    )
};


export default () => {
    return (
        <Provider value={client}>
            <Metrics />
        </Provider>
    );
};


