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
import { PostModal } from '../../components/Modal/PostModal';
import { UserNavBar } from '../../components/Calendar/UserNavBar';
import { UserCalendarDisplay } from './UserCalendarDisplay';
import { Profile } from '../Profile/Profile';
import { USER_CALENDAR_QUERY, GET_POST_BY_ID_QUERY } from '../../utils/graphql';
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
const PROFILE_VIEW_VALUE = 1
var previousUserid = null
var previousView = null
var previousDate = null
var moreDetailPost = {}

export const UserCalendar = (props) => {
    const classes = useStyles();
    const { history, location } = props;

    const [welcome, setWelcome] = useState(false);
    const [viewPost, setViewPost] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalPost, setModalPost] = useState(null)
    const [editPost, setEditPost] = useState(null)
    const [modalDate, setModalDate] = useState(new Date());
    const [viewValue, setViewValue] = React.useState((location.state && location.state.calendar) ? CALENDAR_VIEW_VALUE : PROFILE_VIEW_VALUE);
    const [date, setDate] = useState(new Date());
    const [mondayFirst, setMondayFirst] = useState(true)
    const [isCommenting, setIsCommenting] = useState(false)
    const [todayPost, setTodayPost] = useState(null)

    var { userid } = props.match.params
    const { user } = useContext(AuthContext)

    var me = false
    if(userid && user.id !== userid){
      me = false
    } else {
      me = true
      userid = user.id
    }

    const getUserCalendarDateFormat = () => {
        var temp = Moment(date).format('YYYY-MM-DD')
        return temp.toString()
    }

    const dateInput = getUserCalendarDateFormat()

    // const [userCalendarQuery, {data, loading, error}] = useLazyQuery(USER_CALENDAR_QUERY)

    const {data, loading, error} = useQuery(USER_CALENDAR_QUERY, {variables: {userId: userid, date: dateInput}})

    useEffect(() => {
        // Open Welcome modal if react router passes welcome as true
        if(location.state && location.state.welcome){
            setWelcome(location.state.welcome)
            // make sure only see welcome modal once
            location.state.welcome = false
        }
        if(previousDate !== dateInput){
            previousDate = dateInput
            // TODO delete
            // console.log("lazy query date change")
            // userCalendarQuery({variables: {userId: userid, date: dateInput}})
        }

        // Check if calendar or profile view
        if(previousUserid != userid || (location.state && location.state.calendar !== null)){
            previousUserid = userid
            setDate(new Date())

            if(location.state && location.state.calendar){
                setViewValue(CALENDAR_VIEW_VALUE)
                location.state.calendar = null
            } else {
                setViewValue(PROFILE_VIEW_VALUE)
                if(location.state){
                    location.state.calendar = null
                }
            }
        }
    })

    const [getUserPost, { data: userPostData, loading: userPostLoading }] = useLazyQuery(GET_POST_BY_ID_QUERY, {
        onCompleted: (result) => {
            moreDetailPost[result.post.id] = result.post
            setModalPost(result.post)
            setViewPost(true)
            return 
        },
        onError: (error) => console.log(error)
    })

    const openModalPost = (post, commentOnPost) => {
        setIsCommenting(commentOnPost)
        // get post data
        getUserPost({
            variables: {id: post.id},
        })
        if(userPostData && userPostData.post && !userPostLoading){
            setModalPost(userPostData.post)
            setViewPost(true)
        }
    }
   

    return (
        <div className={classes.root}>
            <UserNavBar 
                viewValue={viewValue} 
                setViewValue={setViewValue} 
                setModalDate={setModalDate}
                setOpenModal={setOpenModal}
                openModalPost={openModalPost}
                todayPost={todayPost}
                setTodayPost={setTodayPost}
                history={history} 
                me={me} 
                userid={userid} 
                mondayFirst={mondayFirst} 
                setMondayFirst={setMondayFirst}
            />
            {viewValue === CALENDAR_VIEW_VALUE && 
                <UserCalendarDisplay
                    history={history} 
                    editPost={editPost}
                    setEditPost={setEditPost}
                    todayPost={todayPost}
                    setTodayPost={setTodayPost}
                    me={me} 
                    userid={userid} 
                    date={date} 
                    data={data}
                    loading={loading || userPostLoading}
                    setDate={setDate} 
                    mondayFirst={mondayFirst}
                    setOpenModal={setOpenModal}
                    setModalDate={setModalDate}
                    openModalPost={openModalPost}
                />}
            {viewValue === PROFILE_VIEW_VALUE && <Profile userid={userid} me={me} history={history}/>}
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
            <PostModal open={viewPost} loading={userPostLoading} isCommenting={isCommenting} handleClose={() => setViewPost(false)} post={modalPost} history={history} openEditPostModal={() => { setOpenModal(true); setViewPost(false);}} setEditPost={setEditPost}/>
        </div>);
}