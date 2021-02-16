import React from 'react';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import {AllowedActivity} from './AllowedActivity';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

export const ActivityTile = ({
                               activity,
                               edit,
                               setEditActivity,
                               setEditActivityId,
                               setEditActivityValues,
                               setOpenActivityDetailModal,
                               setSelectedActivity
                             }) => {
  
  const useStyles = makeStyles((theme) => ({
    card: {
      width: '100%',
      height: '100%',
      marginBottom: 0,
      backgroundColor: theme.palette.background.main,
      "&:last-child": {
        paddingBottom: 0
      }
    },
    cardContent: {
      marginBottom: 0,
      paddingBottom: 0
    },
    
  }));
  
  const editActivity = ({id, distance, duration, additionalInfo, type, equipment}) => {
    const {averageHeartRate, elevationGain, calories} = additionalInfo;
    setEditActivity(true);
    setEditActivityId(id);
    setEditActivityValues({
      distanceValue: distance.value ? distance.value : 0,
      distanceUnit: distance.unit.toLowerCase(),
      duration: TimeHelper.formatTimeString(duration),
      equipmentId: equipment && equipment.id ? equipment.id : '',
      heartRate: averageHeartRate ? averageHeartRate : 0,
      elevationGain: elevationGain ? elevationGain : 0,
      calories: calories ? calories : 0
    });
    let selectedActivity = null;
    for (let i = 0; i < AllowedActivity.length; i++) {
      if (AllowedActivity[i].type.replace(/\s+/g, '_').toUpperCase() === type) {
        selectedActivity = AllowedActivity[i];
        break
      }
    }
    setSelectedActivity(selectedActivity);
    setOpenActivityDetailModal(true);
  };
  const {card, cardContent} = useStyles();
  const {type, duration, distance} = activity;
  
  return (
    <Card className={card}>
      <CardHeader
        title={type.replace(/_+/g, ' ')}
        style={{paddingBottom: '0px'}}
        action={
          edit &&
            <Tooltip title="Edit Activity" placement="top" enterDelay={400}>
              <IconButton onClick={() => editActivity(activity)}>
                <EditIcon/>
              </IconButton>
            </Tooltip>
        }
      />
      <CardContent className={cardContent}>
        <Typography variant="body1" component="p">
          {duration ? TimeHelper.formatTimeMs(duration) : ""}
        </Typography>
        {
          distance.value &&
            <div>
              <Typography variant="body1" component="p">
                {distance.value + ' ' + distance.unit.toLowerCase()}
              </Typography>
              {
                duration &&
                  <Typography variant="body1" component="p">
                    {DistanceHelper.calculateAveragePace(distance, duration, type)}
                  </Typography>
              }
            </div>
        }
        <></>
      </CardContent>
    </Card>
  );
};

ActivityTile.propTypes = {
  activity: PropTypes.object,
  edit: PropTypes.bool,
  setEditActivity: PropTypes.func,
  setEditActivityId: PropTypes.func,
  setEditActivityValues: PropTypes.func,
  setOpenActivityDetailModal: PropTypes.func,
  setSelectedActivity: PropTypes.func
};