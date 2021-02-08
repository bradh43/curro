import React from 'react';
import {useQuery, gql} from '@apollo/client';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {ToolbarButton} from "./ToolbarButton";

const useStyles = makeStyles((theme) => ({
  modal: {
    top: 48,
  },
  paper: {
    position: 'absolute',
    width: '40%',
    height: '98%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    padding: '0 8px 8px 8px',
    margin: 0,
    overflow: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: '100%',
      width: '100%',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: '16px 0 0 0',
    '& label.Mui-focused': {
      color: theme.palette.text.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.text.main,
      },
    },
  },
  spacer: {
    flexGrow: 1,
    textAlign: 'center',
  },
  inputField: {
    marginBottom: 16,
    '& label.Mui-focused': {
      color: theme.palette.text.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.text.main,
      },
    },
  },
  distanceField: {
    flexGrow: 1,
  },
  timeDisplay: {
    textAlign: 'center',
    lineHeight: '28px'
  }
  
}));

export const ActivityDetail = ({
                                 activity,
                                 activityData,
                                 setActivityData,
                                 editActivityId,
                                 setEditActivityDefaultValues,
                                 editActivity,
                                 editActivityValues,
                                 handleEditActivityChange,
                                 handleClose,
                                 handleCloseSelect,
                                 openModal
                               }) => {
  const classes = useStyles();
  var activityIndex = activityData.findIndex(activity => activity.id === editActivityId)
  
  const deleteActivity = () => {
    // remove activity from activities
    var activityDataCopy = [...activityData]
    if (activityIndex !== -1) {
      activityDataCopy.splice(activityIndex, 1)
      setActivityData(activityDataCopy)
    }
    
    // close the activity detail modal
    handleClose()
    
    // reset the edit activity default values
    setEditActivityDefaultValues()
  }
  
  const saveActivity = () => {
    const {duration, distanceValue, distanceUnit, equipmentId, heartRate,
      averageHeartRate, elevationGain, calories} = editActivityValues;
    if (editActivity) {
      // make a copy of the activities array
      var activitiesCopy = [...activityData]
      // update the element
      activitiesCopy[activityIndex] = {
        ...activityData[activityIndex],
        duration: duration ? TimeHelper.getTotalMs(duration) : 0,
        distance: {
          value: distanceValue ? parseFloat(Math.abs(distanceValue))
            .toFixed((distanceUnit === 'yds' || distanceUnit === 'm') ? 0 : 2) : 0,
          unit: distanceUnit.toUpperCase()
        },
        equipment: {
          id: equipmentId ? equipmentId : '',
        },
        additionalInfo: {
          averageHeartRate: averageHeartRate ? parseInt(heartRate) : 0,
          elevationGain: elevationGain ? parseInt(elevationGain) : 0,
          calories: calories ? parseInt(calories) : 0
        }
      }
      //update the state
      setActivityData(activitiesCopy)
      
    } else {
      // generate a unique ID for the new activity
      var date = new Date();
      var id = date.getTime();
      
      // add new activity to the activities 
      setActivityData(
        [
          ...activityData,
          {
            id: id,
            activityId: activity.id,
            type: activity.type.toUpperCase(),
            duration: TimeHelper.getTotalMs(duration),
            distance: {
              value: distanceValue ? parseFloat(Math.abs(distanceValue))
                .toFixed((distanceUnit === 'yds' | distanceUnit === 'm') ? 0 : 2) : 0,
              unit: distanceUnit.toUpperCase()
            },
            equipmentId: equipmentId,
            additionalInfo: {
              averageHeartRate: heartRate ? parseInt(heartRate) : 0,
              elevationGain: elevationGain ? parseInt(elevationGain) : 0,
              calories: calories ? parseInt(calories) : 0
            }
          }]
      )
      
      // close the select activity modal
      handleCloseSelect()
    }
    
    // close the activity detail modal
    handleClose()
    
    // reset the edit activity default values
    setEditActivityDefaultValues()
    
  };
  
  const goBack = () => {
    // reset the edit activity default values
    setEditActivityDefaultValues()
    //close the details modal
    handleClose()
  }
  
  const ME_EQUIPMENT_QUERY = gql`
    query {
      me {
        id
        equipmentList{
          id
          name
          type
          usage{
            value
            unit
          }
          limit {
            value
            unit
          }
          active
          createdAt
        }
      }
    }
  `;
  
  const {loading, error, data} = useQuery(ME_EQUIPMENT_QUERY);
  
  return (
    <div>
      {!loading && data && data.me ?
        <Modal
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          open={openModal}
          onClose={handleClose}
          disableBackdropClick
          hideBackdrop
        >
          <div style={classes.modalStyle} className={classes.paper}>
            <Toolbar disableGutters>
              {
                editActivity
                  ? <ToolbarButton Icon={DeleteForeverIcon} onClick={deleteActivity} title={'Delete'}/>
                  : <ToolbarButton Icon={ArrowBackIosIcon} onClick={goBack} title={'Back'}/>
              }
              <Typography variant="h6" className={classes.spacer}>{activity.type + " Details"}</Typography>
              <Button onClick={saveActivity} color="secondary">Save</Button>
            </Toolbar>
            {activity.durationAllowed && data.me ?
              <div className={classes.distanceField}>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <TextField
                      label="HH:MM:SS.s"
                      variant="outlined"
                      value={editActivityValues.duration}
                      onChange={handleEditActivityChange('duration')}
                      className={classes.inputField}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1"
                                className={classes.timeDisplay}>{TimeHelper.formatTimeDisplay(editActivityValues.duration)}</Typography>
                    <Typography variant="body1"
                                className={classes.timeDisplay}>{(editActivityValues.distanceValue && editActivityValues.duration) ? ("(" + DistanceHelper.calculateAveragePace({
                      value: editActivityValues.distanceValue,
                      unit: editActivityValues.distanceUnit
                    }, TimeHelper.getTotalMs(editActivityValues.duration), activity.type) + ")") : ""}</Typography>
                  </Grid>
                </Grid>
              </div>
              : <></>
            }
            {activity.distanceAllowed && data.me ?
              <div className={classes.distanceField}>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <TextField
                      label="Distance"
                      type="number"
                      inputProps={{
                        min: 0.000,
                        step: 0.001,
                      }}
                      variant="outlined"
                      className={classes.inputField}
                      value={editActivityValues.distanceValue}
                      onChange={handleEditActivityChange('distanceValue')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControl variant="outlined" className={classes.inputField} fullWidth>
                      <InputLabel id="distance-unit-select">Unit</InputLabel>
                      <Select
                        labelId="distance-unit-select"
                        id="distance-unit-select-id"
                        value={editActivityValues.distanceUnit}
                        onChange={handleEditActivityChange('distanceUnit')}
                        label="Distance"
                      >
                        <MenuItem value={"mi"}>mi</MenuItem>
                        <MenuItem value={"km"}>km</MenuItem>
                        <MenuItem value={"m"}>m</MenuItem>
                        <MenuItem value={"yds"}>yds</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              : <></>
            }
            {(activity.equipmentAllowed && !loading && data.me) && (
              <FormControl variant="outlined" fullWidth className={classes.inputField}>
                <InputLabel id="equipment-select">{activity.equipmentAllowed}</InputLabel>
                <Select
                  labelId="equipment-select"
                  id="equipment-select-id"
                  value={editActivityValues.equipmentId}
                  onChange={handleEditActivityChange('equipmentId')}
                  label={activity.equipmentAllowed}
                >
                  <MenuItem key="none" value=""><em>None</em></MenuItem>
                  {data.me.equipmentList.map((equipment) => {
                    if (equipment.type === activity.equipmentName) {
                      return <MenuItem key={equipment.id} value={equipment.id}>{equipment.name}</MenuItem>
                    }
                  })}
                </Select>
              </FormControl>
            )}
            {activity.additionalInfoAllowed ?
              <div>
                <Typography variant="h6" className={classes.inputField}>Additional Information</Typography>
                <TextField
                  label="Heart Rate"
                  type="number"
                  inputProps={{
                    min: 0,
                    step: 1,
                  }}
                  variant="outlined"
                  className={classes.inputField}
                  value={editActivityValues.heartRate}
                  onChange={handleEditActivityChange('heartRate')}
                  fullWidth
                />
                {activity.equipmentAllowed && <TextField
                  label="Elevation Gain (ft)"
                  type="number"
                  inputProps={{
                    min: 0,
                    step: 5,
                  }}
                  variant="outlined"
                  className={classes.inputField}
                  value={editActivityValues.elevationGain}
                  onChange={handleEditActivityChange('elevationGain')}
                  fullWidth
                />}
                <TextField
                  label="Calories"
                  type="number"
                  inputProps={{
                    min: 0,
                    step: 10,
                  }}
                  variant="outlined"
                  className={classes.inputField}
                  value={editActivityValues.calories}
                  onChange={handleEditActivityChange('calories')}
                  fullWidth
                />
              </div>
              : <></>
            }
          </div>
        </Modal> : <></>}
    </div>
  );
}
