import React from 'react';
import { useQuery } from '@apollo/client';
import { TEAM_QUERY } from '../../utils/graphql';
import { TeamCard } from './TeamCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';


export const Team = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      overflow: 'hidden',
    },
  }));

  const { teamid } = props.match.params

  const { loading, error, data } = useQuery(TEAM_QUERY, {variables: {id: teamid}});


  const classes = useStyles();
  const { history } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} lg={4}>
          <TeamCard loading={loading} error={error} data={data} history={history}/>
        </Grid>
      </Grid>
    </div>
  );
    
}