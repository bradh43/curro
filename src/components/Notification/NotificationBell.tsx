import React, { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql, useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import List from '@material-ui/core/List';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import { NotificationTile } from './NotificationTile'
import { NoResults } from './NoResults'
import { Waypoint } from 'react-waypoint';
import { NOTIFICATION_QUERY, GET_POST_BY_ID_QUERY } from '../../utils/graphql'
import { NotificationData } from '../../operation-result-types';
import { PostModal } from '../Modal/PostModal';
import { NewActivityModal } from '../Modal/NewActivityModal';
import Moment from 'moment';


const MARK_ALL_READ_MUTATION = gql`
  mutation markAllRead {
    markAllRead {
      success
    }
  }
`;

var clickedBell: boolean = false

type NotificationBellProps = {
  handleNotificationOpen: () => void;
  history: any,
  notificationCount: number,
  openNotification: boolean,
  handleDrawerClose: () => void,
}

var moreDetailPost: any = {}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  handleNotificationOpen,
  history,
  notificationCount,
  openNotification,
  handleDrawerClose
}) => {

  const [viewPost, setViewPost] = useState(false);
  const [modalPost, setModalPost] = useState(null)
  const [openModal, setOpenModal] = useState(false);
  const [editPost, setEditPost] = useState(null)
  const [modalDate, setModalDate] = useState(Moment());


  const [getNotification, { loading, data }] = useLazyQuery(NOTIFICATION_QUERY);
  const [markAllReadMutation] = useMutation(MARK_ALL_READ_MUTATION, {
    update(_) {
      clickedBell = true
    },
    onError(error) {
      console.log(error)
    }
  });

  const [getUserPost, { data: userPostData, loading: userPostLoading }] = useLazyQuery(GET_POST_BY_ID_QUERY, {
    onCompleted: (result) => {
        moreDetailPost[result.post.id] = result.post
        setModalPost(result.post)
        setViewPost(true)
        return 
    },
    onError: (error) => console.log(error)
  })

  const openModalPost = (post: any) => {
    // get post data
    getUserPost({
        variables: {id: post.id},
    })
    // TODO I think check if in moreDetailPost, and used the already fetched post
    if(userPostData && userPostData.post && !userPostLoading){
        setModalPost(userPostData.post)
        setViewPost(true)
    }
  }

  useEffect(() => {
    getNotification()
  }, []);

  const classes = useStyles();

  return (
    <div>
        <div className={classes.root}>
            <IconButton onClick={handleNotificationOpen}>
                <Badge overlap="circle" badgeContent={clickedBell ? 0 : notificationCount} color="primary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
        </div>
        {openNotification &&
        <Box className={classes.notificationArea}>
          <List className={classes.results}>
            <Waypoint onEnter={() => markAllReadMutation()}/> 
            { loading  ? <CircularProgress className={classes.loadingResults}/> :
            (data && data.me && data.me.notificationList) && 
            (data.me.notificationList.length >= 1 ?
              data.me.notificationList.map((notification: NotificationData) => (
                <NotificationTile 
                  key={"notification-" + notification.id} 
                  notification={notification} 
                  history={history} 
                  handleDrawerClose={handleDrawerClose} 
                  openModalPost={openModalPost}
                />
              )) :
              <NoResults/>)
            }
          </List>
        </Box> }
        <NewActivityModal openModal={openModal} handleClose={() => setOpenModal(false)} modalDate={modalDate} editPost={editPost} setEditPost={setEditPost}/>
        <PostModal open={viewPost} loading={userPostLoading} isCommenting={false} handleClose={() => setViewPost(false)} post={modalPost} history={history} openEditPostModal={() => { setOpenModal(true); setViewPost(false);}} setEditPost={setEditPost}/>
    </div>
    );
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 16,
    marginRight: 16
  },  
  notificationArea: {
    borderRadius: 8,
    boxShadow: '0 2px 30px 0 rgba(2,33,77,0.15)',
    width: 512,
    position: 'absolute',
    right: 80,
    top: 56,
    background: 'white',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      right: 0, 
    }
  },  
  results: {
    borderRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
    maxHeight: "60vh",
    overflowY: 'scroll',
    [theme.breakpoints.down('xs')]: {
      minHeight: "100vh",
      height: '100vh',
      maxHeight: "100vh",
      paddingBottom: 56
    }
  },
  loadingResults: {
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    display: 'block',
  },
}));