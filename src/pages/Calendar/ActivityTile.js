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
import Avatar from '@material-ui/core/Avatar';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PoolIcon from '@material-ui/icons/Pool'; //swim
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'; //run, alter-g
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike'; //bike
import HotelIcon from '@material-ui/icons/Hotel'; //sleep
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'; //default icon

const useStyles = makeStyles((theme) => ({
    activityCell: {
      backgroundColor: '#EEEFF1',
      borderRadius: 4,
      padding: 0,
      margin: 0,
      marginTop: 4,
      height: 20,
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
    },
}));

const getTotalMin = (totalMs) => {
  return Math.ceil(totalMs/60000)
}



export const ActivityTile = (props) => {
  const classes = useStyles();

  const getActivityTypeIcon = (activityType) => {
    switch(activityType.toUpperCase()) {
      case "RUN":
        return <DirectionsRunIcon className={classes.icon}/>
      case "BIKE":
        return <DirectionsBikeIcon className={classes.icon}/>
      case "SWIM":
        return <PoolIcon className={classes.icon}/>
      case "SLEEP":
        return <HotelIcon className={classes.icon}/>
      case "CLIMB":
        return <Avatar alt="Climb" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/noun_climbing.png'} className={classes.icon}/>
      case "ALTERG":
        return <Avatar alt="AlterG" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/noun_treadmill.png'} className={classes.icon}/>
      case "YOGA":
        return <Avatar alt="Yoga" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/noun_yoga.png'} className={classes.icon}/>
      case "AQUA_JOG":
        return <Avatar alt="Aqua" variant="square" src={process.env.PUBLIC_URL + '/assets/icons/noun_aqua.png'} className={classes.icon}/>
      case "HIKE":
        return <Avatar alt="Hike" src={process.env.PUBLIC_URL + '/assets/icons/noun_hiking.png'} className={classes.icon}/>
      default:
        return <FitnessCenterIcon className={classes.icon}/>
    }
  }

  return (<div className={classes.activityCell}>
    <span className={classes.activityIcon}>
      <span className={classes.innerActivityIcon}>
        {props.activity && props.activity.type && getActivityTypeIcon(props.activity.type)}
      </span>
    </span>
    {props.activity && props.activity.total && props.activity.total.duration && props.activity.total.duration !== 0 && 
    <>
      <span className={classes.middleDot}>&#183;</span>
      <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalMin(props.activity.total.duration) + ' min'}</Typography>
    </>}
    {props.activity && props.activity.total && props.activity.total.distance && props.activity.total.distance.value !== 0 && 
    <>
      <span className={classes.middleDot}>&#183;</span>
      <Typography display={'inline'} variant={'body2'} className={classes.details}>{props.activity.total.distance.value + ' ' + props.activity.total.distance.unit}</Typography>
    </>}

    {props.activity && props.activity.duration && props.activity.duration !== 0 && 
      <>
        <span className={classes.middleDot}>&#183;</span>
        <Typography display={'inline'} variant={'body2'} className={classes.details}>{getTotalMin(props.activity.duration) + ' min'}</Typography>
      </>
    }
    {props.activity && props.activity.distance && props.activity.distance.value !== 0 && 
      <>
        <span className={classes.middleDot}>&#183;</span>
        <Typography display={'inline'} variant={'body2'} className={classes.details}>{props.activity.distance.value + ' ' + props.activity.distance.unit}</Typography>
      </>
    }
  </div>);
}