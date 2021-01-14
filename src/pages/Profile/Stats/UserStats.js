// Sole data source of stats
import { gql, useQuery } from '@apollo/client';
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import SingleActivityStats from './SingleActivityStats';
import { useEffect } from 'react';
import { ACTIVITY_MAP } from './ActivityConstants';
import { startOfDay } from 'date-fns';
import CumulativeBarChart from './CumulativeBarChart';
import SingleBarChart from './SingleBarChart';


// Not the time for pagination. I need access to all posts they've ever made. Move this stuff to calendar though.
const ACTIVITY_STATS_DATA = gql`
    fragment ActivityStats on Activity {
        id
        type
        duration
        distance {
            value
            unit
        }
        additionalInfo {
            averageHeartRate
            elevationGain
            calories
        }
    }
`;

const POST_STATS_DATA = gql`
    ${ACTIVITY_STATS_DATA}
    fragment PostStats on Post {
        __typename
        id
        title
        author {
            first
        }
        postDate
        activityList {
            ...ActivityStats
        }
    }
`;

// const GET_POSTLIST_BY_DATE_RANGE = gql`
//     ${POST_STATS_DATA}
//     query postListByDateRange($numDaysToGrab: Int, $after: String, $leadingDateISOString: String) {
//         postListByDateRange(numDaysToGrab: $numDaysToGrab, after: $after, leadingDateISOString: $leadingDateISOString) {
//             cursor
//             hasMore
//             leadingDateISOString
//             posts{
//                 ...PostStats
//             }
//         }
//     } 
// `;


const GET_POSTLIST_STATS_DATA_BY_ID = gql`
    ${POST_STATS_DATA}
    query postListByUserId($userId: ID!) {
        postListByUserId(userId: $userId){
            ...PostStats
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    card: {
        margin: 16,
    },
    cardContent: {
        paddingTop: 0
    }
}));

const UserStats = ({ userid }) => {
    const classes = useStyles();
    const BasicLayout = (props) => {
        return (
            <Card className={classes.card}>
                <CardHeader title={props.title} />
                <CardContent className={classes.cardContent}>
                    {props.children}
                </CardContent>
            </Card>
        )
    }

    const { data, loading, error } = useQuery(GET_POSTLIST_STATS_DATA_BY_ID, {
        variables: { userId: userid }
    });

    const [activityDataMap, setActivityDataMap] = useState(null);

    // Process data into a map after fetching it
    useEffect(() => {
        if (!loading && !error && data) {
            function distanceObjectToMeters(distanceObject) {
                // Null case, return 0
                if (distanceObject === null) {
                    return 0;
                }
                let value = distanceObject.value;
                let unit = distanceObject.unit;

                switch (unit) {
                    case 'KM':
                        value *= 1000;
                        break;

                    case 'YDS':
                        value *= .9144;
                        break;

                    case 'MI':
                        value *= 1609.34;
                        break;

                    case 'M':
                        break;

                    default:
                        console.error("Unrecognized unit type: ", unit);
                        break;
                }

                return value;
            }

            let sortedPosts = data.postListByUserId.slice().sort(
                (a, b) => {
                    const timeStampA = new Date(a.postDate).getTime();
                    const timeStampB = new Date(b.postDate).getTime();
                    return timeStampA - timeStampB;
                }
            );
            // Hash Map to hold all of the extracted data. 
            // activity: [{x: timeStamp, y: distanceInMeters}]
            let statsMap = {};
            for (const activityEnum in ACTIVITY_MAP) {
                statsMap[activityEnum] = [];
            }

            // Extract all of the data
            sortedPosts.forEach(post => {
                let dataObject = {};

                // Normalize Post Date
                let postDate = new Date(post.postDate);
                postDate = startOfDay(postDate);
                dataObject['date'] = postDate;
                // Push data from each activity of a post into the activity map's arrays
                for (let i = 0; i < post.activityList.length; i++) {
                    const activity = post.activityList[i];
                    if (ACTIVITY_MAP[activity.type].distanceAllowed) {
                        dataObject['distance'] = distanceObjectToMeters(activity.distance); // Can be null
                    }
                    if (ACTIVITY_MAP[activity.type].durationAllowed) {
                        dataObject['duration'] = activity.duration;                         // Can be null
                    }
                    if (ACTIVITY_MAP[activity.type].additionalInfoAllowed) {
                        dataObject['additionalInfo'] = { ...activity.additionalInfo.calories };
                        // Initialize values to 0 so I don't have to check for undefined
                        // if (!dataObject.additionalInfo.averageHeartRate) {
                        //     dataObject.additionalInfo.averageHeartRate = 0;
                        // }
                        // if (!dataObject.additionalInfo.elevationGain) {
                        //     dataObject.additionalInfo.elevationGain = 0;
                        // }
                        if (!dataObject.additionalInfo.calories) {
                            dataObject.additionalInfo.calories = 0;
                        }
                    }

                    statsMap[activity.type].push(dataObject);
                }
            });

            // Merge duplicate timestamps for each array within the hash map
            for (const activityEnum in statsMap) {
                let dataPointList = statsMap[activityEnum];

                // https://stackoverflow.com/questions/38294781/how-to-merge-duplicates-in-an-array-of-objects-and-sum-a-specific-property
                statsMap[activityEnum] = dataPointList.reduce(reducer, []);
                function reducer(accumulator, current) {
                    let currentDate = current.date;
                    let sameDateObject = accumulator.find(function (element) {
                        return currentDate.getTime() === element.date.getTime();
                    });
                    if (sameDateObject) {
                        // Merge the two objects by summation. 
                        if (current.distance) {
                            sameDateObject.distance += current.distance;   // In Meters
                        }
                        if (current.duration) {
                            sameDateObject.duration += current.duration;   // In ms
                        }
                        if (current.additionalInfo) {
                            // Summation doesn't make sense for averageHeartRate or elevationGain. I'm leaving those two out.
                            // sameDateObject.additionalInfo.averageHeartRate += current.additionalInfo.averageHeartRate;
                            // sameDateObject.additionalInfo.elevationGain += current.additionalInfo.elevationGain;
                            sameDateObject.additionalInfo.calories += current.additionalInfo.calories;
                        }

                    } else {
                        accumulator.push(current);
                    }
                    return accumulator;
                }
            }
            setActivityDataMap(statsMap);
        }
    }, [data, loading, error]);

    if (loading) return (
        <BasicLayout title={'Numbers'}>
            <CircularProgress />
        </BasicLayout>
    );
    if (error) return (
        <BasicLayout title={'Numbers'}>
            <MuiAlert variant="filled" severity="error">Failed to retrieve data</MuiAlert>
        </BasicLayout>
    );

    return (
        <>
            {/* <Grid item xs={12} lg={12}>
                <BasicLayout title={'Combined Activity History'}>
                    {activityDataMap && <CumulativeBarChart activityDataMap={activityDataMap} />}
                </BasicLayout>
                <BasicLayout title={'Single Activity History'}>
                    {activityDataMap && <SingleBarChart activityDataMap={activityDataMap} />}
                </BasicLayout>
            </Grid> */}

            <Grid item xs={12} lg={12}>
                <BasicLayout title={'Numbers'}>
                    {activityDataMap &&
                        <SingleActivityStats
                            data={data}
                            activityDataMap={activityDataMap}
                        />}
                </BasicLayout>
            </Grid>
        </>
    );
}

export default UserStats;