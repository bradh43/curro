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
import { NOTIFICATION_QUERY } from '../../utils/graphql'

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 16,
    marginRight: 16
  },  
  notificationArea: {
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
    
}));


const MARK_ALL_READ = gql`
  mutation {
    markAllRead {
      success
    }
  }
`;

var clickedBell = false
export const NotificationBell = (props) => {

  const [getNotification, { loading, data }] = useLazyQuery(NOTIFICATION_QUERY);
  const [markAllReadMutation] = useMutation(MARK_ALL_READ, {
    update(_) {
      clickedBell = true
    },
    onError(error) {
      console.log(error)
    }
  });

  useEffect(() => {
    getNotification()
    console.log("REQUESTED")
  }, []);
  if(data){
    console.log(data)
  }
  const { history } = props;
  const notificationRef = useRef()
  const classes = useStyles();
  return (
    <div>
        <div className={classes.root}>
            <IconButton onClick={props.handleNotificationOpen} ref={notificationRef}>
                <Badge overlap="circle" badgeContent={clickedBell ? 0 : props.notificationCount} color="primary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
        </div>
        {props.openNotification &&
        <Box className={classes.notificationArea}>
          <List className={classes.results}>
            <Waypoint onEnter={markAllReadMutation}/> 
            { loading  ? <CircularProgress className={classes.loadingResults}/> :
            (data && data.me && data.me.notificationList) && 
            (data.me.notificationList.length >= 1 ?
              data.me.notificationList.map((notification) => (
                <NotificationTile key={"notification-" + notification.id} notification={notification} history={history} handleDrawerClose={props.handleDrawerClose}/>
              )) :
              <NoResults/>)
            }
          </List>
        </Box> }
    </div>
    );
}