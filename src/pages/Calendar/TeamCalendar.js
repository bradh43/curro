import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../auth';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { ToolBar } from './ToolBar';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { WelcomeModal } from '../../components/Modal/WelcomeModal';
import { TeamNavBar } from '../../components/Calendar/TeamNavBar';
import { TeamCalendarDisplay } from './TeamCalendarDisplay';
import { Team } from '../Team/Team';
import { USER_CALENDAR_QUERY } from '../../utils/graphql';
import Moment from 'moment';

const useStyles = makeStyles((theme) => ({
    addFab: {
        position: 'fixed',
        bottom: 16,
        right: 16,
    },
    root: {
        flexGrow: 1,
    }
}));

const CALENDAR_VIEW_VALUE = 0
const OVERVIEW_VIEW_VALUE = 1
var previousUserid = null
var previousView = null
var previousDate = null

export const TeamCalendar = (props) => {
    const classes = useStyles();
    const { history, location } = props;

    const [welcome, setWelcome] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editPost, setEditPost] = useState(null)
    const [modalDate, setModalDate] = useState(new Date());
    const [viewValue, setViewValue] = React.useState((location.state && location.state.calendar) ? CALENDAR_VIEW_VALUE : OVERVIEW_VIEW_VALUE);
    const [date, setDate] = useState(new Date());
    const [mondayFirst, setMondayFirst] = useState(true)

    const { teamid } = props.match.params
    console.log(teamid)

    // const {data, loading, error} = useQuery(TEAM_CALENDAR_QUERY, {variables: {teamid: teamid, date: dateInput}})
    const data = {
        getTeamCalendar: [
          {
            user: {
              id: '5f8d1b4e66ebae0038491572',
              username: 'bradh43'
            },
            posts: [
              {
                id: "5fc2f7e9ceac56001757b337",
                createdAt: "1606612969832",
                title: "Rainy Loop",
                note: "Went for a run with Lara and made up a new loop that actually looped this time. It was raining in Texas for once, and honestly it was pretty refreshing and reminded me of the PNW. Overall nice little loop"
              },
              {
                id: "5fc6cb60d414d300179f3489",
                createdAt: "1606863712958",
                title: "Brrrr - Chilly Run 🥶",
                note: "It was 29 degrees this morning in Texas. Went for a run with Lara and Rosco, and Rosco absolutely loved this weather. He hammered the first mile. Not a lot of people out, went and did our park loop, and saw a lot of dogs wearing knitted sweaters. "
              }
            ]
          },
          {
            user: {
              id: "5f8d1c2f66ebae0038491573",
              username: "lrixpdx"
            },
            posts: [
              {
                id: "5fc46dbf54f6720017ef92a3",
                createdAt: "1606708671005",
                title: "Run and Climb",
                note: "Went for an easy run and climb with Brad today. Run was chilly and I felt unmotivated and tired, so only did a short loop with Rosco plus a small add on. Went climbing at ABP for the last time (teardrop...) didn't accomplish my project boulder, but did some other hard sends and felt good. Sad to be leaving there, seems like such an awesome community that I wish we could get to know more if not for Covid. "
              }
            ]
          },
          {
            user: {
              id: "5fa5d05ed6e19400173b8116",
              username: "audreywestern"
            },
            posts: [
              {
                id: "5fc91372ecc6ae00179ac550",
                createdAt: "1607013234636",
                title: "Logarun?",
                note: "Hello! Just messing around with curro. No run today but longer yoga + meditation. "
              }
            ]
          },
          {
            user: {
              id: "5f94e1e6e63d84215c77bd26",
              username: "julio"
            },
            posts: []
          }
        ]
      }
    const loading = false

    useEffect(() => {
        // Open Welcome modal if react router passes welcome as true
        if(location.state && location.state.welcome){
            setWelcome(location.state.welcome)
            // make sure only see welcome modal once
            location.state.welcome = false
        }
        console.log(date)
    })

   

    return (
        <div className={classes.root}>
            <TeamNavBar 
                viewValue={viewValue} 
                setViewValue={setViewValue} 
                setModalDate={setModalDate}
                setOpenModal={setOpenModal}
                history={history} 
                teamid={teamid} 
                mondayFirst={mondayFirst} 
                setMondayFirst={setMondayFirst}
            />
            {viewValue === CALENDAR_VIEW_VALUE && 
                <TeamCalendarDisplay
                    editPost={editPost}
                    setEditPost={setEditPost}
                    teamid={teamid} 
                    date={date} 
                    data={data}
                    loading={loading}
                    setDate={setDate} 
                    mondayFirst={mondayFirst}
                    setOpenModal={setOpenModal}
                    setModalDate={setModalDate}
                />}
            {viewValue === OVERVIEW_VIEW_VALUE && <Team teamid={teamid} history={history}/>}
            <NewActivityModal openModal={openModal} handleClose={() => setOpenModal(false)} modalDate={modalDate} editPost={editPost} setEditPost={setEditPost}/>
            {viewValue === CALENDAR_VIEW_VALUE && 
                <Hidden smUp>
                    <span className={classes.addFab}>
                        <Fab color="primary" aria-label="add" size="small" className={classes.addButton} onClick={() => {
                                setModalDate(new Date())
                                setOpenModal(true)
                            }
                        }>
                            <AddIcon className={classes.addIcon}/>
                        </Fab>
                    </span> 
                </Hidden>}
            <WelcomeModal open={welcome} handleClose={() => setWelcome(false)}/>
        </div>);
}