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
import { Day } from './Day';


const useStyles = makeStyles((theme) => ({
    week: {
      height: "calc(100%/6)",
      minHeight: 160,
    },
    cell: {
      height: '100%',
      border: "1px solid #fafafa",
      padding: 8,
    },
}));


export const Week = (props) => {
  const classes = useStyles();


  const generateDayComponents = () => {
    // Generate the 7 days in a week using the passed firstDay
    let firstDayOfWeek = new Date(props.firstDay);
    let days = [];
    for (let i = 0; i < 7; i++) {
        let day = new Date(firstDayOfWeek);
        days.push(day);
  
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 1);
    }

    let dayComponents = []
    dayComponents = days.map(dayDate => {
        return (
          <Grid item xs>
            <Day dayDate={dayDate} viewMonth={props.viewMonth}/>
          </Grid>
        )
    });

    return dayComponents;
  }

  let dayComponents = generateDayComponents()

  return (
    <Grid container item xs={12} spacing={0} className={classes.week}>
      {dayComponents}
      <Grid item xs>
        <Box className={classes.cell}>

        </Box>
      </Grid>
    </Grid>);
}