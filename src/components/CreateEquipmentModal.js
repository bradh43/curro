import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { useMutation, gql } from '@apollo/client';


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
}));
var _isMounted = false;
export const CreateEquipmentModal = (props) => {
  const UPDATE_USER_MUTATION = gql`
  mutation updateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
          id
          email
          first
          last
          bio
          profilePictureURL
          
        }
      }
    `;
  const [updateUserMutation, { loading, error, data }] = useMutation(UPDATE_USER_MUTATION, {
    update(cache, { data: { updateUser: user } }) {
      props.handleClose();

    },
    onError(error) {
      console.log(error)
      console.log(error.message)
    }
  })

  const classes = useStyles();
  const [state, setState] = React.useState({
    name: "",
    type: props.type,
    limit: "",
  });
  
 const save = () => {
    var nameValid = state.name.length > 0;
    var limitValid = !(isNaN(parseInt(state.limit)) || parseInt(state.limit) <= 0);
    
    if (nameValid && limitValid) {
      var userInput = {
        input: {
          userId: props.data.me.id,
          first: state.first,
          last: state.last,
          username: state.username,
          bio: state.bio,
          profilePictureURL: state.profilePictureURL
        }

      }
      updateUserMutation({ variables: userInput })
      _isMounted = false
      window.location.reload(true);

    }
  }
  const cancel = () => {
    setState({
        name: "",
        type: props.type,
        limit: "",
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
        <Typography variant="h6" className={classes.spacer}>{"Add " + props.type}</Typography>
        <Button onClick={save} color="primary" disabled={loading}>
          SAVE
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </Button>
      </Toolbar>
      <form onSubmit={save}>
        <TextField required id="standard-basic" fullWidth className={classes.textField} value={state.name} onChange={handleChange('name')} label="Name"
          error={state.name.length <= 0}
          helperText={state.name.length <= 0 ? 'Name Required' : ' '}
        />
        <TextField required id="standard-basic" fullWidth className={classes.textField} value={state.limit} onChange={handleChange('limit')} label="Limit"
          error={isNaN(parseInt(state.limit)) || parseInt(state.limit) <= 0}
          helperText={isNaN(parseInt(state.limit)) || parseInt(state.limit) <= 0 ? 'Invalid Limit' : ' '}
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