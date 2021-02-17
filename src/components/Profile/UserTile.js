import React, { useContext } from 'react';
import { AuthContext } from '../../auth';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { FollowButton } from '../../components/Form/FollowButton/FollowButton';
import { IconButton, ListItemSecondaryAction } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';






export const UserTile = (props) => {

  const { history } = props;

  const navigateToUserProfile = () => {
    history.push('/user/'+props.user.id)
    if(props.handleClose){
      props.handleClose()
    }
  }

  const classes = useStyles();
  const { user } = useContext(AuthContext)

  return (
    <ListItem alignItems="flex-start" className={classes.resultItem} onClick={navigateToUserProfile} divider>
        <ListItemAvatar>
          <Avatar alt="Profile Picture" src={props.user.profilePictureURL}/>
        </ListItemAvatar>
        <ListItemText
          primary={props.user.first + ' ' + props.user.last}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {props.user.username}
              </Typography>
              <Hidden smUp>
                <div className={classes.buttonRow}>
                  {(props.user && props.user.id && (user.id !== props.user.id)) &&
                    <FollowButton fullWidth={true} followerId={props.user.id}/>
                  }
                </div>
              </Hidden>
            </React.Fragment>
          }
        />
        {/* <ListItemSecondaryAction> */}

          
        {/* </ListItemSecondaryAction> */}

        <ListItemSecondaryAction className={classes.followButton} >
          <Hidden xsDown>
              {(props.user && props.user.id && (user.id !== props.user.id)) &&
                <FollowButton fullWidth={false} followerId={props.user.id}/>
              }
          </Hidden>
          
        </ListItemSecondaryAction>

      </ListItem>);
}

const useStyles = makeStyles((theme) => ({
  inline: {
    display: 'inline',
  },
  resultItem: {
    backgroundColor: "#ffffff",
    cursor: 'pointer',
    "&:hover": {
      backgroundColor: '#fafafa',
    },
  },
  buttonRow: {
    display: 'block',
    width: '100%',
    marginTop: 8,
    marginBottom: -16
    
  },
  followButton: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: 16
    },
  }
}));