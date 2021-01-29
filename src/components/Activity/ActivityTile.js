import React from 'react';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import { AllowedActivity } from './AllowedActivity';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

export const ActivityTile = props => {

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
    cardContent:{
      marginBottom: 0,
      paddingBottom: 0
    },
   
  }));
  
  const editActivity = (activity) => {
    props.setEditActivity(true)
    props.setEditActivityId(activity.id)
    props.setEditActivityValues({
      distanceValue: activity.distance.value ? activity.distance.value : 0,
      distanceUnit: activity.distance.unit.toLowerCase(),
      duration: TimeHelper.formatTimeString(activity.duration),
      equipmentId: activity.equipment.id ? activity.equipment.id : '',
      heartRate: activity.additionalInfo.averageHeartRate ? activity.additionalInfo.averageHeartRate : 0,
      elevationGain: activity.additionalInfo.elevationGain ? activity.additionalInfo.elevationGain : 0,
      calories: activity.additionalInfo.calories ? activity.additionalInfo.calories : 0
    })
    var selectedActivity = null
    for(var i=0; i<AllowedActivity.length; i++) {
      if(AllowedActivity[i].type.replace(/\s+/g, '_').toUpperCase() == activity.type){
        selectedActivity = AllowedActivity[i]
        break
      }
    }
    props.setSelectedActivity(selectedActivity)
    props.setOpenActivityDetailModal(true)
  }
  const classes = useStyles();

  return (
    <Card className={classes.card} >
      <CardHeader
        title={props.activity.type.replace(/_+/g, ' ')}
        style={{paddingBottom: '0px'}}
        action={
          props.edit === true ?
          <Tooltip title="Edit Activity" placement="top" enterDelay={400} >
            <IconButton onClick={() => editActivity(props.activity)}>
              <EditIcon />
            </IconButton>
          </Tooltip> 
          : <></>
        }
      />
      <CardContent className={classes.cardContent}>
        <Typography variant="body1" component="p">{props.activity.duration ? TimeHelper.formatTimeMs(props.activity.duration) : ""}</Typography>
        {
          props.activity.distance.value ? 
          <div>
            <Typography variant="body1" component="p">{props.activity.distance.value + ' ' + props.activity.distance.unit.toLowerCase()}</Typography>
            {
              props.activity.duration ? 
            <Typography variant="body1" component="p">{DistanceHelper.calculateAveragePace(props.activity.distance, props.activity.duration, props.activity.type)}</Typography>
              : <></>
            }
          </div>
          : <></>
        }
        <></>
      </CardContent>
    </Card>
    );
}