import React from 'react';
import Typography from "@material-ui/core/Typography";

const ActivityInfoDisplay = ({activityInfoText}) => {
  return (
    <Typography variant="body1" component="p">
      {activityInfoText}
    </Typography>
  )
};

export default ActivityInfoDisplay;