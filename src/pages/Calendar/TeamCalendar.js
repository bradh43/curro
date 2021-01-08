import React, { useEffect, useState } from 'react';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { ToolBar } from './ToolBar';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql, useQuery } from '@apollo/client';
import { WelcomeModal } from '../../components/Modal/WelcomeModal';
import { TeamNavBar } from '../../components/Calendar/TeamNavBar';

const useStyles = makeStyles((theme) => ({
    addFab: {
        position: 'fixed',
        bottom: 16,
        right: 16,
    },
    root: {
        flexGrow: 1,
    }
}));

export const TeamCalendar = (props) => {
    const classes = useStyles();
    const { history, location } = props;

    const [welcome, setWelcome] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const { teamid } = props.match.params
    console.log(teamid)


    useEffect(() => {
        // Open Welcome modal if react router passes welcome as true
        if(location.state && location.state.welcome){
            setWelcome(location.state.welcome)
            // make sure only see welcome modal once
            location.state.welcome = false
        }
    })

   

    return (
        <div className={classes.root}>
            <TeamNavBar />

            Team Calendar Display
            <NewActivityModal openModal={openModal} handleClose={() => setOpenModal(false)} />
            <span className={classes.addFab}>
                <Fab color="primary" aria-label="add" onClick={() => setOpenModal(true)}>
                    <AddIcon />
                </Fab>
            </span>
            <WelcomeModal open={welcome} handleClose={() => setWelcome(false)}/>
        </div>);
}