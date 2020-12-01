import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ImagePicker } from './Form/ImagePicker';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_MUTATION } from "../utils/graphql";


const useStyles = makeStyles((theme) => ({
  modal: {
    top: 48,
    overflow: 'hidden'
  },
  paper: {
    position: 'absolute',
    width: '40%',
    height: '98%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    padding: '0 16px 16px 16px',
    margin: 0,
    overflow: 'scroll',
    overflowX: 'hidden',
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
  or: {
    textAlign: 'center',
    display: 'block',
    paddingTop: 4,
    marginBottom: -16,
  }
}));
var _isMounted = false;
export const EditProfileModal = (props) => {

  const [file, setFile] = useState(null);

  const [updateUserMutation, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    update(_, { data: { updateUser: user } }) {
      console.log(user)
      props.handleClose();
      window.location.reload(true);

    },
    onError(error) {
      console.log(error)
      console.log(error.message)
    }
  })

  const classes = useStyles();
  const [state, setState] = React.useState({
    first: "",
    last: "",
    username: "",
    email: "",
    bio: "",
    profilePictureURL: ""
  });

  if (props.openModal && !props.loading && props.data.me && !_isMounted) {
    _isMounted = true;
    setState({
      first: props.data.me.first,
      last: props.data.me.last,
      username: props.data.me.username,
      email: props.data.me.email,
      file: file,
      bio: props.data.me.bio,
      profilePictureURL: props.data.me.profilePictureURL
    });
  }
  // Standard for validating email addresses
  // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
  var emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:+)\])$/;
  const save = () => {
    var firstValid = state.first.length > 0;
    var lastValid = state.last.length > 0;
    var usernameValid = state.username.length > 0;
    var emailValid = emailRegex.test(state.email.toLowerCase());
    // TODO make private actually hooked up to a real variable with user input
    if (firstValid && lastValid && usernameValid && emailValid) {
      var userInput = {
        input: {
          first: state.first,
          last: state.last,
          username: state.username,
          bio: state.bio,
          file: {file},
          profilePictureURL: file ? '' : state.profilePictureURL,
          private: false,
        }

      }
      console.log(userInput)
      updateUserMutation({ variables: userInput })
      _isMounted = false
    }
  }
  const cancel = () => {
    setState({
      first: props.data.me.first,
      last: props.data.me.last,
      username: props.data.me.username,
      email: props.data.me.email,
      bio: props.data.me.bio,
      profilePictureURL: props.data.me.profilePictureURL
    });
    _isMounted = false
    props.handleClose();
  }

  const handleChange = (prop) => (event) => {
    setState({ ...state, [prop]: String(event.target.value) });
  };

  const body = (
    <div className={classes.paper}>
      <Toolbar disableGutters>
        <Button onClick={cancel}>Cancel</Button>
        <Typography variant="h6" className={classes.spacer}>Edit Profile</Typography>
        <Button onClick={save} color="primary" disabled={loading}>
          SAVE
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Button>
      </Toolbar>
      <form onSubmit={save}>
        <TextField required fullWidth className={classes.textField} value={state.first} onChange={handleChange('first')} label="First Name"
          error={state.first.length <= 0}
          helperText={state.first.length <= 0 ? 'First Name Required' : ' '}
        />
        <TextField required fullWidth className={classes.textField} value={state.last} onChange={handleChange('last')} label="Last Name"
          error={state.last.length <= 0}
          helperText={state.last.length <= 0 ? 'Last Name Required' : ' '}
        />
        <TextField required fullWidth className={classes.textField} value={state.username} onChange={handleChange('username')} label="Username"
          error={state.username.length <= 0}
          helperText={state.username.length <= 0 ? 'Username Required' : ' '}
        />
        {/* <TextField required id="standard-basic" fullWidth className={classes.textField} value={state.email} onChange={handleChange('email')} label="email"
          error={!emailRegex.test(state.email)}
          helperText={!emailRegex.test(state.email) ? 'Invalid Email' : ' '}
        /> */}
        <Typography variant="body2" color='textSecondary'>Profile Image</Typography>
        <ImagePicker 
          fileToUpload={file} 
          setFileToUpload={setFile} 
          onSuccess={() => setState({...state, profilePictureURL: ''})} 
          rounded={true}
        />
        <Typography variant="h6" className={classes.or}>OR</Typography>
        <TextField fullWidth className={classes.textField} value={state.profilePictureURL} onChange={handleChange('profilePictureURL')} label="Profile Picture URL" 
          helperText={' '}
        />
        <TextField variant="outlined" fullWidth className={classes.textField} value={state.bio} multiline={true} rowsMax={5} rows={3} onChange={handleChange('bio')} label="Bio" />
      </form>
    </div>
  );

  return (
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
   
  );
}