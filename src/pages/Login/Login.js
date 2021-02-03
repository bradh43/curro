import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth';
import { useMutation, gql } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { Footer } from '../../components/Footer/Footer';


export const Login = props => {

  var _isMounted = true

  const location = props.location.state ? props.location.state.from.pathname.substring(1) : ''

  const [open, setOpen] = useState(location !== '');
  const [imagePos, setImagePos] = useState(-1)

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
    emailError: false,
    passwordError: false,
    emailErrorMessage: '',
    passwordErrorMessage: '',
    errorMessage: '',
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const context = useContext(AuthContext)

  const SIGNIN_USER_MUTATION = gql`
    mutation signIn($input: SignInInput!){
      signIn(input: $input){
        token
      }
    }
  `;
const [signinUserMutation, {loading }] = useMutation(SIGNIN_USER_MUTATION, {
  update(_, {data: {signIn: userData}}) {
    _isMounted = false
    context.login(userData)
    history.push({
      pathname: '/',
      state: { 
        welcome: false,
        calendar: true,
      }
    })
  },
  onError(error) {
    if(_isMounted){
      setValues({ ...values, emailError: false, passwordError: false, errorMessage: error.message });
    }
  }
})

  const imageList = ['DSC_0811.jpg', 'DSC_1021.jpg', 'DSC_5789.jpg', 'DSC_8474.jpg', 'DSC_9056.jpg', 'IWU-44.jpg', 'MiniMeet2017-58.jpg', '_DSC3252.jpg', '_DSC5131.jpg']

  useEffect(() => {
    if(imagePos === -1){
      setImagePos(Math.floor(Math.random()*imageList.length))
    }
    window.scrollTo(0, 0)
  })

  const textColor = '#8AA0BD'
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: 32,
      marginTop: -64,
      transform: 'translate(0%, 50%)',
      padding: '8px 16px 8px 16px',
      alignItems: 'center',
      flexWrap: 'wrap',  
      [theme.breakpoints.down('md')]: {
        margin: '-56px 0 0 0',
        padding: '2px 4px 2px 4px',
      },
      
    },
    container: {
      
    },
    cardContent: {
    },
    logo: {
      margin: 'auto'
    },
    welcome: {
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: 500
    },
    content: {
      position: 'absolute',
      zIndex: 1,
      width: '100vw',
    },
    wrapper:{
      height: '100vh',
      width: '100vw',
      zIndex: -10,
      overflow: 'hidden',
      position: 'absolute',
      marginTop: -64,
      [theme.breakpoints.down('sm')]: {
        marginTop: -56,
      },
    },
    image: {
      height: '100%',
      width: '100%',
      position: 'relative',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage: imagePos !== -1 ? 'url(https://currodevimages.s3.amazonaws.com/background-images/'+imageList[imagePos]+')' : '',
      zIndex: -1,
      filter: 'grayscale(55%)',
      opacity: 0.9,
      overflow: 'hidden',
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      margin: '16px 0 0 0',
      '& label.Mui-focused': {
        color: theme.palette.text.main,
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.text.main,
        },
      },
    },
    signUp: {
      margin: '32px auto 0px auto',
      borderRadius: '21px',
      display: 'flex',
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      backgroundColor: 'white',
      width: 112,
    },
    errorMessage: {
      color: theme.palette.error.main,
    },
    forgotPassword: {
      textAlign: 'center',
      flexGrow: 1,
      margin: '16px 0 16px 0',
      color: theme.palette.text.main,
    },
    footerContainer: {
      position: 'absolute',
      top: 'calc(100vh - 64px)',
      width: '100vw',
      zIndex: 1000,
    },
    textColor: {
      color: theme.palette.text.main,
    },
    snackBar: {
      position: 'absolute',
      top: 8,
    },
  }));

  const { history } = props;
  const classes = useStyles();

  const validateForm = (callback) => {

    var emailErrorMessage = 'Invalid Email'
    var passwordErrorMessage = 'Password is required'

    // Standard for validating email addresses
    // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
    var emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:+)\])$/;
    var emailValid = emailRegex.test(String(values.email).toLowerCase())
    var passwordValid = values.password.length > 0
  
    setValues({ ...values, emailError: !emailValid, passwordError: !passwordValid, emailErrorMessage: emailErrorMessage, passwordErrorMessage: passwordErrorMessage });

    if(emailValid && passwordValid) {
      callback()
    } 
  }

  const loginUser = (event) => {
    event.preventDefault();
    validateForm(() => {
      const userInput = {
        input: {
          email: String(values.email).toLowerCase(),
          password: String(values.password)
        }
      }
      signinUserMutation({ variables: userInput })
    })
  };

  const submitForm = (event) => {
    event.preventDefault()
    loginUser()
  }

  const newUser = () => {
    history.push('createAccount')
  }

  const forgotPassword = () => {
    console.log("TODO API call to forgot password")
  }

  return (
    <div className={classes.content}>
      <div className={classes.wrapper}>
        <div className={classes.image}></div>
      </div>
      { props.location.state ?
        <Snackbar className={classes.snackBar} open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert onClose={handleClose} severity="warning">
            Login to view {location} page
        </Alert>
        </Snackbar> : <></>}
      <Container maxWidth="sm" className={classes.container}>
        <Card className={classes.root}>
          <CardContent className={classes.cardContent}>
            <div>
              {/* {TODO add bigger logo here} */}
              <Avatar alt="Logo" src={process.env.PUBLIC_URL + '/assets/logo/logoPink192.png'} className={classes.logo}/>
              <Typography variant="h4" className={classes.welcome}>Welcome to Curro</Typography>
            </div>
            <form noValidate autoComplete="off" onSubmit={submitForm}>
              <TextField 
                id="login-email" 
                className={classes.textField} 
                label="Email" 
                fullWidth
                size="small" 
                required
                helperText={values.emailError ? values.emailErrorMessage : ''}
                onChange={handleChange('email')}
                error={values.emailError}
                variant="outlined" 
                InputLabelProps={{
                  style: { color: textColor },
                }}
              />
              <FormControl 
                variant="outlined" 
                fullWidth 
                size="small" 
                required 
                error={values.passwordError} 
                className={classes.textField} 
              >
                <InputLabel htmlFor="login-password" className={classes.textColor}>Password</InputLabel>
                <OutlinedInput
                  id="login-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  label="Password"
                  variant="outlined"
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelwidth={70}
                />
                <FormHelperText id="login-password-error-message">{values.passwordError ? values.passwordErrorMessage : ''}</FormHelperText>
              </FormControl>
              <div>
                <Typography variant="subtitle1" className={classes.errorMessage}>{values.errorMessage}</Typography>
                <Button variant="contained" className={classes.textField} style={{borderRadius:'21px'}} color="primary" fullWidth size="large" onClick={loginUser} disabled={loading} type="submit">
                  {loading ? <CircularProgress color="inherit" size={26}/> : <>Login</> } 
                </Button>
                <div className={classes.forgotPassword}>
                  <Link
                      component="button"
                      variant="body2"
                      color="textSecondary"
                      onClick={forgotPassword}
                    >
                      <span className={classes.textColor}>Forgot Password?</span>
                  </Link>  
                </div> 
                <Divider variant="middle" />
                <Button className={classes.signUp} variant="contained" color="inherit" size="medium" onClick={newUser}>Sign Up</Button>

              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
      <div className={classes.footerContainer}>
        <Footer history={history}/>
      </div>
    </div>);
}