import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/Metrics.css'
// import { actions } from '../reducer';
import { Provider, createClient, useQuery, useSubscription } from 'urql';
import Chip from '../components/Chip';
import Demo from '../components/Chart'
import DropDown from '../components/dropDown'
import MetricCard from '../components/metricCard'
import Button from '@material-ui/core/Button';


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
    console.log('----->', resSub)
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

    // const NewMetricValueNotification = () => {
    //     const { data, error, loading } = useSubscription({query: GET_SUB});
    //     // 
    //     console.log("--------->",data)
    //     // if (loading) {
    //     //     return <div> Loading.... </div>;
    //     // }
    //     // if (error) {
    //     //     return <div> Error.... {error.message} </div>;
    //     // }
    //     // return (
    //     //     <div>
    //     //         <h1>New Metric Update! </h1>
    //     //     </div>
    //     // )
    // }

    // console.log(resultSub)
    // const resultMeasurementValue = useQuery({
    //     query: getLastMeasurement,
    //     variables: {
    //         selectedMetric,
    //     },
    // });    <div>----{Messages()}</div>
    chartData = resultMeasurements.data?.getMeasurements.map(({ at, value }) => {
        let d = new Date(at);
        let rObj = { argument: d, value: value }
        return rObj
    })
    const yLabel = resultMeasurements.data?.getMeasurements[0].unit
    var ddlData = resultMetrics.data?.getMetrics

    return (
        <div>
            <div className="metric-header">
                {metric !== '' ? <MetricCard metric={metric} metricValue={resultMeasurements.data?.getMeasurements[resultMeasurements.data?.getMeasurements.length - 1].value} /> : null}
                <DropDown list={ddlData || []} parentCallback={changeMetric} />
            </div>
           

            
            {metric !== '' ? <Demo title={chartData || []}  yLabel={yLabel}/> : null}

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


