import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../auth';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { ToolBar } from './ToolBar';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql, useQuery } from '@apollo/client';
import { WelcomeModal } from '../../components/Modal/WelcomeModal';
import { UserNavBar } from '../../components/Calendar/UserNavBar';
import { UserCalendarDisplay } from './UserCalendarDisplay';
import { Profile } from '../Profile/Profile';
import Moment from 'moment';


const useStyles = makeStyles((theme) => ({
    addFab: {
        position: 'fixed',
        bottom: 16,
        right: 32,
    },
    root: {
        flexGrow: 1,
    }
}));

const CALENDAR_VIEW_VALUE = 0
const PROFILE_VIEW_VALUE = 1

export const UserCalendar = (props) => {
    const classes = useStyles();
    const { history, location } = props;

    const [welcome, setWelcome] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalDate, setModalDate] = useState(new Date());
    const [viewValue, setViewValue] = React.useState(0);
    const [date, setDate] = useState(new Date());
    const [mondayFirst, setMondayFirst] = useState(true)

    const { user } = useContext(AuthContext)
    const { userid } = props.match.params

    var me = false
    if(userid && user.id !== userid){
      me = false
    } else {
      me = true
    }

    const USER_CALENDAR_QUERY = gql`
        query CALENDAR_POSTS($userId: ID, $date: String){
            getProfileCalendar(userId: $userId, date: $date){
                id
                title
                postDate
                activityList {
                    id
                    type
                    duration
                    distance {
                        unit
                        value
                    }
                }
            }
        }
    `;

    const getUserCalendarDateFormat = () => {
        var temp = Moment(date).format('YYYY-MM-DD')
        return temp.toString()
    }

    const dateInput = getUserCalendarDateFormat()

    const {data, loading, error} = useQuery(USER_CALENDAR_QUERY, {variables: {userId: userid, date: dateInput}})

    useEffect(() => {
        // Open Welcome modal if react router passes welcome as true
        if(location.state && location.state.welcome){
            setWelcome(location.state.welcome)
            // make sure only see welcome modal once
            location.state.welcome = false
        }
    })

   

    return (
        <div className={classes.root}>
            <UserNavBar 
                viewValue={viewValue} 
                setViewValue={setViewValue} 
                history={history} 
                me={me} 
                userid={userid} 
                mondayFirst={mondayFirst} 
                setMondayFirst={setMondayFirst}
            />
            {viewValue === CALENDAR_VIEW_VALUE && 
                <UserCalendarDisplay
                    me={me} 
                    userid={userid} 
                    date={date} 
                    data={data}
                    loading={loading}
                    setDate={setDate} 
                    mondayFirst={mondayFirst}
                    setOpenModal={setOpenModal}
                    setModalDate={setModalDate}
                />}
            {viewValue === PROFILE_VIEW_VALUE && <Profile userid={userid} me={me} history={history}/>}
            <NewActivityModal openModal={openModal} handleClose={() => setOpenModal(false)} modalDate={modalDate}/>
            {viewValue === CALENDAR_VIEW_VALUE && <span className={classes.addFab}>
                <Fab color="primary" aria-label="add" onClick={() => {
                        setModalDate(new Date())
                        setOpenModal(true)
                    }
                }>
                    <AddIcon />
                </Fab>
            </span> }
            <WelcomeModal open={welcome} handleClose={() => setWelcome(false)}/>
        </div>);
}