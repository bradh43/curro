import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export const PostModal = (props) => {

  const useStyles = makeStyles((theme) => ({
    modal: {
      width: '35%',
      [theme.breakpoints.down('md')]: {
        width: '80%',
      },
    },
    paper: { 
      borderRadius: 16
    }
  }));

  const classes = useStyles();

  return (
    <div>
      <Dialog
        classes={{paper: classes.paper}}
        maxWidth={"xs"}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          Post
        </DialogContent>
      </Dialog>
    </div>
  );
}