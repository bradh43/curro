import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ACTIVITY_MAP } from './ActivityConstants';
import { subDays } from 'date-fns';

const useStyles = makeStyles({
    table: {
        minWidth: 280,
    },
    tableHeader: {
        fontWeight: "bold"
    }
});

// The backdrop of the table, lets me specify elevation.
function TableSurface(props) {
    return (<Paper elevation={1}>{props.children}</Paper>)
}

// Convenient way to create a data object that'll be fed into a table row
function createData(name, value, unit) {
    return { name, value, unit };
}

function isInDateRange(date, earlierDateBound, laterDateBound) {
    return (earlierDateBound.getTime() <= date.getTime()) && (date.getTime() <= laterDateBound.getTime());
}

function calcNumDaysAgoDuration(numDaysAgo, activityDataMap, displayedActivity) {
    let dataArray = activityDataMap[displayedActivity];
    let rightNow = new Date();
    let earlierBound = subDays(rightNow, numDaysAgo);
    let dataInRange = dataArray.filter(dataObject => {
        return isInDateRange(dataObject.date, earlierBound, rightNow);
    });
    let totalTime_ms = dataInRange.reduce(function (accumulator, dataObject) {
        if (dataObject.duration) {
            return dataObject.duration + accumulator;
        } else {
            return accumulator;
        }
    }, 0);

    return totalTime_ms;
}

function calcNumDaysAgoDistance(numDaysAgo, activityDataMap, displayedActivity) {
    let dataArray = activityDataMap[displayedActivity];
    let rightNow = new Date();
    let earlierBound = subDays(rightNow, numDaysAgo);
    let dataInRange = dataArray.filter(dataObject => {
        return isInDateRange(dataObject.date, earlierBound, rightNow);
    });
    let distanceInMeters = dataInRange.reduce(function (accumulator, dataObject) {
        if (dataObject.distance) {
            return dataObject.distance + accumulator;
        } else {
            // In the case of undefined, add 0
            return accumulator;
        }
    }, 0);

    return distanceInMeters;
}

function calcAllTimeDuration(activityDataMap, displayedActivity) {
    /* activityDataMap is a map of 
        {activityEnum: [
        {
            distance: m,
            duration: ms,
            date: Date object,
            additionalInfo: {}
        }
    ]}                          */

    let dataArray = activityDataMap[displayedActivity];
    let totalTime_ms = dataArray.reduce(function (accumulator, dataObject) {
        if (dataObject.duration) {
            return dataObject.duration + accumulator;
        } else {
            return accumulator;
        }
    }, 0);

    return totalTime_ms;
}

function calcAllTimeDistance(activityDataMap, displayedActivity) {
    let dataArray = activityDataMap[displayedActivity];
    // console.log('dataArray[0].duration :>> ', typeof(dataArray[0].duration));
    let distanceInMeters = dataArray.reduce(function (accumulator, dataObject) {
        if (dataObject.distance) {
            return dataObject.distance + accumulator;
        } else {
            // In the case of undefined, add 0
            return accumulator;
        }
    }, 0);

    return distanceInMeters;
}

function convertDistanceToUnit(distance, inputUnit, outputUnit) {
    outputUnit = outputUnit.toUpperCase();
    switch (inputUnit.toUpperCase()) {
        case "YDS":
            switch (outputUnit) {
                case "MI":
                    return distance / 1760
                case "M":
                    distance = distance * 1000
                case "KM":
                    return distance / 1094
                case "YDS":
                default:
                    return distance
            }
        case "MI":
            switch (outputUnit) {
                case "YDS":
                    return distance * 1760
                case "M":
                    distance = distance * 1000
                case "KM":
                    return distance * 1.60934
                case "MI":
                default:
                    return distance
            }
        case "M":
            distance = distance / 1000
        case "KM":
            switch (outputUnit) {
                case "YDS":
                    return distance * 1094
                case "MI":
                    return distance = distance / 1.60934
                case "M":
                    return distance * 1000
                case "KM":
                default:
                    return distance
            }
        default:
            return distance
    }
}

function formatDistance(distance) {
    return distance.toFixed(1);
}

// Assumes duration is in ms
function formatDuration(duration) {
    let durationInMin = duration / 1000 / 60;
    let numHours = Math.floor(durationInMin / 60);
    let remainingMinutes = Math.floor(durationInMin % 60);

    let displayString = '';
    if (numHours > 0) {
        displayString += `${numHours} hr `
    }
    displayString += `${remainingMinutes} min`

    return displayString;
}

function extractDateRangeRowsFromDate(numDaysAgo, activityDataMap, displayedActivity) {
    let rows = [];
    if (ACTIVITY_MAP[displayedActivity].durationAllowed) {
        let allTimeInMS = calcNumDaysAgoDuration(numDaysAgo, activityDataMap, displayedActivity);
        let durationDisplayString = formatDuration(allTimeInMS);
        rows.push(createData('Duration', durationDisplayString, ''));
    }
    if (ACTIVITY_MAP[displayedActivity].distanceAllowed) {
        // activityDataMap's distance is all in meters. Convert to the default unit.
        let defaultUnit = ACTIVITY_MAP[displayedActivity].defaultUnit;
        let allTimeDistanceInMeters = calcNumDaysAgoDistance(numDaysAgo, activityDataMap, displayedActivity);
        let convertedDistance = convertDistanceToUnit(allTimeDistanceInMeters, 'M', defaultUnit);
        let distanceString = formatDistance(convertedDistance);

        rows.push(createData('Distance', distanceString, defaultUnit));
    }
    return rows;
}

function extractAllTimeRowsFromData(activityDataMap, displayedActivity) {
    let rows = [];
    if (ACTIVITY_MAP[displayedActivity].durationAllowed) {
        let allTimeInMS = calcAllTimeDuration(activityDataMap, displayedActivity);
        let durationDisplayString = formatDuration(allTimeInMS);
        rows.push(createData('Duration', durationDisplayString, ''));
    }
    if (ACTIVITY_MAP[displayedActivity].distanceAllowed) {
        // activityDataMap's distance is all in meters. Convert to the default unit.
        let defaultUnit = ACTIVITY_MAP[displayedActivity].defaultUnit;
        let allTimeDistanceInMeters = calcAllTimeDistance(activityDataMap, displayedActivity);
        let convertedDistance = convertDistanceToUnit(allTimeDistanceInMeters, 'M', defaultUnit);
        let distanceString = formatDistance(convertedDistance);

        rows.push(createData('Distance', distanceString, defaultUnit));
    }
    return rows;
}

export default function SingleActivityTable({ activityDataMap, displayedActivity }) {
    const classes = useStyles();

    function StatSkeleton({ title, rows }) {
        return (
            // <Table className={classes.table} size="small" aria-label="a dense table">
            <>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader}>{title}</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="left">{row.value} {row.unit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {/* </Table> */ }
            </>
            
        )
    }
    // console.log('activityDataMap :>> ', activityDataMap);

    // Last 365 Days Stat Calculations
    let weekRows = extractDateRangeRowsFromDate(7, activityDataMap, displayedActivity);
    let monthRows = extractDateRangeRowsFromDate(30, activityDataMap, displayedActivity);
    let yearRows = extractDateRangeRowsFromDate(365, activityDataMap, displayedActivity);
    let allTimeRows = extractAllTimeRowsFromData(activityDataMap, displayedActivity);

    return (

        <TableContainer component={TableSurface}>

            <Table className={classes.table} size="small" aria-label="a dense table">
                {/* Last Week */}
                <StatSkeleton title={'Past 7 Days'} rows={weekRows} />

                {/* Last Month */}
                <StatSkeleton title={'Past 30 Days'} rows={monthRows} />

                {/* Last Year */}
                <StatSkeleton title={'Past 365 Days'} rows={yearRows} />

                {/* All-Time */}
                <StatSkeleton title={'All-Time'} rows={allTimeRows} />
            </Table>
        </TableContainer>
    );
}
