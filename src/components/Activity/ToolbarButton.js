import React from 'react';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

export const ToolbarButton = ({Icon, onClick, title}) => {
  return (
    <Tooltip title={title} placement={'right'} enterDelay={400}>
      <IconButton onClick={onClick}>
        <Icon />
      </IconButton>
    </Tooltip>
  )
};