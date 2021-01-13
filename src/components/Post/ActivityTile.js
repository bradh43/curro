import React from 'react';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles((theme) => ({
    icon: {
      height: 24,
      width: 24,
    },
}));

export const ActivityTile = props => {
  
  const validDistance = (props.activity.distance !== null && props.activity.distance.value !== null && props.activity.distance.value > 0) 
  const distance = validDistance ? (props.activity.distance.value + ' ' + props.activity.distance.unit.toLowerCase() + ' ') : ''

  const validDuration = (props.activity.duration !== null && props.activity.duration > 0)
  const duration =  validDuration ? TimeHelper.formatTimeMs(props.activity.duration) : ""

  const pace = (validDistance && validDuration) ? ("("+DistanceHelper.calculateAveragePace(props.activity.distance, props.activity.duration, props.activity.type) + ")") : ""

  const classes = useStyles();

  const getActivityTypeIcon = (activityType) => {
    switch(activityType.toUpperCase()) {
      case "RUN":
        return <Avatar alt="Run" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/run.svg'} className={classes.icon}/>
      case "BIKE":
        return <Avatar alt="Bike" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/bike.svg'} className={classes.icon}/>
      case "SWIM":
        return <Avatar alt="Swim" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/swim.svg'} className={classes.icon}/>
      case "SLEEP":
        return <Avatar alt="Sleep" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/sleep.svg'} className={classes.icon}/>
      case "CLIMB":
        return <Avatar alt="Climb" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/climb.svg'} className={classes.icon}/>
      case "ALTERG":
        return <Avatar alt="AlterG" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/alterg.svg'} className={classes.icon}/>
      case "YOGA":
        return <Avatar alt="Yoga" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/yoga.svg'} className={classes.icon}/>
      case "AQUA_JOG":
        return <Avatar alt="Aqua" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/aqua_jog.svg'} className={classes.icon}/>
      case "HIKE":
        return <Avatar alt="Hike" src={process.env.PUBLIC_URL + '/assets/icons/hike.svg'} className={classes.icon}/>
      default:
        return <Avatar alt="Lift" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/lift.svg'} className={classes.icon}/>
    }
  }

  return (
      <ListItem style={{backgroundColor: "#fafafa"}} divider>
        <ListItemAvatar>
          {getActivityTypeIcon(props.activity.type)}
        </ListItemAvatar>
        <ListItemText primary={props.activity.type.replace(/_+/g, ' ') + " " + distance + pace} secondary={duration}/>
      </ListItem>
    );
}