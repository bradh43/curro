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
import { Week } from './Week';
import { WeekLabel } from './WeekLabel';
import add from 'date-fns/add';

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
      // backgroundColor: 'red',
    },
    progress: {
      width: 64,
      display: 'block',
      margin: 'auto',
    },
}));


export const UserCalendarDisplay = (props) => {
  const classes = useStyles();

  const previousButton = () => {
    props.setDate(prevDate => {
      let copy = new Date(prevDate);
      return add(copy, {months: -1});
    });
  }

  const nextButton = () => {
    props.setDate(nextDate => {
      let copy = new Date(nextDate);
      return add(copy, {months: 1});
    });
  }

  const getFirstDayOfMonthView = () => {
    // Get the first day of the month and get the first Sunday of that week.
    let dayOne = new Date(props.date.getFullYear(), props.date.getMonth());
    let firstSunday = new Date(dayOne);
    firstSunday.setDate(-1 * dayOne.getDay() + 1);

    let firstDayOfMonthView = firstSunday;
    if(props.mondayFirst){
      // Edge case: if the first day of a month is sunday, I want to go back a week.  
      if (dayOne.getDay() === 0) {
        firstDayOfMonthView.setDate(firstDayOfMonthView.getDate() - 7);
      }
      firstDayOfMonthView.setDate(firstDayOfMonthView.getDate() + 1);
    }
    
    return firstDayOfMonthView
  }

  const getFirstDaysOfMonthView = () => {
    let weekIndex = getFirstDayOfMonthView();

    let firstDaysOfMonthView = [];
    for (let i = 0; i < WEEKS_TO_DISPLAY_IN_VIEW; i++) {
      let copy = new Date(weekIndex);
      firstDaysOfMonthView.push(copy);
      weekIndex.setDate(weekIndex.getDate() + 7);
      copy = new Date(weekIndex);
      if(props.date.getMonth() !== copy.getMonth()){
        break;
      }
     
    }

    return firstDaysOfMonthView;
  }

  const options = { year: 'numeric', month: 'long' };
  const calendarTitle = props.date.toLocaleDateString(undefined, options);

  const [firstDaysOfMonthView, setFirstDaysOfMonthView] = useState([]);

  useEffect(() => {
    let temp = getFirstDaysOfMonthView()
    if(firstDaysOfMonthView.length === 0 || temp[0].toString() !== firstDaysOfMonthView[0].toString()){
      setFirstDaysOfMonthView(temp);
    }
  })

  return (
    <Paper className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Tooltip title={"Previous Month"} enterDelay={400} >
          <IconButton color="inherit" onClick={previousButton}>
              <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" className={classes.displayCurrent}>
            {calendarTitle}
        </Typography>
        <Tooltip title={"Next Month"} enterDelay={400} >
          <IconButton color="inherit" className={classes.iconButton} onClick={nextButton}>
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Grid container spacing={0} className={classes.weekLabel}>
        <WeekLabel mondayFirst={props.mondayFirst} key={'week-label'}/>
      </Grid>
      <Grid container spacing={0} className={classes.display}>

        {firstDaysOfMonthView.map((firstDay, weekNumber) => {
          return (<Week
            data={props.data} 
            loading={props.loading}
            me={props.me}
            firstDay={firstDay} 
            viewMonth={props.date.getMonth()} 
            weekCount={firstDaysOfMonthView.length} 
            weekNumber={weekNumber} 
            key={'week-'+props.date.getMonth()+'-'+weekNumber}
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