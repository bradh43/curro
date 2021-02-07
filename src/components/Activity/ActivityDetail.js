import React from 'react';
import { useQuery, gql } from '@apollo/client';
import TimeHelper from '../../utils/TimeHelper'
import DistanceHelper from '../../utils/DistanceHelper'
import { makeStyles } from '@material-ui/core/styles';
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

export const ActivityDetail = (props) => {
  const classes = useStyles();
  var activityIndex = props.activityData.findIndex(activity => activity.id === props.editActivityId)

  const deleteActivity = () => {
    // remove activity from activities
    var activityDataCopy = [...props.activityData]
    if (activityIndex !== -1) {
      activityDataCopy.splice(activityIndex, 1)
      props.setActivityData(activityDataCopy)
    }

    // close the activity detail modal
    props.handleClose()

    // reset the edit activity default values
    props.setEditActivityDefaultValues()
  }

  const saveActivity = () => {
    if(props.editActivity) {
      // make a copy of the activities array
      var activitiesCopy = [...props.activityData]
      // update the element
      activitiesCopy[activityIndex] = {
        ...props.activityData[activityIndex],
        duration: props.editActivityValues.duration ? TimeHelper.getTotalMs(props.editActivityValues.duration) : 0,
        distance: {
          value: props.editActivityValues.distanceValue ? parseFloat(Math.abs(props.editActivityValues.distanceValue))
            .toFixed((props.editActivityValues.distanceUnit === 'yds' | props.editActivityValues.distanceUnit === 'm') ? 0 : 2) : 0,
          unit: props.editActivityValues.distanceUnit.toUpperCase()
        },
        equipment: {
          id: props.editActivityValues.equipmentId ? props.editActivityValues.equipmentId : '',
        },
        additionalInfo: {
          averageHeartRate: props.editActivityValues.averageHeartRate ? parseInt(props.editActivityValues.heartRate) : 0,
          elevationGain: props.editActivityValues.elevationGain ? parseInt(props.editActivityValues.elevationGain) : 0,
          calories: props.editActivityValues.calories ? parseInt(props.editActivityValues.calories) : 0
        }
      }
      //update the state
      props.setActivityData(activitiesCopy)

    } else {
      // generate a unique ID for the new activity
      var date = new Date();
      var id = date.getTime();

      // add new activity to the activities 
      props.setActivityData(
        [
          ...props.activityData,
          {
          id: id,
          activityId: props.activity.id,
          type: props.activity.type.toUpperCase(),
          duration: TimeHelper.getTotalMs(props.editActivityValues.duration),
          distance: {
            value: props.editActivityValues.distanceValue ? parseFloat(Math.abs(props.editActivityValues.distanceValue))
              .toFixed((props.editActivityValues.distanceUnit === 'yds' | props.editActivityValues.distanceUnit === 'm') ? 0 : 2) : 0,
            unit: props.editActivityValues.distanceUnit.toUpperCase()
          },
          equipmentId: props.editActivityValues.equipmentId,
          additionalInfo: {
            averageHeartRate: props.editActivityValues.heartRate ? parseInt(props.editActivityValues.heartRate) : 0,
            elevationGain: props.editActivityValues.elevationGain ? parseInt(props.editActivityValues.elevationGain) : 0,
            calories:props.editActivityValues.calories ? parseInt(props.editActivityValues.calories) : 0
          }
        }]
      )

      // close the select activity modal
      props.handleCloseSelect()
    }
    
    // close the activity detail modal
    props.handleClose()

    // reset the edit activity default values
    props.setEditActivityDefaultValues()

  };

  const goBack = () => {
    // reset the edit activity default values
    props.setEditActivityDefaultValues()
    //close the details modal
    props.handleClose()
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

  const { loading, error, data } = useQuery(ME_EQUIPMENT_QUERY);

  return (
    <div>
      {!loading && data && data.me ? 
      <Modal
        style={{display:'flex', alignItems:'center', justifyContent:'center'}}
        open={props.openModal}
        onClose={props.handleClose}
        disableBackdropClick
        hideBackdrop
      >
      <div style={classes.modalStyle} className={classes.paper}>
        <Toolbar disableGutters>
          {
            props.editActivity ?  
            <Tooltip title="Delete" placement="right" enterDelay={400}>
              <IconButton onClick={deleteActivity}>
                <DeleteForeverIcon/>
              </IconButton>
            </Tooltip> :
            <Tooltip title="Back" placement="right" enterDelay={400}>
              <IconButton onClick={goBack} >
                <ArrowBackIosIcon/>
              </IconButton>
            </Tooltip>
          }
          <Typography variant="h6" className={classes.spacer} >{props.activity.type + " Details"}</Typography>
          <Button onClick={saveActivity} color="secondary">Save</Button>
        </Toolbar>
        { props.activity.durationAllowed && data.me ? 
          <div className={classes.distanceField}>
            <Grid container spacing={1}>
              <Grid item xs>
              <TextField 
                label="HH:MM:SS.s" 
                variant="outlined"
                value={props.editActivityValues.duration}
                onChange={props.handleEditActivityChange('duration')}
                className={classes.inputField}
                fullWidth
              />
              </Grid>
              <Grid item xs>
                <Typography variant="body1" className={classes.timeDisplay} >{TimeHelper.formatTimeDisplay(props.editActivityValues.duration)}</Typography>
                <Typography variant="body1" className={classes.timeDisplay}>{(props.editActivityValues.distanceValue && props.editActivityValues.duration) ? ("("+DistanceHelper.calculateAveragePace({value: props.editActivityValues.distanceValue, unit: props.editActivityValues.distanceUnit}, TimeHelper.getTotalMs(props.editActivityValues.duration), props.activity.type) + ")") : ""}</Typography>
              </Grid>
            </Grid>
          </div>
          : <></>
        }
        { props.activity.distanceAllowed && data.me ? 
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
                  value={props.editActivityValues.distanceValue}
                  onChange={props.handleEditActivityChange('distanceValue')}
                  fullWidth
                />
              </Grid>
              <Grid item xs>
                <FormControl variant="outlined" className={classes.inputField} fullWidth>
                  <InputLabel id="distance-unit-select">Unit</InputLabel>
                  <Select
                    labelId="distance-unit-select"
                    id="distance-unit-select-id"
                    value={props.editActivityValues.distanceUnit}
                    onChange={props.handleEditActivityChange('distanceUnit')}
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
        { (props.activity.equipmentAllowed && !loading && data.me) && (
          <FormControl variant="outlined" fullWidth className={classes.inputField}>
            <InputLabel id="equipment-select">{props.activity.equipmentAllowed}</InputLabel>
            <Select
              labelId="equipment-select"
              id="equipment-select-id"
              value={props.editActivityValues.equipmentId}
              onChange={props.handleEditActivityChange('equipmentId')}
              label={props.activity.equipmentAllowed}
            >
              <MenuItem key="none" value=""><em>None</em></MenuItem>
              {data.me.equipmentList.map((equipment) => {
                if(equipment.type === props.activity.equipmentName){
                  return <MenuItem key={equipment.id} value={equipment.id}>{equipment.name}</MenuItem>
                }
              })}
            </Select>
        </FormControl>
        )}
        { props.activity.additionalInfoAllowed ? 
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
              value={props.editActivityValues.heartRate}
              onChange={props.handleEditActivityChange('heartRate')}
              fullWidth
            />
            { props.activity.equipmentAllowed && <TextField 
              label="Elevation Gain (ft)" 
              type="number" 
              inputProps={{
                min: 0,
                step: 5,
              }}
              variant="outlined"
              className={classes.inputField}
              value={props.editActivityValues.elevationGain}
              onChange={props.handleEditActivityChange('elevationGain')}
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
              value={props.editActivityValues.calories}
              onChange={props.handleEditActivityChange('calories')}
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
