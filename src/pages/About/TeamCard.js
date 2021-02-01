import React, { useContext, useEffect, useState } from 'react';
import { Footer } from '../../components/Footer/Footer';
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


// TODO Create an about page to give recognition and credits to everyone that has worked on the project

// Login/Create Account Photos Marco Quaroni
// Logo Max Gillespie
// Class Work Evan Han, Julio Trujillo, Jacob Quigley
// UI/UX Audrey Western
// Brad, Nate, Prat, Zac
// User testing

export const TeamCard = (props) => {

  const useStyles = makeStyles((theme) => ({
    name: {
      fontWeight: 400,
      textAlign: 'center',
    },
    title: {
      fontWeight: 400,
      textAlign: 'center',
      marginBottom: 8,
    },
    bio: {
      fontWeight: 300,
      textAlign: 'center',
      marginBottom: 64,
    },
    profileAvatar: {
      width: 128,
      height: 128,
      margin: 'auto',
    },
   
  }));

  const classes = useStyles();

  return (  
    <Grid item xs={12} sm={6} md={4}>
      <Avatar alt="headshot" src={props.member.profilePictureURL} className={classes.profileAvatar} />

      <Typography variant={'h6'} className={classes.name}>{props.member.first} {props.member.last}</Typography>
      <Typography variant={'subtitle2'} className={classes.title}>{props.member.title}</Typography>
      <Typography variant={'body2'} className={classes.bio}>{props.member.bio}</Typography>

    </Grid>
  );
}