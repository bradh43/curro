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
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TodayIcon from '@material-ui/icons/Today';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const useStyles = makeStyles((theme) => ({
    activityCell: {
      backgroundColor: '#E8E8E8',
      borderRadius: 4,
      padding: 2,
      margin: 0,
      marginTop: 4,
    },
    primaryCell: {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      borderRadius: 4,
      padding: 2,
      margin: 0,
      marginTop: 4,
    },
    details: {
      paddingLeft: 4,
    },
    middleDot: {
      fontWeight: '700',
      paddingLeft: 4,
      lineHeight: '20px',
    },
    activityIcon: {
      fontSize: '1.0rem',
      position: 'relative',
      height: 20,
      width: 20,
      marginRight: 20,
    },
    innerActivityIcon: {
      position: 'absolute',
      top: 2,
      left: 2,
    },
    icon: {
      fontSize: '1rem',
      height: 16,
      width: 16,
      marginTop: 1,
    },
    primaryIcon: {
      fontSize: '1rem',
      height: 16,
      width: 16,
      marginTop: 1,
      filter: 'invert(1)'
    },
    totalList: {
      width: 96,
      display: 'inline-block',
    }
}));

const getTotalMin = (totalMs) => {
  return Math.ceil(totalMs/60000)
}

const getTotalTimeFormat = (totalMs) => {
  const hour = Math.floor(totalMs/(60000* 60))
  const min = getTotalMin(totalMs-(hour*(60000* 60)))

  const hourFormat = hour === 0 ? '' : `${hour} hr `
  const minFormat = min === 0 ? '' : `${min} min`

  return `${hourFormat}${minFormat}`
}

const getTotalDistanceFormat = (totalDistance) => {
  return totalDistance.toFixed(1)
}



export const ActivityTile = (props) => {
  const classes = useStyles();

  const getActivityTypeIcon = (activityType) => {
    switch(activityType.toUpperCase()) {
      case "RUN":
        return <Avatar alt="Run" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/run.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "BIKE":
        return <Avatar alt="Bike" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/bike.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "SWIM":
        return <Avatar alt="Swim" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/swim.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "SLEEP":
        return <Avatar alt="Sleep" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/sleep.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "CLIMB":
        return <Avatar alt="Climb" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/climb.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "ALTERG":
        return <Avatar alt="AlterG" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/alterg.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "YOGA":
        return <Avatar alt="Yoga" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/yoga.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "AQUA_JOG":
        return <Avatar alt="Aqua" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/aqua_jog.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      case "HIKE":
        return <Avatar alt="Hike" src={process.env.PUBLIC_URL + '/assets/icons/hike.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
      default:
        return <Avatar alt="Lift" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/lift.svg'} className={props.primary ? classes.primaryIcon : classes.icon}/>
    }
  }

  const isTotal = props.activity && props.activity.total 
  const isActivityTotalDuration = isTotal && props.activity.total.duration && props.activity.total.duration !== 0
  const isActivityTotalDistance = isTotal && props.activity.total.distance && props.activity.total.distance.value !== 0

  const getActivityCellStyle = () => {
    if(isActivityTotalDuration && isActivityTotalDistance){
      return {top: '-8px'}
    }
    return {}
  }

  return (
  <div className={props.primary ? classes.primaryCell : classes.activityCell}>
    <span className={classes.activityIcon} style={getActivityCellStyle()}>
      <span className={classes.innerActivityIcon}>
        {props.activity && props.activity.type && getActivityTypeIcon(props.activity.type)}
      </span>
    </span>
    {!props.team && <Hidden only={'xs'}>
      <Hidden lgUp>
        <Typography display={'inline'} variant={'body2'} className={classes.details}>{props.activity.type}</Typography>
      </Hidden>
    </Hidden>}
    {props.team ? 
      <>
        {isTotal && <span className={classes.totalList}>
          {isActivityTotalDuration ? 
          <div>
            <span className={classes.middleDot}>&#183;</span>
            <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalTimeFormat(props.activity.total.duration)}</Typography>
          </div> : <></>}
          {isActivityTotalDistance ? 
          <div>
            <span className={classes.middleDot}>&#183;</span>
            <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalDistanceFormat(props.activity.total.distance.value) + ' ' + props.activity.total.distance.unit}</Typography>
          </div> : <></>}
        </span>}
        {(props.activity && props.activity.duration && props.activity.duration !== 0) ? 
          <>
            <span className={classes.middleDot}>&#183;</span>
            <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalMin(props.activity.duration) + ' min'}</Typography>
          </> : <></>
        }
        {(props.activity && props.activity.distance && props.activity.distance.value !== 0) ? 
          <>
            <span className={classes.middleDot}>&#183;</span>
            <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalDistanceFormat(props.activity.distance.value) + ' ' + props.activity.distance.unit}</Typography>
          </> : <></>
        } 
      </> :
      <Hidden mdDown>
      {isTotal && <span className={classes.totalList}>
        {isActivityTotalDuration ? 
        <div>
          <span className={classes.middleDot}>&#183;</span>
          <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalTimeFormat(props.activity.total.duration)}</Typography>
        </div> : <></>}
        {isActivityTotalDistance ? 
        <div>
          <span className={classes.middleDot}>&#183;</span>
          <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalDistanceFormat(props.activity.total.distance.value) + ' ' + props.activity.total.distance.unit}</Typography>
        </div> : <></>}
      </span>}
      {props.activity && props.activity.duration && props.activity.duration !== 0 ? 
        <>
          <span className={classes.middleDot}>&#183;</span>
          <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalMin(props.activity.duration) + ' min'}</Typography>
        </> : <></>
      }
      {props.activity && props.activity.distance && props.activity.distance.value !== 0 ? 
        <>
          <span className={classes.middleDot}>&#183;</span>
          <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalDistanceFormat(props.activity.distance.value) + ' ' + props.activity.distance.unit}</Typography>
        </> : <></>
      }
    </Hidden>
    } 
  </div>);
}