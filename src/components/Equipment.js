import React from 'react';
import LinearWithValueLabel from "./LinearWithValueLabel"
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DistanceHelper from "../utils/DistanceHelper";

export default function Equipment(props) {
    const useStyles = makeStyles((theme) => ({
      button: {
        position: "absolute",
        right: 26,
      },
    }))
      
    const handleOpenEditEquipment = () => {
      props.setEditEquipmentData(props.data)
      props.setOpenEquipmentModal(true)
    };
    
    var distance = {value: props.data.usage.value, unit: props.data.usage.unit};
    var usageValue = DistanceHelper.convertDistanceToUnit(distance, props.data.limit.unit)
    
    const classes = useStyles();

    return (
      <React.Fragment>
        <ListItem style={{paddingBottom: 0}}>
          <ListItemText 
            primary={props.name} 
            secondary={Math.round(usageValue*100)/100 + " " + (props.data.limit.unit).toLowerCase() + " / " + props.capacity + " " + props.data.limit.unit.toLowerCase()} 
          /> 
          {props.edit && <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" onClick={handleOpenEditEquipment}>
              <EditIcon fontSize="small"/>
            </IconButton>
          </ListItemSecondaryAction>
          }
        </ListItem>
        <ListItem style={{paddingRight: 0, paddingTop: 0}}>
          <LinearWithValueLabel progress={usageValue < props.capacity ? Math.round(100 * parseFloat(usageValue) / parseFloat(props.capacity)) : 100}/>
        </ListItem>
      </React.Fragment>
      
    );
}