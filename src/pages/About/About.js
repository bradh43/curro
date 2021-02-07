import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth';
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
    wrapper:{
      width: '100vw',
      height: 384,
      // zIndex: -10,
      backgroundColor: '#1a1a1a',
      overflow: 'hidden',
      position: 'absolute',
    },
    image: {
      // position: 'absolute',
      // width: '100vw',
      // height: 384,
      position: 'relative',
      height: '100%',
      width: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundImage: 'url(https://www.ncaa.com/_flysystem/public-s3/styles/stax_large_content_tile/public-s3/tile-images/hero/W1C2019C053.JPG?h=90c7c397&itok=wTDuzmuN)',
      // backgroundImage: 'url(https://currodevimages.s3.amazonaws.com/background-images/DSC_5789.jpg)',
      overflow: 'hidden',
      opacity: 0.5,
      // filter: 'grayscale(60%)',
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
    },
    name: {
      fontSize: '0.8675rem',
      fontWeight: 600,
      paddingBottom: 8,
    },
    thankYouSection: {
      paddingTop: 32,
      paddingBottom: 128,
    },
  }));

  const { history } = props;
  const classes = useStyles();

  const createAccount = () => {
    history.push('/createAccount')
  }

  const { user } = useContext(AuthContext)
  console.log(user)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const tagline = 'Sharing Workouts, Made Simple'

  return (
    <div>
      <div className={classes.background}>
        <div className={classes.wrapper}>
          <div className={classes.image}/>
        </div>
        <div className={classes.headerBox}>
          <Typography variant="h4" className={classes.imageText}>{tagline}</Typography>
          {!user && <Button variant="contained" className={classes.createAccountButton} style={{borderRadius:'32px'}} color="primary" size="large" onClick={createAccount}>
            Create Account
          </Button>}
        </div>
        <div className={classes.aboutSection}>
          <Typography variant="h4" className={classes.sectionTitle}>About Curro</Typography>
          <Typography variant="body1">
            Curro was created by athletes, for athletes. Our team of software engineers, developers, and creators wanted to establish a space where <em>team</em> and <em>community</em> work in tandem to provide a platform where athletes from all walks of life can unite behind their shared passion for movement. Our first priority is, and always has been, creating a beautifully clean and usable interface that centers athlete experiences in the context of a greater community of individuals working towards shared goals from across the country. 
          </Typography>
          <br/>
          <Typography variant="body1">
            As competitive runners and athletes ourselves, our team founded Curro in 2020. Today, it continues to grow and be maintained by software engineers, creators, artists, and users from across the country, all united in a shared love of the intersection of technology and activity. 
          </Typography>
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
          <Typography variant="h4" className={classes.sectionTitle}>Thank You</Typography>
          <Typography variant="body1">
            Special thanks to all of these people who have helped contribute to this project and made it possible to be where it is today.
          </Typography>
          <div className={classes.thankYouSection}>
            <Typography variant="h6" className={classes.name}>Evan Han</Typography>
            <Typography variant="h6" className={classes.name}>Julio Trujillo</Typography>
            <Typography variant="h6" className={classes.name}>Jacob Quigley</Typography>
            <Typography variant="h6" className={classes.name}>Marco Quaroni</Typography>
          </div>
        </div>
      </div>
      <Footer history={history}/>
    </div>);
}