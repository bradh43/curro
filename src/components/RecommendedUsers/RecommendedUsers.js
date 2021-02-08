import React, { useContext, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AuthContext } from '../../auth';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import EditIcon from '@material-ui/icons/Edit';
import { UserTile } from '../Profile/UserTile';
import { GET_POST_QUERY } from '../../utils/graphql';
import produce from 'immer';
import Moment from 'moment';


export const RecommendedUsers = props => {
  const useStyles = makeStyles((theme) => ({
    card: {
      margin: 0,
      width: "100%",
    },
    cardContent: {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    profileClick: {
      cursor: 'pointer',
      userSelect: 'none',
      "&:hover": {
        textDecoration: 'underline',
        color: theme.palette.secondary.main,
      },
    },
  }));

  const USER_SEARCH_QUERY = gql`
    query searchUser($search: String!){
      searchUser(search: $search){
        id
        first
        last
        profilePictureURL
        username
        bio
      }
    }
  `;

  const { data, loading } = useQuery(USER_SEARCH_QUERY, { variables: { search: 'a' } })

  
  const { user } = useContext(AuthContext)
  const { history } = props;
  
  const classes = useStyles();

  return (
    
      <Card className={classes.card}>
        <CardHeader
          title={'Recommended Users'}
        />
        <CardContent className={classes.cardContent}>
          {loading ? (
            <React.Fragment>
              <Skeleton animation="wave"  width="100%" variant="rect" height={74} style={{ marginBottom: 8 }} />
              <Skeleton animation="wave"  width="100%" variant="rect" height={74} style={{ marginBottom: 8 }} />        
              <Skeleton animation="wave"  width="100%" variant="rect" height={74} style={{ marginBottom: 8 }} />        
            </React.Fragment>
          ) : (
            <List className={classes.results}> 
              {(data && data.searchUser) && 
                data.searchUser.map((recommendedUser) => {
                  if(recommendedUser.id !== user.id){
                    return <UserTile key={"recommended-user-tile" + recommendedUser.id} user={recommendedUser} history={props.history} handleClose={() => {}}/>
                  }
                }) 
              }
            </List>
          )}
        </CardContent>
      </Card>
    );
}