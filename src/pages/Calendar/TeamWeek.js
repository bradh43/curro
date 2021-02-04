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
import { TeamDay } from './TeamDay';
import { ActivityTile } from './ActivityTile';
import moment from 'moment';
import { format } from 'date-fns'
import DistanceHelper from '../../utils/DistanceHelper';
import { AllowedActivity } from '../../components/Activity/AllowedActivity';

const useStyles = makeStyles((theme) => ({
    week: {
      // minHeight: 144,
      // maxHeight: 384,
      // height: '100%'
    },
    cell: {
      height: '100%',
      border: "1px solid #E8E8E8",
      padding: 8,
      paddingBottom: 32,
      backgroundColor: '#FBFBFB'
    },
    username: {
      overflowWrap: 'anywhere',
      fontWeight: 600,
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.primary.main,
      }
    },
}));


export const TeamWeek = (props) => {
  const classes = useStyles();
  const { history } = props;

  const { user } = useContext(AuthContext)

  // TODO should be min 120, max 328, or if show more, then the height of longest post, and be careful with setState to not be to small
  const [weekHeight, setWeekHeight] = useState(354)

  const navigateToUserProfile = () => {
    history.push('/user/'+props.data.user.id)
  }

  const getPost = (dayDate) => {
    if(props.data && props.data){
      const postList = props.data.posts
      for(var i = 0; i < postList.length; i++){
        var postDate = moment(postList[i].postDate)

        if(postDate.month() === dayDate.month() && postDate.date() === dayDate.date() && postDate.year() === dayDate.year()){
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

    let singleDay = moment(props.date)

    // for mobile view only show one day
    dayComponents.push(
      <Hidden mdUp>
        <TeamDay 
          post={getPost(singleDay)}
          editPost={props.editPost} 
          setEditPost={props.setEditPost}
          dayDate={singleDay} 
          me={props.data.user.id === user.id}
          viewMonth={props.date.getMonth()}
          setOpenModal={props.setOpenModal}
          setModalDate={props.setModalDate}
        />
      </Hidden>
    )

    for (let i = 0; i < 7; i++) {
      // find post
      var post = getPost(day)

      // update activityTotals
      activityTotals = updateActivityTotals(activityTotals, post)

      dayComponents.push(
        <Hidden smDown>
          <TeamDay 
            post={post}
            editPost={props.editPost} 
            setEditPost={props.setEditPost}
            dayDate={day} 
            me={props.me}
            viewMonth={props.viewMonth}
            setOpenModal={props.setOpenModal}
            setModalDate={props.setModalDate}
          />
        </Hidden>
        )
        day = moment(day).add(1, 'days');
    }
    let totalComponents = []
    totalComponents = Object.entries(activityTotals).map(entry => {
      return (
        <ActivityTile activity={entry[1]} key={'user-total-'+entry[0]+props.firstDay.getDate()+'-'+props.firstDay.getMonth()} primary={true}/>
      );
    })

    return [(<Grid item xs key={'total-week-'+day.format('YYYY-MM-DD')}>
        <Box className={classes.cell}>
          <Typography variant={'body2'} className={classes.username} onClick={navigateToUserProfile}>{props.data.user.username}</Typography>
          <Hidden mdDown>
            {totalComponents}
          </Hidden>
        </Box>
      </Grid>), ...dayComponents];
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
    <Grid 
      container 
      item 
      spacing={0} 
      direction="row"
      alignItems="stretch"
      className={classes.week} 
      style={{minHeight: 160}}
    >
      {generateDayComponents()}
    </Grid>
  );
}