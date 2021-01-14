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
import { Day } from './Day';
import { ActivityTile } from './ActivityTile';
import moment from 'moment';
import { format } from 'date-fns'
import DistanceHelper from '../../utils/DistanceHelper';
import { AllowedActivity } from '../../components/Activity/AllowedActivity';

const useStyles = makeStyles((theme) => ({
    week: {
      minHeight: 144,
    },
    cell: {
      height: '100%',
      border: "1px solid #E8E8E8",
      padding: 8,
      paddingBottom: 32,
      backgroundColor: '#F8F2F4'
    },
}));

var seenDates = []
var lastSeenMonth = -1

export const Week = (props) => {
  const classes = useStyles();

  const getPost = (dayDate) => {
    if(props.data && props.data.getProfileCalendar){
      const postList = props.data.getProfileCalendar
      for(var i = 0; i < postList.length; i++){
        var postDate = moment(postList[i].postDate)

        if(postDate.month() === dayDate.month() && postDate.date() === dayDate.date()){
          return postList[i]
        }
      }
    }
    return null
  }

  const generateDayComponents = () => {
    // Generate the 7 days in a week using the passed firstDay
    let day = moment(props.firstDay);
    let dayComponents = []
    var activityTotals = {}

    for (let i = 0; i < 7; i++) {
      // find post
      var post = getPost(day)

      // update activityTotals
      activityTotals = updateActivityTotals(activityTotals, post)

      dayComponents.push(
        <Grid item xs key={'day-'+day.date()}>
          <Day 
            post={post}
            editPost={props.editPost} 
            setEditPost={props.setEditPost}
            dayDate={day} 
            me={props.me}
            viewMonth={props.viewMonth}
            setOpenModal={props.setOpenModal}
            setModalDate={props.setModalDate}
          />
        </Grid>)
        day = moment(day).add(1, 'days');
    }
    let totalComponents = []
    totalComponents = Object.entries(activityTotals).map(entry => {
      return (
        <ActivityTile activity={entry[1]} key={'total-'+entry[0]+props.firstDay.getDate()+'-'+props.firstDay.getMonth()}/>
      );
    })

    // display total
    dayComponents.push(
      <Hidden mdDown key={'total-week-'+day.format('YYYY-MM-DD')}>
        <Grid item xs>
          <Box className={classes.cell}>
            {totalComponents}
          </Box>
        </Grid>
      </Hidden>
    )

    return dayComponents;
  }

  const updateActivityTotals = (activityTotals, post) => {
    // update totals with post data
    if(post && post.activityList){
      post.activityList.map(activity => {
        // check if already a key in totals
        if(activityTotals[activity.type]){
          activityTotals[activity.type] = {
            'type': activity.type,
            'total': {
              'distance': {
                'value': DistanceHelper.convertDistanceToUnit(activity.distance, activityTotals[activity.type].total.distance.unit) + activityTotals[activity.type].total.distance.value,
                'unit': activityTotals[activity.type].total.distance.unit
              },
              'duration': activity.duration + activityTotals[activity.type].total.duration
            }
          }
        } else {
          // get the selected activity default unit
          var selectedActivity = AllowedActivity[0]
          for(var i=0; i<AllowedActivity.length; i++) {
            if(AllowedActivity[i].type.replace(/\s+/g, '_').toUpperCase() == activity.type){
              selectedActivity = AllowedActivity[i]
              break
            }
          }

          activityTotals[activity.type] = {
            'type': activity.type,
            'total': {
              'distance': {
                'value': DistanceHelper.convertDistanceToUnit(activity.distance, selectedActivity.defaultUnit),
                'unit': selectedActivity.defaultUnit
              },
              'duration': activity.duration
            }
          }
        }
        
      })
    }
    return activityTotals
  }

  return (
    <Grid container item xs={12} spacing={0} className={classes.week} style={{minHeight: 'calc(100%/'+props.weekCount+')'}}>
      {generateDayComponents()}
    </Grid>);
}