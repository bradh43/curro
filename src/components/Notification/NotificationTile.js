import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { IconButton, ListItemSecondaryAction } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import { gql, useMutation } from '@apollo/client';
import { UPDATE_NOTIFICATION, NOTIFICATION_QUERY } from '../../utils/graphql'

const useStyles = makeStyles((theme) => ({
  message: {
    marginBottom: 8,
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      width: 214
    },
  },
  resultItem: {
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: '#fafafa',
    },
  },
  profileClick: {
    cursor: 'pointer',
    userSelect: 'none',
    "&:hover": {
      textDecoration: 'underline',
      color: theme.palette.secondary.main,
    },
  },
  profilePicture: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: 16
    },
  },
  buttonRow: {
    marginTop: 8,
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      marginTop: -8
    },

  } ,
  actionButton: {
    flex: 1,
  }
}));

export const NotificationTile = (props) => {

  const { history } = props;

  const [updateNotificationMutation] = useMutation(UPDATE_NOTIFICATION, {
    update(store, { data: { updateNotification }}) {
      // NOTIFICATION_QUERY
      const data = store.readQuery({
        query: NOTIFICATION_QUERY
      })

      const updatedNotificationList = data.me.notificationList.filter((notification) => {
        if(notification.id !== updateNotification.id){
          return notification
        }
      })

      store.writeQuery({
        query: NOTIFICATION_QUERY,
        data: {
          me: {
            ...data.me,
            __typename: "User",
            notificationList: updatedNotificationList,
          }
        }
      }) 

    },
    onError(error) {
      console.log(error)
    }
  });
  const accept = () => {
    const notificationInput = {
      input: {
        id: props.notification.id,
        read: true,
        deleted: false,
        accept: true
      }
    }
    updateNotificationMutation({ variables: notificationInput })
  }
  const deny = () => {
    const notificationInput = {
      input: {
        id: props.notification.id,
        read: true,
        deleted: false,
        accept: false
      }
    }
    updateNotificationMutation({ variables: notificationInput })
  }
  const navigateToUserProfile = () => {
    history.push('/profile/'+props.notification.sender.id)
    if(props.handleDrawerClose){
      props.handleDrawerClose()
    }
  }
  const navigateToTeamProfile = () => {
    history.push('/team/'+props.notification.team.id)
    if(props.handleDrawerClose){
      props.handleDrawerClose()
    }  
  }
  const navigateToProfile = () => {
    if(props.notification.team && props.notification.type !== "TEAM_REQUEST"){
        navigateToTeamProfile()
    } else {
        navigateToUserProfile()
    }
  }    

  const classes = useStyles();
  return (
    <ListItem alignItems="flex-start" className={classes.resultItem} style={{backgroundColor: props.notification.read ? '#ffffff' : '#fffafc'}}divider>
        <ListItemAvatar>
          <Avatar 
            alt="Profile Picture" 
            variant= {(props.notification.team && props.notification.type !== "TEAM_REQUEST") ? "square" : "circle"} 
            src={(props.notification.team && props.notification.type !== "TEAM_REQUEST") ? props.notification.team.profilePictureURL : props.notification.sender.profilePictureURL}
            onClick={navigateToProfile}
            className={classes.profilePicture}
           />
        </ListItemAvatar>
        <ListItemText 
          primary={<span onClick={navigateToProfile} className={classes.profileClick}>
            {(props.notification.team&& props.notification.type !== "TEAM_REQUEST") ? props.notification.team.name : props.notification.sender.first + " " + props.notification.sender.last}
             </span>}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.message}
                color="textPrimary"
              >
                {props.notification.message}
              </Typography>
              {props.notification.responseRequired && <Hidden smUp >
                <span className={classes.buttonRow}>
                  <Button className={classes.actionButton} onClick={accept} style={{marginRight: 8}} variant="contained" color="primary">
                      Accept
                  </Button>
                  <Button className={classes.actionButton} onClick={deny} variant="outlined" color="default">
                      Deny
                  </Button>
                </span>

              </Hidden>}
            </React.Fragment>
            
          }
        />
          <ListItemSecondaryAction>
          {props.notification.responseRequired && <Hidden xsDown>
            <span className={classes.buttonRow}>
              <Button className={classes.actionButton} onClick={accept} style={{marginRight: 8}} variant="contained" color="primary">
                Accept
              </Button>
              <Button className={classes.actionButton} onClick={deny} variant="outlined" color="default">
                Deny
              </Button>
            </span>
          </Hidden>}
          
        </ListItemSecondaryAction>
      </ListItem>);
}
