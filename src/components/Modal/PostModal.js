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
import { PostCard } from '../Post/PostCard';

export const PostModal = (props) => {

  const useStyles = makeStyles((theme) => ({
    paper: { 
      width: '35%',
      padding: 0,
      borderRadius: 16,
      [theme.breakpoints.down('md')]: {
        width: '100%',
        borderRadius: 0,
        marginLeft: 8,
        marginRight: 8,
      },
    },
    content: {
      width: '100%',
      height: '100%',
      padding: 0,
    },
  }));

  const classes = useStyles();
  const { history } = props;

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
        <DialogContent className={classes.content}>
          <PostCard post={props.post} isCommenting={props.isCommenting} loading={props.loading} openEditPostModal={props.openEditPostModal} setEditPost={props.setEditPost} history={history}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}