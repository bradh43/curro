import React, { useState } from 'react';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
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
import Tooltip from '@material-ui/core/Tooltip';
import { Button, ButtonGroup, Hidden, Menu } from '@material-ui/core';
import CalendarSettings from './CalendarSettings';
import add from 'date-fns/add';
import TeamSelectDropdown from './TeamSelectDropdown';
import { addDays, subDays } from 'date-fns';




const useStyles = makeStyles((theme) => ({
    appbar: {
        backgroundColor: theme.palette.background.main,
        color: '#4c4c4c',
        position: 'static',
    },
    toolbar: {
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
    },
    iconButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },
    },
    shortcutText: {
        color: theme.palette.background.main
    },
    teamButtonGroup: {
        margin: 5
    }
}));



export const ToolBar = ({ date, setDate, view, setView, setFirstDayOfWeek, teamList, numDaysToDisplayInTeamView, setSelectedTeamId }) => {
    const classes = useStyles();

    // Event Handlers **********
    // Buttons
    const handleViewChange = (event) => {
        setView(event.target.value);
        // setViewType(getViewSelected(event.target.value))
    };

    const todayButton = () => {
        console.log("Today Button Clicked")
        setDate(new Date());
    }

    const previousButton = () => {
        console.log("Previous Button Clicked")
        switch (view) {
            case "month":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return add(copy, {months: -1});
                });
                break;
            case "week":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return add(copy, {weeks: -1});
                });
                break;
            case "day":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return add(copy, {days: -1});
                });
                break;
            case "team":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    console.log('subDays(copy, numDaysToDisplayInTeamView) :>> ', subDays(copy, numDaysToDisplayInTeamView));
                    return subDays(copy, numDaysToDisplayInTeamView);
                });
                break;
            default:
                alert("Sanity Check: Unrecognized view in ToolBar.js");
                break;
        }

    }

    const nextButton = () => {
        console.log("Next Button Clicked")
        switch (view) {
            case "month":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return add(copy, {months: 1});
                });
                break;
            case "week":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return add(copy, {weeks: 1});
                });
                break;
            case "day":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return add(copy, {days: 1});
                });
                break;
            case "team":
                setDate(prevDate => {
                    let copy = new Date(prevDate);
                    return addDays(copy, numDaysToDisplayInTeamView);
                });
                break;
            default:
                alert("Sanity Check: Unrecognized view in ToolBar.js");
                break;
        }
    }


    // Display Logic ********
    let options = null;
    switch (view) {
        case "month":
            options = { year: 'numeric', month: 'long' };
            break;
        case "week":
            options = { year: 'numeric', month: 'long' };
            break;
        case "day":
            options = { year: 'numeric', month: 'long', day: 'numeric' };
            break;
        case "team":
            options = options = { year: 'numeric', month: 'long' };
            break;
        default:
            options = null;
            alert("Sanity Check: Unrecognized view in ToolBar.js");
            break;
    }

    const toolbarTitle = date.toLocaleDateString(undefined, options);

    return (
        <AppBar className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
                <Hidden smUp>
                    <Tooltip title={date.toDateString()} enterDelay={400} >
                        <IconButton color="inherit" onClick={todayButton}>
                            <TodayIcon />
                        </IconButton>
                    </Tooltip>
                </Hidden>
                <Hidden xsDown>
                    <TodayIcon className={classes.iconButton} />
                </Hidden>
                {/* <Hidden xsDown>
                    <Typography variant="h5" className={classes.title} >
                        Calendar
                    </Typography>
                </Hidden> */}
                <ButtonGroup className={classes.teamButtonGroup}>
                    <Button size="small" onClick={() => setView("month")}>Me</Button>
                    <TeamSelectDropdown 
                        numDaysToDisplayInTeamView={numDaysToDisplayInTeamView} 
                        setView={setView} 
                        teamList={teamList}
                        setSelectedTeamId={setSelectedTeamId}
                    />
                </ButtonGroup>
                <Hidden xsDown>
                    <Tooltip title={date.toDateString()} enterDelay={400} >
                        <Button variant="outlined" size="small" className={classes.iconButton} onClick={todayButton} >Today</Button>
                    </Tooltip>
                    <Tooltip title={"Previous " + view} enterDelay={400} >
                        <IconButton color="inherit" onClick={previousButton}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Next " + view} enterDelay={400} >
                        <IconButton color="inherit" className={classes.iconButton} onClick={nextButton}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Tooltip>
                </Hidden>
                <Typography variant="h5" color="textSecondary" className={classes.displayCurrent}>
                    {toolbarTitle}
                </Typography>

                {/* Component File */}
                <CalendarSettings setFirstDayOfWeek={setFirstDayOfWeek}></CalendarSettings>
                <FormControl>
                    <NativeSelect
                        value={view}
                        name="age"
                        onChange={handleViewChange}
                    >
                        <option value={"day"}>Day</option>
                        <option value={"week"}>Week</option>
                        <option value={"month"}>Month</option>
                    </NativeSelect>
                </FormControl>
            </Toolbar>
        </AppBar>
    );
}
