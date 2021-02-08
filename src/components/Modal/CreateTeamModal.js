import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ImagePicker } from '../Form/ImagePicker';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { useMutation } from '@apollo/client';
import { CREATE_TEAM_MUTATION, UPDATE_TEAM_MUTATION, ME_QUERY } from '../../utils/graphql';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


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
    padding: '0 16px 16px 16px',
    margin: 0,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: '100%', 
      width: '100%',
    },
  },
  spacer: {
    flexGrow: 1,
    textAlign: 'center',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textField: {
    margin: '16px 0 0 0',
    '& label.Mui-focused': {
      color: theme.palette.secondary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary.main,
      },
    },
  },
  distanceField: {
    flexGrow: 1,
  }
}));

var previousTeamId = null

export const CreateTeamModal = (props) => {

  const [file, setFile] = useState(null);

  const [createTeamMutation, { loading }] = useMutation(CREATE_TEAM_MUTATION, {
    update(store, { data: { createTeam } }) {
      const data = store.readQuery({
        query: ME_QUERY
      })
      const updatedTeamList = [createTeam, ...data.me.teamList]

      store.writeQuery({
        query: ME_QUERY,
        data: {
          me: {
            ...data.me,
            __typename: "User",
            teamList: updatedTeamList
          }
        }
      })
      props.handleClose();
      setState({
        name: "",
        private: false,
        description: "",
        profilePictureURL: ""
      });
    },
    onError(error) {
      console.log(error.message)
    }
  })

  const [updateTeamMutation, { loading: updateTeamLoading }] = useMutation(UPDATE_TEAM_MUTATION, {
    update(_, result) {
      // previousTeamId = null
      props.handleClose();
      setState({
        name: result.data.updateTeam.name,
        private: result.data.updateTeam.private,
        description: result.data.updateTeam.description,
        profilePictureURL: result.data.updateTeam.profilePictureURL,
      });
    },
    onError(error) {
      console.log(error.message)
    }
  })

  const classes = useStyles();

  const [state, setState] = useState({
    name: "",
    private: false,
    description: "",
    file: file,
  });
  
 const save = () => {
    var nameValid = state.name.length > 0;
    
    if (nameValid) {
      if(props.edit){
        var userInput = {
          input: {
            teamId: props.team.id,
            name: state.name,
            private: state.private,
            description: state.description,
            file: file
          }
        }
        updateTeamMutation({ variables: userInput })

      } else {
        var userInput = {
          input: {
            name: state.name,
            private: state.private,
            description: state.description,
            file: file
          }
        }
        createTeamMutation({ variables: userInput })
      }

    }
  }
  const cancel = () => {
    setState({
        name: "",
        private: false,
        description: "",
        profilePictureURL: ""
    });
    props.handleClose();
  }

  const handleChange = (prop) => (event) => {
      setState({ ...state, [prop]: String(event.target.value) });
  };
  const handleCheckbox = (prop) => (event) => {
    setState({ ...state, [prop]: event.target.checked });
  };

  useEffect(() => {
    if(props.edit && props.team && (previousTeamId !== props.team.id || state.name === "")){
      previousTeamId = props.team.id
      setState({
        name: props.team.name,
        private: props.team.private,
        description: props.team.description,
        profilePictureURL: props.team.profilePictureURL
    });
    }
  })

  const body = (
    <div className={classes.paper}>
      <Toolbar disableGutters>
        <Button onClick={cancel}>Cancel</Button>
        <Typography variant="h6" className={classes.spacer}>{props.edit ? "Edit Team" : "Create a Team"}</Typography>
        <Button onClick={save} color="primary" disabled={loading}>
          SAVE
          {(loading || updateTeamLoading) && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Button>
      </Toolbar>
      <form onSubmit={save}>
        <TextField 
          required 
          variant="outlined"
          fullWidth 
          className={classes.textField} 
          value={state.name} 
          onChange={handleChange("name")} 
          label="Name"
          error={state.name.length <= 0}
          helperText={state.name.length <= 0 ? 'Name Required' : ' '}
        />
        <Typography variant="body2" color='textSecondary'>All teams are public by default. Anyone can join a public team and view the team page. Users must request to join a private team and be accepted by an admin or owner from that team in order to view the team page.</Typography>

        <FormControlLabel
          control={<Switch checked={state.private} onChange={handleCheckbox("private")} name="private" />}
          label="Private"
        />
        <Typography variant="body2" color='textSecondary'>Team Image</Typography>
        <ImagePicker 
          preview={(props.edit && props.team) ? props.team.profilePictureURL : null}
          fileToUpload={file} 
          setFileToUpload={setFile} 
        />

        <TextField 
          required 
          variant="outlined"
          fullWidth 
          className={classes.textField} 
          value={state.description} 
          onChange={handleChange("description")} 
          label="Description"
          multiline={true}
          rowsMax={5}
          rows={3}
        />
      </form>
    </div>
  );
  return (
    <div>
      <Modal
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        className={classes.modal}
        open={props.openModal}
        onClose={props.handleClose}
        disableBackdropClick
        aria-labelledby="simple-modal-tditle"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}