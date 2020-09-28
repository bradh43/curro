import React from 'react';
import { Footer } from '../components/Footer';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';


export const PageNotFound = () => {
  return (
  <div>
    <Box display="flex" justifyContent="center">
      <Box align="center">
        <Typography variant="h1">404</Typography>
        <Typography variant="h6">The page you are looking for decided to take a rest day and is not currently running</Typography>
        <Link className="text-link" to='/home'><Typography variant="subtitle1">Go back to the home page</Typography></Link>
      </Box>
    </Box>
    <Footer/>
  </div>);
}