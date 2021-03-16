import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { TEAM_QUERY } from '../../utils/graphql';
import { TeamCard } from './TeamCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

type TeamProps = {
  history: any;
  teamid: string; 
}

export const Team: React.FC<TeamProps> = ({history, teamid}) => {

  const { loading, error, data } = useQuery(TEAM_QUERY, {variables: {id: teamid}});


  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

const useStyles = makeStyles(() => ({
  root: {
    overflow: 'hidden',
  },
}));