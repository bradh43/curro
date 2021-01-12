import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


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
    minHeight: 94,
    [theme.breakpoints.down('sm')]: {
      minHeight: 134
    },
  }, 
}));


export const UserSearchTile = (props) => {

  const { history } = props;

  const navigateToUserProfile = () => {
    history.push('/user/'+props.user.id)
    if(props.handleDrawerClose){
      props.handleDrawerClose()
    }
  }

  const classes = useStyles();

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
                {props.user.bio && (" — " + props.user.bio)}
            </React.Fragment>
          }
        />
      </ListItem>);
}