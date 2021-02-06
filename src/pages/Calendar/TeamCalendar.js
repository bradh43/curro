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
import { TeamNavBar } from '../../components/Calendar/TeamNavBar';
import { TeamCalendarDisplay } from './TeamCalendarDisplay';
import { Team } from '../Team/Team';
import { TEAM_CALENDAR_QUERY, GET_POST_BY_ID_QUERY } from '../../utils/graphql';
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
var moreDetailPost = {}

export const TeamCalendar = (props) => {
    const classes = useStyles();
    const { history, location } = props;

    const [welcome, setWelcome] = useState(false);
    const [viewPost, setViewPost] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalPost, setModalPost] = useState(null)
    const [editPost, setEditPost] = useState(null)
    const [modalDate, setModalDate] = useState(new Date());
    const [viewValue, setViewValue] = React.useState((location.state && location.state.calendar) ? CALENDAR_VIEW_VALUE : OVERVIEW_VIEW_VALUE);
    const [date, setDate] = useState(new Date());
    const [mondayFirst, setMondayFirst] = useState(true)
    const [isCommenting, setIsCommenting] = useState(false)

    const { teamid } = props.match.params

    const getTeamCalendarDateFormat = () => {
      var temp = Moment(date).format('YYYY-MM-DD')
      return temp.toString()
    }

    const dateInput = getTeamCalendarDateFormat()

    const {data, loading, error} = useQuery(TEAM_CALENDAR_QUERY, {variables: {teamId: teamid, date: dateInput}})

    useEffect(() => {
        // Open Welcome modal if react router passes welcome as true
        if(location.state && location.state.welcome){
            setWelcome(location.state.welcome)
            // make sure only see welcome modal once
            location.state.welcome = false
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
        // TODO use lazy query to get additional info and open modal
        // setModalPost(post)
        // setViewPost(true)
    }
    
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
                    history={history} 
                    editPost={editPost}
                    setEditPost={setEditPost}
                    teamid={teamid} 
                    date={date} 
                    data={data}
                    loading={loading || userPostLoading}
                    setDate={setDate} 
                    mondayFirst={mondayFirst}
                    setOpenModal={setOpenModal}
                    setModalDate={setModalDate}
                    openModalPost={openModalPost}
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
            <PostModal open={viewPost} loading={userPostLoading} isCommenting={isCommenting} handleClose={() => setViewPost(false)} post={modalPost} history={history} openEditPostModal={() => setOpenModal(false)} setEditPost={setEditPost}/>
        </div>);
}