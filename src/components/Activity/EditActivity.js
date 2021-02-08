import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";

export const EditActivity = ({onClick}) => {
  return (
    <Tooltip title="Edit Activity" placement="top" enterDelay={400}>
      <IconButton onClick={onClick}>
        <EditIcon/>
      </IconButton>
    </Tooltip>
  )
};