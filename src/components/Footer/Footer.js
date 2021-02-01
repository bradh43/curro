import React, { useContext, useEffect, useState } from 'react';
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
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';


export const Footer = (props) => {
  const useStyles = makeStyles((theme) => ({
    logo: {
      marginTop: 32,
    },
    textButton: {
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    linkButtons: {
      width: '100vw',
      maxWidth: 464,
      margin: 'auto',
      marginTop: 8,
      marginBottom: 32,
    },
  }));

  const classes = useStyles();

  const { history } = props;


  return (
  <div className="footer">
    <Button onClick={() => history.push('/calendar')} className={classes.logo}>
      <Avatar alt="Logo" src={process.env.PUBLIC_URL + '/assets/logo/logoPink192.png'}/>
    </Button>
    <div className={classes.linkButtons}>
     <Hidden smDown>
        <Grid 
          container
          direction="row"
          justify="space-evenly"
        >
          <Grid item>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/login')}>Login</Typography>
          </Grid>
          <Grid item>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/about')}>About Us</Typography>
          </Grid>
          <Grid item>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/privacy')}>Privacy Policy</Typography>
          </Grid>
          <Grid item>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/terms')}>Terms of Service</Typography>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <Grid 
          container
          direction="row"
          justify="space-evenly"
        >
          <Grid item xs={12}>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/login')}>Login</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/about')}>About Us</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/privacy')}>Privacy Policy</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'overline'} className={classes.textButton} onClick={() => history.push('/terms')}>Terms of Service</Typography>
          </Grid>
        </Grid>
      </Hidden>
    </div>

  </div>);
}