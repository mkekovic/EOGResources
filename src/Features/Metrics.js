import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/Metrics.css'
// import { actions } from '../reducer';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '../components/Chip';
import Demo from '../components/Chart'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

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


const Metrics = () => {
    const [age, setAge] = React.useState('');
    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));
    const classes = useStyles();
    let timeNow = new Date()
    const chartBegining = new Date()
    chartBegining.setTime(timeNow.getTime() - 1800000)
    const metricData = {
        metricName: "tubingPressure", before: + new Date(), after: chartBegining.getTime()//1625960306380
    };

    const handleChange = (event) => {
        setAge(event.target.value);
    };


    // const [resultMetrics] = useQuery({
    //     query: getMetrics
    // });
    const [resultMeasurements] = useQuery({
        query: getMeasurements,
        variables: {
            metricData,
        },
    });
    // const newData = resultMeasurements.data?.getMeasurements.map(({ value, at }) => ({ value: value, argument: at }))

    data = resultMeasurements.data?.getMeasurements.map(({ at, value }) => {
        let d = new Date(at); 
        let rObj = { argument: d, value: value }
        return rObj
    })
    // return <Chip label={`Allowed Metrics ${resultMeasurements.data?.getMeasurements[0].metric}`} />;
    return (
        <div>
            <p>Allowed Metrics {resultMeasurements.data?.getMeasurements[resultMeasurements.data?.getMeasurements.length - 1].value} </p>
            <div className="metric-item" >asdasd</div>
            <Demo title={data || []} />
            // selection from material-ui
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
};


export default () => {
    return (
        <Provider value={client}>
            <Metrics />
        </Provider>
    );
};


