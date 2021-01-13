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


const useStyles = makeStyles((theme) => ({
    week: {

    },
    cell: {
      textAlign: 'center',
      color: '#8AA0BD',
      padding: 4,
    },
}));

const mondayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const sundayWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const WeekLabel = (props) => {
  const classes = useStyles();
  
  return (
    <Grid container item xs={12} spacing={0} className={classes.week}>
      <Hidden smUp>
        {(props.mondayFirst ? mondayWeek : sundayWeek).map((dayLabel) => (
          <Grid item xs key={dayLabel}>
            <Box className={classes.cell}>
              {dayLabel[0]}
            </Box>
          </Grid>
        ))}
      </Hidden>
      <Hidden xsDown>
        {(props.mondayFirst ? mondayWeek : sundayWeek).map((dayLabel) => (
          <Grid item xs key={dayLabel}>
            <Box className={classes.cell}>
              {dayLabel}
            </Box>
          </Grid>
        ))}
      </Hidden>
      <Hidden mdDown>
        <Grid item xs key={'total'}>
          <Box className={classes.cell}>
            Total
          </Box>    
        </Grid>
      </Hidden>
    </Grid>);
}