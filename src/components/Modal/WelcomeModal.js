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

export const WelcomeModal = (props) => {

  const useStyles = makeStyles((theme) => ({
    modal: {
      width: '35%',
      [theme.breakpoints.down('md')]: {
        width: '80%',
      },
    },
    logo: {
      margin: 'auto',
    },
    welcome: {
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: 500,
      marginBottom: 16,
    },
    button: {
      marginTop: 16,
      marginBottom: 48,
      borderRadius: 21,
    },
    closeButton: {
      
    },
    spacer: {
      flexGrow: 1,
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
        {/* <DialogTitle id="alert-dialog-title">Welcome to Curro</DialogTitle> */}
        <DialogContent>
          <div style={{display: 'flex'}}>
            <div className={classes.spacer}/>
            <IconButton onClick={props.handleClose} className={classes.closeButton}>
              <CloseIcon />
            </IconButton>
          </div>
          <Avatar alt="Logo" src={process.env.PUBLIC_URL + '/assets/logo/logoPink192.png'} className={classes.logo}/>
          <Typography variant="h4" className={classes.welcome}>Welcome to Curro</Typography>
          <DialogContentText id="alert-dialog-description">
            Thanks for joining Curro! To get started try editing your profile, joining a team, and searching or inviting users you might know.  
          </DialogContentText>
          <Button  variant="contained" onClick={props.handleClose} className={classes.button} color="primary" fullWidth size="large">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}