import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';



export const AddActivityButton = props => {

  const useStyles = makeStyles((theme) => ({
    card: {
      width: '100%',
      height: '100%',
      boxShadow: 'none',
    },
    cardContent:{
      textAlign: 'center',
      height: '100%',
      width: '100%',
    },
    addButton: {
      width: 84,
      height: 84,
      color: theme.palette.text.main,
      backgroundColor: 'inherit',
      marginTop: '16px',
    },
   
  }));
  
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <IconButton className={classes.addButton} onClick={() => props.openSelectActivity()}>
          <AddCircleOutlineIcon style={{height: '64px', width: '64px'}} />
        </IconButton>
        <Typography variant="h6" >Add Activity</Typography>
      </CardContent>
    </Card>
    );
}