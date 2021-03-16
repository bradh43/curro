import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth';
import { useMutation, gql } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Moment from 'moment';

export const CreateAccount = props => {
  var _isMounted = true

  const [imagePos, setImagePos] = useState(-1)

  const [values, setValues] = useState({
    first: '',
    firstError: false,
    firstErrorMessage: '',
    last: '',
    lastError: false,
    lastErrorMessage: '',
    username: '',
    usernameError: false,
    usernameErrorMessage: '',
    birthdateError: false,
    birthdateErrorMessage: '',
    email: '',
    password: '',
    showPassword: false,
    emailError: false,
    passwordError: false,
    emailErrorMessage: '',
    passwordErrorMessage: '',
    confirm: '',
    confirmError: false,
    confirmErrorMessage: '',
    errorMessage: ''
  });

  const [selectedDate, setSelectedDate] = useState(Moment);
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedYear, setSelectedYear] = useState(0)

  const [agree, setAgree] = React.useState(false);

  const handleTermsChange = (event) => {
    setAgree(event.target.checked);
  };

  const handleDateChange = (date) => {
    setSelectedDate(String(date));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
    selectedDate.set('month', event.target.value-1)
    setSelectedDate(selectedDate)
  } 
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value)
    selectedDate.set('date', event.target.value)
    setSelectedDate(selectedDate)
  } 
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
    selectedDate.set('year', event.target.value)
    setSelectedDate(selectedDate)
  } 


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: String(event.target.value) });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirm = (event) => {
    event.preventDefault();
  };

  const context = useContext(AuthContext)
  const { user } = useContext(AuthContext)

  const CREATE_USER_MUTATION = gql`
    mutation createUser($input: CreateUserInput!){
      createUser(input: $input){
        token
      }
    }
  `;

  const [createUserMutation, { loading }] = useMutation(CREATE_USER_MUTATION, {
    update(_, { data: { createUser: userData } }) {
      _isMounted = false
      context.login(userData)
      history.push({
        pathname: '/',
        state: { 
          welcome: true,
          calendar: false, 
        }
      })
    },
    onError(error) {
      if (_isMounted) {
        setValues({ ...values, emailError: false, passwordError: false, errorMessage: error.message });
      }
    }
  })

  const calculateAge = (date) => {
    return Moment().diff(date, 'years')
  }

  const imageList = ['DSC_0811.jpg', 'DSC_1021.jpg', 'DSC_5789.jpg', 'DSC_8474.jpg', 'DSC_9056.jpg', 'IWU-44.jpg', 'MiniMeet2017-58.jpg', '_DSC3252.jpg', '_DSC5131.jpg']

  useEffect(() => {
    if(user){
      history.push("/")
    }
    if(imagePos === -1){
      setImagePos(Math.floor(Math.random()*imageList.length))
      window.scrollTo(0, 0)
    }
  })

  const textColor = '#8AA0BD'
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: '16px',
      padding: '8px 16px 8px 16px',
      alignItems: 'center',
      flexWrap: 'wrap',
      [theme.breakpoints.down('md')]: {
        margin: '16px 0 16px 0',
        padding: '2px 4px 2px 4px',
      },
    },
    welcome: {
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: 500
    },
    content: {
      position: 'absolute',
      zIndex: 1,
      width: '100vw'
    },
    wrapper:{
      height: '100vh',
      width: '100vw',
      zIndex: -10,
      overflow: 'hidden',
      position: 'fixed',
      marginTop: -64,
      [theme.breakpoints.down('sm')]: {
        marginTop: -56,
      },
    },
    image: {
      height: '100%',
      width: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage: imagePos !== -1 ? 'url(https://currodevimages.s3.amazonaws.com/background-images/'+imageList[imagePos]+')' : '',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
      zIndex: -1,
      position: 'relative',
      filter: 'grayscale(55%)',
      opacity: 0.9,
      overflow: 'hidden',
    },
    logo: {
      margin: 'auto'
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
    alreadyAccount: {
      textAlign: 'center',
      flexGrow: 1,
      margin: '16px 0 0 0',
      color: "grey",
      fontWeight: 600,
    },
    errorMessage: {
      color: theme.palette.error.main,
    },
    login: {
      color: theme.palette.primary.main,
    },
    birthdateLabel: {
      marginTop: 16,
      marginBottom: 8,
    },
    textColor: {
      color: theme.palette.text.main,
    },
    link: {
      textDecoration: 'none',
    },
    agreeTerms: {
      display: 'inline-block',
      marginTop: 8,
      marginLeft: 8,
      width: 'calc(100% - 50px)',
    },
    agreeBox: {
      display: 'inline-block',
      verticalAlign: 'top',
    },
  }));

  const { history } = props;
  const classes = useStyles();

  const validateForm = (callback) => {

    var validAge = calculateAge(selectedDate) >= 13

    var firstErrorMessage = 'First Name is required'
    var lastErrorMessage = 'Last Name is required'
    var usernameErrorMessage = 'Username is required'
    var birthdateErrorMessage = validAge ? 'Birthdate is required' : 'Must be at least 13 years old to join'
    var emailErrorMessage = 'Invalid Email'
    var passwordErrorMessage = 'Password must have at least 1 lowercase, 1 uppercase, 1 number, 1 special, and at least 8 long'
    var confirmErrorMessage = 'Passwords must match'

    // Standard for validating email addresses
    // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
    var emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:+)\])$/;
    // password with 1 lower, 1 upper, 1 number, 1 special, and at least 8 long
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#^()_\-=+@$!%*?&])[A-Za-z\d#^()_\-=+@$!%*?&]{8,}$/;
    var emailValid = emailRegex.test(String(values.email).toLowerCase())
    var passwordValid = passwordRegex.test(values.password)
    var confirmValid = values.password === values.confirm
    var firstValid = values.first.length > 0
    var lastValid = values.last.length > 0
    var usernameValid = values.username.length > 0
    var birthdateValid = (selectedDate !== undefined) && validAge

    setValues({
      ...values,
      firstError: !firstValid, firstErrorMessage: firstErrorMessage,
      lastError: !lastValid, lastErrorMessage: lastErrorMessage,
      emailError: !emailValid, emailErrorMessage: emailErrorMessage,
      usernameError: !usernameValid, usernameErrorMessage: usernameErrorMessage,
      birthdateError: !birthdateValid, birthdateErrorMessage: !birthdateValid ? birthdateErrorMessage : '',
      passwordError: !passwordValid, passwordErrorMessage: passwordErrorMessage,
      confirmError: !confirmValid, confirmErrorMessage: confirmErrorMessage,
      errorMessage: agree ? '' : 'Must agree to Terms of Service and Privacy Policy to create an account'
    });

    if (emailValid && passwordValid && confirmValid && birthdateValid && usernameValid && firstValid && lastValid && agree) {
      callback()
    }
  }


  const createUser = () => {
    validateForm(() => {
      var birthdate = selectedDate.format('YYYY-MM-DD')
      
      var userInput = {
        input: {
          email: values.email.toLowerCase(),
          first: values.first,
          last: values.last,
          username: values.username,
          password: values.password,
          birthdate: birthdate
        }
      }
      createUserMutation({ variables: userInput })
    })
  };

  const submitForm = (event) => {
    event.preventDefault()
    createUser()
  }


  const existingUser = () => {
    history.push('login')
  }

  var getDaysInMonth = () => {
   return selectedDate.daysInMonth()
  }

  const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayList = [...Array(getDaysInMonth()).keys()]

  const upperBoundYear = parseInt(Moment().format('YYYY'))
  const lowerBoundYear = 1900

  const yearList = [...Array(upperBoundYear+1-lowerBoundYear).keys()]


  return (
    <div className={classes.content}>
      <div className={classes.wrapper}>
        <div className={classes.image}></div>      
      </div>
      <Container maxWidth="sm" className={classes.container}>
        <Card className={classes.root}>
          <CardContent>
            <div>
              <Avatar alt="Logo" src={process.env.PUBLIC_URL + '/assets/logo/logoPink192.png'} className={classes.logo}/>
              <Typography variant="h4" className={classes.welcome}>Create your account</Typography>
            </div>
            <form noValidate autoComplete="off" onSubmit={submitForm}>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="create-first"
                    className={classes.textField}
                    label="First Name"
                    fullWidth
                    size="small" 
                    required
                    helperText={values.firstError ? values.firstErrorMessage : ''}
                    onChange={handleChange('first')}
                    error={values.firstError}
                    variant="outlined" 
                    InputLabelProps={{
                      style: { color: textColor },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="create-last"
                    className={classes.textField}
                    label="Last Name"
                    fullWidth
                    size="small" 
                    required
                    helperText={values.lastError ? values.lastErrorMessage : ''}
                    onChange={handleChange('last')}
                    error={values.lastError}
                    variant="outlined" 
                    InputLabelProps={{
                      style: { color: textColor },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                id="create-email"
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
              <Typography variant="body1" color="textSecondary" className={`${classes.textColor} ${classes.birthdateLabel}`}>Birthday</Typography>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={6} sm={6}>
                  <TextField id="month-select" variant="outlined" error={values.birthdateErrorMessage ? true : false} value={selectedMonth} onChange={handleMonthChange} select fullWidth size="small">
                    <MenuItem value={0} disabled><span className={classes.textColor}>Month</span></MenuItem>
                    {monthList.map((month, value) => {
                      return <MenuItem value={value+1}>{month}</MenuItem>
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField id="day-select" variant="outlined" error={values.birthdateErrorMessage} value={selectedDay} onChange={handleDayChange} select fullWidth size="small">
                    <MenuItem value={0} disabled><span className={classes.textColor}>Day</span></MenuItem>
                    {dayList.map((day) => {
                      return <MenuItem value={day+1}>{day+1}</MenuItem>
                    })}
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField id="year-select" variant="outlined" error={values.birthdateErrorMessage} value={selectedYear} onChange={handleYearChange} select fullWidth size="small">
                  <MenuItem value={0} disabled><span className={classes.textColor}>Year</span></MenuItem>
                    {yearList.reverse().map((year) => {
                      return <MenuItem value={year+1900}>{year+1900}</MenuItem>
                    })}
                  </TextField>
                </Grid>
              </Grid>
              <Typography variant="caption" className={classes.errorMessage} style={{marginLeft: 14, marginTop: 4}}>{values.birthdateErrorMessage}</Typography>
              <Divider/>
              <TextField
                id="create-username"
                className={classes.textField}
                label="Username"
                fullWidth
                size="small" 
                required
                helperText={values.usernameError ? values.usernameErrorMessage : ''}
                onChange={handleChange('username')}
                error={values.usernameError}
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
                <InputLabel htmlFor="create-password" className={classes.textColor}>Password</InputLabel>
                <OutlinedInput
                  id="create-password"
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
                <FormHelperText id="create-confirm-error-message">{values.passwordError ? values.passwordErrorMessage : ''}</FormHelperText>
              </FormControl>
              <Typography variant="body2" color="textSecondary" className={classes.textColor}>Password must have 1 lowercase, 1 uppercase, 1 number, 1 special, and be at least 8 long</Typography>
              <FormControl
                variant="outlined"
                fullWidth
                size="small" 
                required
                error={values.confirmError}
                className={classes.textField}
              >
                <InputLabel htmlFor="create-confirm" className={classes.textColor}>Confirm Password</InputLabel>
                <OutlinedInput
                  id="create-confirm"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.confirm}
                  label="Confirm Password"
                  variant="outlined"
                  onChange={handleChange('confirm')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownConfirm}
                        edge="end"
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelwidth={70}
                />
                <FormHelperText id="create-confirm-error-message">{values.confirmError ? values.confirmErrorMessage : ''}</FormHelperText>
              </FormControl>
              <Checkbox
                checked={agree}
                onChange={handleTermsChange}
                className={classes.agreeBox}
              />
              <Typography variant="subtitle1" className={classes.agreeTerms}>I agree to the <a href={'https://curro.us/terms'} className={classes.link}>Terms of Service</a> and <a href={'https://curro.us/privacy'} className={classes.link}>Privacy Policy</a></Typography>
              <div>
                <Typography variant="subtitle1" className={classes.errorMessage}>{values.errorMessage}</Typography>
                <Button variant="contained" className={classes.textField} style={{borderRadius:'32px'}} color="primary" fullWidth size="large" onClick={createUser} disabled={loading}>
                  {loading ? <CircularProgress color="inherit" size={26} /> : <>Create Account</>}
                </Button>
                <div className={classes.alreadyAccount}>
                  <Link
                    component="button"
                    variant="body2"
                    color="textSecondary"
                    onClick={existingUser}
                  > 
                    <span className={classes.textColor}>Already have an account? </span><span className={classes.login}>Login</span>
                  </Link>  
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

      </Container>
    </div>);
}