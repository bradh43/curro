import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


export const NoResults = () => {

  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start" className={classes.resultItem}>
        <ListItemText
          primary="No Notifications"
        />
      </ListItem>);
}

const useStyles = makeStyles((theme) => ({
  resultItem: {
    backgroundColor: "#fafafa",
  }, 
}));
