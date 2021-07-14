import React from 'react';
import '../styles/Metrics.css'
import { Provider, createClient, useQuery } from 'urql';
import Demo from '../components/Chart'
import DropDown from '../components/dropDown'
import MetricCard from '../components/metricCard'


const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

// empty array to hold the data for the chart
let chartData = [];

// GraphQL queries
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

// const getLastMeasurement = `
// query($selectedMetric: String!) {
//     getLastKnownMeasurement(metricName: $selectedMetric) {
//         value
//   }
// }
// `;

// const GET_SUB = `
// subscription  {
//     newMeasurement {
//         value
//         metric
//   }
// }
// `;



const Metrics = () => {
    const [metric, setMetric] = React.useState("oilTemp");

    // callback function to modify the current metric
    const changeMetric = (childData) => {
        setMetric(childData)
    }

    // Instantiating interva; for past 30 minutes
    let timeNow = new Date()
    const chartBegining = new Date()
    chartBegining.setTime(timeNow.getTime() - 1800000)

    // Object holding the querying parameters for getMeasurements query
    const metricData = {
        metricName: metric, before: timeNow.getTime(), after: chartBegining.getTime()
    };

    // Fetching the data on page load
    const [resultMetrics] = useQuery({
        query: getMetrics
    });
    const [resultMeasurements] = useQuery({
        query: getMeasurements,
        variables: {
            metricData
        },
    });

    // TODO: implement useSubscription
    // const [resSub] = useSubscription({ query: GET_SUB });
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

    // Formatting the cahrt data to be readable by the chart component
    chartData = resultMeasurements.data?.getMeasurements.map(({ at, value }) => {
        let d = new Date(at);
        let rObj = { time: d, metricValue: value, metric2Value: 100 }
        return rObj
    })

    // Labeling the y axis
    const yLabel = resultMeasurements.data?.getMeasurements[0].unit

    // Fetched data from all the metrics in the backend
    const ddlData = resultMetrics.data?.getMetrics

    // Last value for the selected metric
    const lastMetricValue = resultMeasurements.data?.getMeasurements[resultMeasurements.data?.getMeasurements.length - 1].value

    // rendering the chart and the metric card
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
            <div style={{ width: "80%", margin: "auto" }}>
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


