import React, { useEffect, useState } from 'react';

import DayView from './DayView';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { ToolBar } from './ToolBar';
import { CalendarView } from './CalendarView';
import WeeklyView from './WeeklyView';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';

import { gql, useQuery } from '@apollo/client';
import TeamPostView from './TeamPostView';
import { WelcomeModal } from '../../components/Modal/WelcomeModal';

const useStyles = makeStyles((theme) => ({
    addFab: {
        position: 'fixed',
        bottom: 16,
        right: 16,
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    spinnerWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%'
    }

}));

// API Calls
const GET_POSTLIST = gql`
  query getPostList{
    me {
        first
        teamList {
            id
            name
            description
            profilePictureURL
            owner {
                id
                first
                last
                username
                profilePictureURL
            }
            memberList {
                first
            }
        }
        postList{
            id
            title
            note
            author {
                username
            }
            tagList {
                id
                username
            }
            postDate
            createdAt
            updatedAt
            activityList {
                id
                type
                duration
                distance {
                    value
                    unit
                }
                equipment {
                    id
                    type
                    name
                }
                additionalInfo {
                    averageHeartRate
                    elevationGain
                    calories
                }
            }
            # likeList
            # commentList
        }
    }
}
`;

export const Calendar = (props) => {
    const classes = useStyles();
    const { history, location } = props;

    // API State
    const { data, loading, error } = useQuery(GET_POSTLIST);

    let postList = undefined;
    if (data) {
        postList = data.me.postList;
    }
    // console.log('postList :>> ', postList);  

    // Calendar UI State
    // TODO change back to false
    const [welcome, setWelcome] = useState(false);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month");
    const [openModal, setOpenModal] = useState(false);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState("Sunday");

    // Team View State
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [numDaysToDisplayInTeamView, setNumDaysToDisplayInTeamView] = useState(3);    // Hard coded to 3 in UI

    useEffect(() => {
        // Open Welcome modal if react router passes welcome as true
        if(location.state && location.state.welcome){
            setWelcome(location.state.welcome)
            // make sure only see welcome modal once
            location.state.welcome = false
        }
    })

    // Display Logic
    if (loading) {
        return (<div className={classes.spinnerWrapper}><CircularProgress color="primary" /></div>)
    }
    if (error) { return <div>Error</div> };

    // Personal Calendar
    let currentViewComponent = null;
    switch (view) {
        case "month":
            currentViewComponent = <CalendarView postList={postList} date={date} setDate={setDate} setView={setView} firstDayOfWeek={firstDayOfWeek} />;
            break;
        case "week":
            currentViewComponent = <WeeklyView postList={postList} date={date} setDate={setDate} setView={setView} firstDayOfWeek={firstDayOfWeek} />;
            break;
        case "day":
            currentViewComponent = <DayView postList={postList} date={date} setDate={setDate}/>;
            break;
        case "team":
            currentViewComponent = <TeamPostView selectedTeamId={selectedTeamId} date={date} numDaysToDisplayInTeamView={numDaysToDisplayInTeamView}/>;
            break;
        default:
            currentViewComponent = null;
            alert("Sanity Check: Unrecognized view in Calendar.js");
            break;
    }

    return (
        <div styles={{ height: 670, alignItems: "stretch" }}>
            <ToolBar 
                date={date} 
                setDate={setDate} 
                view={view} 
                setView={setView} 
                setFirstDayOfWeek={setFirstDayOfWeek} 
                numDaysToDisplayInTeamView={numDaysToDisplayInTeamView}
                teamList={data.me.teamList}
                setSelectedTeamId={setSelectedTeamId}
            />
            {currentViewComponent}
            <NewActivityModal openModal={openModal} handleClose={() => setOpenModal(false)} />
            <span className={classes.addFab}>
                <Fab color="secondary" aria-label="add" onClick={() => setOpenModal(true)}>
                    <AddIcon />
                </Fab>
            </span>
            <WelcomeModal open={welcome} handleClose={() => setWelcome(false)}/>
        </div>);
}