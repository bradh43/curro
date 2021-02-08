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
import ActivityInfoDisplay from "./ActivityInfoDisplay";
import {EditActivity} from "./EditActivity";

export const ActivityTile = ({
                               activity,
                               setEditActivity,
                               setEditActivityId,
                               setEditActivityValues,
                               setSelectedActivity,
                               setOpenActivityDetailModal,
                               edit
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
  
  const editActivity = ({id, distance, duration, equipment, additionalInfo}) => {
    const {averageHeartRate, elevationGain, calories} = additionalInfo;
    setEditActivity(true)
    setEditActivityId(id)
    setEditActivityValues({
      distanceValue: distance.value ? distance.value : 0,
      distanceUnit: distance.unit.toLowerCase(),
      duration: TimeHelper.formatTimeString(duration),
      equipmentId: equipment && equipment.id ? equipment.id : '',
      heartRate: averageHeartRate ? averageHeartRate : 0,
      elevationGain: elevationGain ? elevationGain : 0,
      calories: calories ? calories : 0
    })
    var selectedActivity = null
    for (var i = 0; i < AllowedActivity.length; i++) {
      if (AllowedActivity[i].type.replace(/\s+/g, '_').toUpperCase() == activity.type) {
        selectedActivity = AllowedActivity[i]
        break
      }
    }
    setSelectedActivity(selectedActivity)
    setOpenActivityDetailModal(true)
  }
  const {card, cardContent} = useStyles();
  
  const {duration, distance, type} = activity;
  const {value, unit} = distance;
  
  return (
    <Card className={card}>
      <CardHeader
        title={type.replace(/_+/g, ' ')}
        style={{paddingBottom: '0px'}}
        action={
          edit &&
            <EditActivity onClick={() => editActivity(activity)}/>
        }
      />
      <CardContent className={cardContent}>
        <ActivityInfoDisplay activityInfoText={duration ? TimeHelper.formatTimeMs(duration) : ""}/>
        {
          value &&
            <div>
              <ActivityInfoDisplay activityInfoText={value + ' ' + unit.toLowerCase()}/>
              {
                duration &&
                  <ActivityInfoDisplay activityInfoText={DistanceHelper.calculateAveragePace(distance, duration, type)}/>
              }
            </div>
        }
      </CardContent>
    </Card>
  );
}