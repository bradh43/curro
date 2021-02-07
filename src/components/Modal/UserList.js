import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { UserTile } from "../Profile/UserTile"
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({
  modal: {
    top: 48,
  },
  paper: {
    position: 'absolute',
    width: '40%',
    height: '75%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    padding: '0 16px 16px 16px',
    margin: 0,
    display: 'block',
    overflow: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: '100%', 
      width: '100%',
    },
    outline: 0,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  spacer: {
    flexGrow: 1,
    textAlign: 'center',
  },
  results: {
    marginTop: 64,
  },
  toolbar: {
    backgroundColor: 'inherit',
    flexGrow: 1,

  },
  toolbarDiv: {
    display: 'block',
    width: '38%',
    padding: 0,
    margin: 0,
    backgroundColor: 'inherit',
    minHeight: 64,
    zIndex: 1,
    position: 'fixed',
    marginLeft: -16,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  loadingResults: {
    margin: 'auto',
    marginTop: 80,
    marginBottom: 16,
    display: 'block',
    
  },

}));

var cacheUserList = []
var previousTeamId = null

export const UserListModal = (props) => {
  const classes = useStyles();
  
  // const handleConfirmDeleteOpen = () => {
  //   setOpenConfirmDelete(true);
  // };

  // const handleConfirmDeleteClose = () => {
  //   setOpenConfirmDelete(false);
  // };

  if(!props.loading && props.data && props.data.team){
    cacheUserList = [...props.data.team.adminList, ...props.data.team.memberList]
    previousTeamId = props.data.team.id
  }

  return (
    <div>
      <Modal
        open={props.openModal}
        onClose={props.handleClose}
        disableBackdropClick
        style={{display:'flex', alignItems:'center', justifyContent:'center'}}
      >
        <div style={classes.modalStyle} className={classes.paper}>
          <div className={classes.toolbarDiv}>
            <Toolbar disableGutters className={classes.toolbar}>
              <IconButton onClick={props.handleClose}>
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.spacer}>{props.title} </Typography>
            </Toolbar>
          </div>
          {props.loading ? <CircularProgress className={classes.loadingResults}/> : 
          <List className={classes.results}> 
            {(props.userList) && 
            (props.userList.length >= 1 ?
              props.userList.map((user) => (
                <UserTile key={"userTile-" + user.id} user={user} history={props.history} handleClose={props.handleClose}/>
              )) :
              <span>No Users Found</span> )
            }
            {/* TODO can remove this if render team member in team card instead */}
            {(props.data && props.data.team) ? 
            (props.data.team.adminList.length >= 1 ||  props.data.team.memberList.length >= 1 ?
              [...props.data.team.adminList, ...props.data.team.memberList].map((user) => (
                <UserTile key={props.data.team.id+"-userTile-" + user.id} user={user} history={props.history} handleClose={props.handleClose}/>
              )) :
              <span>No Users Found</span> ) :
              (cacheUserList.length >= 1?
                cacheUserList.map((user) => (
                  <UserTile key={previousTeamId+"-userTile-" + user.id} user={user} history={props.history} handleClose={props.handleClose}/>
                )) :
                <span>No Users Found</span> )
            }
          </List>
          }
          
        </div>
      </Modal>
    </div>
  );
}