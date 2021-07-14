import React from 'react';
import '../styles/Metrics.css'
import { Provider, createClient, useQuery, useSubscription } from 'urql';
import Demo from '../components/Chart'
import DropDown from '../components/dropDown'
import MetricCard from '../components/metricCard'


const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

let chartData = [];

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
        unit
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

const GET_SUB = `
subscription  {
    newMeasurement {
        value
        metric
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
            metricData
        },
    });

    const [resSub] = useSubscription({ query: GET_SUB });
    // const handleSubscription = (messages = [], response) => {
    //     return [response.newMessages, ...messages];
    //   };

    // const Messages = () => {
    //     const [res] = useSubscription({ query: GET_SUB }, handleSubscription);
    //     console.log('-------------',res)

    //     if (!res.data) {
    //       return <p>No new messages </p>;
    //     }

    //     return (
    //       <ul>
    //         {res.data.map(message => (
    //           <p key={message.id}>
    //             {message.from}: "{message.text}"
    //           </p>
    //         ))}
    //       </ul>
    //     );
    // };

    chartData = resultMeasurements.data?.getMeasurements.map(({ at, value }) => {
        let d = new Date(at);
        let rObj = { time: d, metricValue: value, metric2Value: 100 }
        return rObj
    })
    const yLabel = resultMeasurements.data?.getMeasurements[0].unit
    const ddlData = resultMetrics.data?.getMetrics
    const lastMetricValue = resultMeasurements.data?.getMeasurements[resultMeasurements.data?.getMeasurements.length - 1].value


    const RenderScreen = () => {
        return (
            <div>
                <div className="metric-header">
                    {metric !== '' ? <MetricCard metric={metric} metricValue={lastMetricValue} /> : null}
                </div>
                <div className="chartBox">
                    {metric !== '' ? <Demo title={chartData || []} yLabel={yLabel} /> : null}
                </div>
            </div >
        )
    }


    return (
        <div>
            <div style={{ "justify-content": "space-between", width: "80%", margin: "auto" }}>
                <div>
                    <div style={{position: "absolute", right: "10%"}} >
                        <DropDown list={ddlData || []} parentCallback={changeMetric} />
                    </div>
                    <RenderScreen />

                </div>
            </div>
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


