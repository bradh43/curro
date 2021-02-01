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
import { TeamCard } from './TeamCard';
import { TeamInfo } from './TeamInfo';

// TODO Create an about page to give recognition and credits to everyone that has worked on the project

// Login/Create Account Photos Marco Quaroni
// Logo Max Gillespie
// Class Work Evan Han, Julio Trujillo, Jacob Quigley
// UI/UX Audrey Western
// Brad, Nate, Prat, Zac
// User testing

export const About = (props) => {

  const useStyles = makeStyles((theme) => ({
    background: {
      backgroundColor: '#FFFFFF',
    },
    image: {
      position: 'absolute',
      width: '100vw',
      height: 384,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage: 'url(https://www.ncaa.com/_flysystem/public-s3/styles/stax_large_content_tile/public-s3/tile-images/hero/W1C2019C053.JPG?h=90c7c397&itok=wTDuzmuN)',
      // backgroundImage: 'url(https://currodevimages.s3.amazonaws.com/background-images/DSC_5789.jpg)',
      overflow: 'hidden',
      opacity: 0.7,
      filter: 'grayscale(60%)',
      // zIndex: -1
    },
    headerBox: {
      position: 'relative',
      width: '33vw',
      minWidth: 256,
      height: 384,
      paddingTop: 128,
      paddingBottom: 64,
      marginLeft: '10vw',
    },
    createAccountButton: {
      marginTop: 32,
    },
    imageText: {
      color: 'white',
    },
    aboutSection: {
      width: '60vw',
      margin: 'auto',
      [theme.breakpoints.down('sm')]: {
        margin: 32,
        width: 'auto'
      },
    },
    sectionTitle: {
      color: theme.palette.primary.main,
      marginTop: 64,
      marginBottom: 32,
    }
  }));

  const { history } = props;
  const classes = useStyles();

  const createAccount = () => {
    history.push('/createAccount')
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const tagline = 'Sharing Workouts Made Simple'
  const aboutText = 'Curro is a lifestyle website and application that connects athletes together. Every day, we are working to provide a community where athletes can log their activities and share them with a community of other athletes. At Curro, we believe now more than ever it is vital to be connected with other motivated and passionate athletes. \nCurro began as a small project amongst computer science runners that identified the need to have space for athletes to share about their training beyond just the simple stats. Space where athletes can answer ‘how did you feel?’, and have space where they can be held accountable to adjust their training.'

  return (
    <div>
      <div className={classes.background}>
        <div className={classes.image}/>
        <div className={classes.headerBox}>
          <Typography variant="h4" className={classes.imageText}>{tagline}</Typography>
          <Button variant="contained" className={classes.createAccountButton} style={{borderRadius:'32px'}} color="primary" size="large" onClick={createAccount}>
            Create Account
          </Button>
        </div>
        <div className={classes.aboutSection}>
          <Typography variant="h4" className={classes.sectionTitle}>About Curro</Typography>
          <Typography variant="body1">{aboutText}</Typography>
          <Typography variant="h4" className={classes.sectionTitle}>The Team</Typography>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="stretch"
            spacing={6}
          >
            {TeamInfo.map((member) => (
              <TeamCard key={member.id} member={member}/>
            ))}
        </Grid>
        </div>
      </div>
      <Footer history={history}/>
    </div>);
}