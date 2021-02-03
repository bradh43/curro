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
import { TeamWeek } from './TeamWeek';
import { WeekLabel } from './WeekLabel';
import add from 'date-fns/add';
import Hidden from '@material-ui/core/Hidden';

const WEEKS_TO_DISPLAY_IN_VIEW = 6;


const useStyles = makeStyles((theme) => ({
  root: {
    margin: '16px 16px 0 16px',
    height: 'calc(100vh - 144px)',
    boxShadow: 'none',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        height: 'calc(100vh - 136px)',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '8px 8px 0 8px',
      height: 'calc(100vh - 128px)',
    },
  },
  appbar: {
    // backgroundColor: theme.palette.background.main,
    // color: '#4c4c4c',
    // position: 'static',
  },
  toolbar: {
    boxShadow: '0 2px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('sm')]: {
        paddingLeft: 4,
        paddingRight: 4,
    },
  },
  title: {
      marginRight: theme.spacing(2),
  },
  displayCurrent: {
      flexGrow: 1,
      textAlign: 'center',
  },
  iconButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
          margin: 0,
      },
  },
  weekLabel: {
    height: 28,
    width: '100%', 
  },
  display: {
    height: 'calc(100% - 94px)',
    overflow: 'scroll',
    width: '100%', 
    [theme.breakpoints.down('xs')]: {
        height: 'calc(100% - 86px)',
    },
  },
  loading: {
    position: 'absolute',
    top: '50vh',
    left: 0,
    width: '100vw',
    height: 64,
    margin: 0,
  },
  progress: {
    width: 64,
    display: 'block',
    margin: 'auto',
  },
}));


export const TeamCalendarDisplay = (props) => {
  const classes = useStyles();
  const { history } = props;

  const previousButton = () => {
    props.setDate(prevDate => {
      let copy = new Date(prevDate);
      return add(copy, {days: -7});
    });
  }

  const nextButton = () => {
    props.setDate(nextDate => {
      let copy = new Date(nextDate);
      return add(copy, {days: 7});
    });
  }

  const previousDayButton = () => {
    props.setDate(prevDate => {
      let copy = new Date(prevDate);
      // TODO change to -1
      return add(copy, {days: -1});
    });
  }

  const nextDayButton = () => {
    props.setDate(nextDate => {
      let copy = new Date(nextDate);
      return add(copy, {days: 1});
    });
  }

  const getFirstDayOfWeek = () => {
    let firstDay = new Date(props.date);
    // Get the first sunday of the week
    firstDay.setDate(props.date.getDate()-props.date.getDay());
    // if monday first just add one day
    if(props.mondayFirst){
      firstDay.setDate(firstDay.getDate()+1);
    } 
    return firstDay
  }

  const [firstDayOfWeekView, setFirstDayOfWeekView] = useState(new Date());
  const options = { year: 'numeric', month: 'long' };
  const calendarTitle = firstDayOfWeekView.toLocaleDateString(undefined, options);

  useEffect(() => {
    let temp = getFirstDayOfWeek()
    if(temp.toString() !== firstDayOfWeekView.toString()){
      setFirstDayOfWeekView(temp);
    }
  })

  return (
    <Paper className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Hidden smDown>
          <Tooltip title={"Previous Week"} enterDelay={400} >
            <IconButton color="inherit" onClick={previousButton}>
                <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        <Hidden mdUp>
          <Tooltip title={"Previous Day"} enterDelay={400} >
            <IconButton color="inherit" onClick={previousDayButton}>
                <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        <Typography variant="h5" className={classes.displayCurrent}>
            {calendarTitle}
        </Typography>
        <Hidden mdUp>
          <Tooltip title={"Next Day"} enterDelay={400} >
            <IconButton color="inherit" className={classes.iconButton} onClick={nextDayButton}>
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        <Hidden smDown>
          <Tooltip title={"Next Week"} enterDelay={400} >
            <IconButton color="inherit" className={classes.iconButton} onClick={nextButton}>
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
      </Toolbar>
      <Grid container spacing={0} className={classes.weekLabel}>
        <WeekLabel 
          mondayFirst={props.mondayFirst} 
          key={'week-label'} 
          team={true}
          date={props.date}
        />
      </Grid>
      <Grid 
        container
        direction="row"
        alignItems="stretch" 
        spacing={0} 
        className={classes.display}
      >
        {props.data && props.data.getTeamCalendar && props.data.getTeamCalendar.map((userPostMap) => {
          return (<TeamWeek
            history={history}
            data={userPostMap} 
            loading={props.loading}
            me={props.me}
            date={props.date}
            firstDay={firstDayOfWeekView} 
            viewMonth={firstDayOfWeekView.getMonth()} 
            key={'week-'+props.date.getDay()+'-'+userPostMap.user.id}
            weekCount={props.data.getTeamCalendar.length}
            setOpenModal={props.setOpenModal}
            editPost={props.editPost} 
            setEditPost={props.setEditPost}
            setModalDate={props.setModalDate}
          />);
        })}
      </Grid>
      {props.loading && <div className={classes.loading}>
        <div className={classes.progress}>
          <CircularProgress/>
        </div>
      </div>}

    </Paper>);
}