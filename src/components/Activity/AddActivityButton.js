import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';

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

export const AddActivityButton = ({openSelectActivity}) => {
  const {card, cardContent, addButton} = useStyles();

  return (
    <Card className={card}>
      <CardContent className={cardContent}>
        <IconButton title={'openIcon'} className={addButton} onClick={openSelectActivity}>
          <AddCircleOutlineIcon style={{height: '64px', width: '64px'}} />
        </IconButton>
        <Typography variant="h6" >Add Activity</Typography>
      </CardContent>
    </Card>
    );
};

AddActivityButton.propTypes = {
  openSelectActivity: PropTypes.func
};

