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
import List from '@material-ui/core/List';
import { ActivityTile } from './ActivityTile';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    cell: {
      height: '100%',
      width: '100%',
      border: "1px solid #fafafa",
      padding: 8,
      backgroundColor: '#ffffff',
      position: 'relative',
      cursor: 'pointer',
      color: '#5d5d5d',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      }
    },
    previousCell: {
      height: '100%',
      width: '100%',
      border: "1px solid #fafafa",
      padding: 8,
      backgroundColor: '#f5f2fb',
      position: 'relative',
      color: '#bfbfbf',
      cursor: 'pointer',
      opacity: 0.7,
      '&:hover': {
        backgroundColor: '#f7f7f7',
      }
    },
    date: {
      color: '#8AA0BD',
      position: 'absolute',
      top: 8,
      left: 8,
      width: 24,
    },
    today: {
      backgroundColor: theme.palette.primary.main,
      height: 24,
      width: 24,
      fontSize: '0.875rem',
      display: 'inline-block',
      lineHeight: '24px',
      textAlign: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    title: {
      whiteSpace: 'nowrap',
      display: 'inline-block',
      marginLeft: 24,
      color: '#232323',
      fontWeight: 400,
      width: 'calc(((100vw - 32px) / 8) - 50px)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&:hover': {
        color: theme.palette.primary.main,
      }
    }
}));

const isToday = (someDate) => {
  return someDate.isSame(moment())
}

export const Day = (props) => {
  const classes = useStyles();
  const today = isToday(props.dayDate)

  const post = props.post

  const openPostModal = () => {
    if(post && post.id){
      // edit post
      console.log(post.id)
      console.log("TODO: open edit post modal, and query post info")

    } else {
      // create new post
      props.setModalDate(props.dayDate)
      props.setOpenModal(true)
    }

  }
  
  return (
    <Box 
      className={props.viewMonth !== props.dayDate.month() ? classes.previousCell : classes.cell} 
      onClick={openPostModal}
    >
      <div style={{width: '100%', height: '24px'}}>
        <div style={{width: '100%', height: '24px'}}>
          <span className={classes.date}>
            {today ? <Avatar className={classes.today}>{props.dayDate.date()}</Avatar> : props.dayDate.date()}
          </span>
          {post && <span style={{width: '24px', height: '24px'}}>
            <Typography display={'inline'} variant={'body2'} className={classes.title}>{post.title}</Typography>
          </span>}
        </div>
        <div>
          {post && post.activityList.map(activity => (
            <ActivityTile activity={activity} key={'day-activity-'+activity.id}/>
          ))}
        </div>
      </div>
    </Box>);
}