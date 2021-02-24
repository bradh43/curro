import React from 'react';
import {Activity, AllowedActivity} from './AllowedActivity';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import classnames from 'classnames';


type SelectActivityProps = {
  editActivityValues: object;
  handleClose: () => void;
  openModal: boolean;
  setEditActivity: (x: boolean) => void;
  setEditActivityValues: (x: object) => void;
  setOpenActivityDetailModal: (x: boolean) => void;
  setSelectedActivity: (x: Activity) => void;
}

export const SelectActivity: React.FC<SelectActivityProps> = ({
                                 editActivityValues,
                                 handleClose,
                                 openModal,
                                 setEditActivity,
                                 setEditActivityValues,
                                 setOpenActivityDetailModal,
                                 setSelectedActivity
                               }) => {
  const {activityOption, modal, paper, spacer} = useStyles();
  
  function ActivityOption({activity}: {activity: Activity}) {
    return (
      <Grid item xs={6}>
        <Button className={activityOption} fullWidth onClick={() => selectActivity(activity)}>
          <Typography variant="h6" title={'activityOption'}>{activity.type}</Typography>
        </Button>
      </Grid>
    );
  }
  
  const selectActivity = (activity: Activity) => {
    setEditActivity(false);
    setSelectedActivity(activity);
    setOpenActivityDetailModal(true);
    if (activity.defaultUnit) {
      setEditActivityValues({...editActivityValues, distanceUnit: activity.defaultUnit})
    }
  };
  
  return (
    <div>
      <Modal
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        open={openModal}
        onClose={handleClose}
        disableBackdropClick
        hideBackdrop
      >
        <div className={classnames(paper, modal)}>
          <Toolbar disableGutters>
            <Button onClick={handleClose} title={'cancelButton'}>Cancel</Button>
            <Typography variant="h6" className={spacer}>Select Activity</Typography>
            <span style={{width: '64px'}}/>
          </Toolbar>
          <Grid container spacing={1}>
            {AllowedActivity.map((activity) => <ActivityOption key={activity.type} activity={activity}/>)}
          </Grid>
        </div>
      </Modal>
    </div>
  );
};

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
  },
  spacer: {
    flexGrow: 1,
    textAlign: 'center',
  },
  activityOption: {
    height: '84px',
    backgroundColor: theme.palette.background.default,
  },
}));
