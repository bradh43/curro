import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation, gql } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { TEAM_QUERY } from '../../utils/graphql';


export const TeamCard = props => {

  const useStyles = makeStyles((theme) => ({
    root: {
      margin: '32px',
    },
    card: {
      margin: theme.spacing(2),
    },
    cardContent: {
      paddingTop: '0px'
    },
    largeAvatar: {
      width: '128px',
      height: '128px',
    },
    media: {
      height: 190,
    },
    countBox: {
      backgroundColor: theme.palette.background.main,
      textAlign: 'center',
      marginBottom: 8,
    },
    requestButton: {
      marginBottom: 16,
    }
  }));

  const [joined, setJoined] = useState(false);
  const [requestPending, setRequestPending] = useState(false);

  const ME_QUERY = gql`
    query {
      me {
        id
        teamList {
          id
        }
        requestedTeamList {
          id
        }
      }
    }
  `;

  const JOIN_TEAM = gql`
    mutation joinTeam($input: UserTeamInput!) {
      joinTeam(input: $input) {
        message
        success
        pending
      }
    }
  `;

  const LEAVE_TEAM = gql`
    mutation leaveTeam($input: UserTeamInput!) {
      leaveTeam(input: $input) {
        message
        success
      }
    }
  `;

  const { loading: meLoading, error, data } = useQuery(ME_QUERY)

  // Check if the user is a part of the team
  if(!meLoading && data && props.data && props.data.team){
    
    var foundTeamFlag = false
    var requestedTeamFlag = false
    // loop through all of their teams and check for team id
    for(var i=0; i<data.me.teamList.length; i++){
      if(data.me.teamList[i].id === props.data.team.id){
        foundTeamFlag = true

        break;
      }
    }
    //if already in team list, don't need to check requestedTeamList as well
    if(!foundTeamFlag) {
      for(var i=0; i<data.me.requestedTeamList.length; i++){
        if(data.me.requestedTeamList[i].id === props.data.team.id){
          requestedTeamFlag = true
          break;
        }
      }
    }


    // prevent the page from doing too many re-renders
    if(joined !== foundTeamFlag){
      setJoined(foundTeamFlag) 
    }

    if(requestPending !== requestedTeamFlag){
      setRequestPending(requestedTeamFlag)
    }
  } 

  const [joinTeamMutation, {loading: joinLoading}] = useMutation(JOIN_TEAM, {
    update(store, {data: result}) {
      const data = store.readQuery({
        query: ME_QUERY
      })

      if(result.joinTeam.success){
        var updatedPendingList = data.me.requestedTeamList
        var updatedTeamList =  data.me.teamList

        if(result.joinTeam.pending){
          setRequestPending(true)
          updatedPendingList = [props.data.team, ...data.me.requestedTeamList]

        } else {
          setJoined(true)
          updatedTeamList = [props.data.team, ...data.me.teamList]
          const team_data = store.readQuery({
            query: TEAM_QUERY,
            variables: { id: props.data.team.id }
          }) 
          const updatedMemberCount = team_data.team.memberCount + 1
          const updatedMemberList = [data.me, ...team_data.team.memberList]
          store.writeQuery({
            query: TEAM_QUERY,
            variables: { id: props.data.team.id },
            data: {
              team: {
                ...team_data.team,
                __typename: "Team",
                memberCount: updatedMemberCount,
                memberList: updatedMemberList
              }
            }
          }) 
        }
        store.writeQuery({
          query: ME_QUERY,
          data: {
            me: {
              ...data.me,
              __typename: "User",
              requestedTeamList: updatedPendingList,
              teamList: updatedTeamList
            }
          }
        })  
      }
    },
    onError(error) {
      console.log(error)
    }
  })

  const [leaveTeamMutation, { loading: leaveLoading }] = useMutation(LEAVE_TEAM, {
    update(store, {data: result}) {
      const data = store.readQuery({
        query: ME_QUERY
      })
      if(result.leaveTeam.success){
        const updatedTeamList = data.me.teamList.filter((team) => {
          if(team.id !== props.data.team.id){
            return team
          }
        })

        setRequestPending(false)
        setJoined(false)
       
        const team_data = store.readQuery({
          query: TEAM_QUERY,
          variables: { id: props.data.team.id }
        }) 
        const updatedMemberCount = team_data.team.memberCount - 1
        const updatedMemberList = team_data.team.memberList.filter((member) => {
          if(member.id !== data.me.id){
            return member
          }
        })
        store.writeQuery({
          query: TEAM_QUERY,
          variables: { id: props.data.team.id },
          data: {
            team: {
              ...team_data.team,
              __typename: "Team",
              memberCount: updatedMemberCount,
              memberList: updatedMemberList
            }
          }
        }) 

        store.writeQuery({
          query: ME_QUERY,
          data: {
            me: {
              ...data.me,
              __typename: "User",
              teamList: updatedTeamList
            }
          }
        }) 
        
      }
    },
    onError(error) {
      console.log(error)
    }
  })

  const formatDate = (createdAt) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    var date = new Date(1970,0,1)
    date.setMilliseconds(createdAt)
    return date.toLocaleDateString("en-US", options)
  }
  
  const requestTeam = () => {
    const userInput = {
      input: {
        teamId: props.data.team.id
      }
    }
    if(joined){
      leaveTeamMutation({ variables: userInput })
    } else {
      joinTeamMutation({ variables: userInput })
      
    }
  }

  const classes = useStyles();

  if (props.error) return (<div>
    <Typography variant="h5" style={{ margin: '16px' }}>ERROR: {props.error.message}</Typography>
  </div>);

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          title={
            props.loading ? (
              <Skeleton animation="wave" width="80%" />
            ) : props.data.team.name
          }
          subheader="Team"
        />

        <CardContent className={classes.cardContent}>
          {props.loading ? (
            <React.Fragment>
              <Box display="flex" style={{ marginBottom: '16px' }}>
                <Box m="auto">
                  <Skeleton animation="wave" variant="circle" width={128} height={128} />
                </Box>
              </Box>
              <Skeleton animation="wave" style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" width="90%" style={{ marginBottom: 16 }} />
              <Skeleton animation="wave" height={16} width="70%" />
            </React.Fragment>
          ) : (
              <div>
                <Box display="flex" style={{ marginBottom: '16px' }}>
                  <Box m="auto">
                    <Avatar
                      variant="square" 
                      alt="Team Logo" 
                      className={classes.largeAvatar}
                      src={props.data.team.profilePictureURL}
                    />
                  </Box>
                </Box>
                <Box className={classes.countBox}>
                  <Typography variant="body1" color="textSecondary" component="p" style={{ marginTop: '16px' }}>
                    {props.data.team.memberCount + " Member" + (props.data.team.memberCount > 1 ? "s" : "")}
                  </Typography>
                </Box>
                <Button 
                  variant={(joined || requestPending) ? "outlined" : "contained"} 
                  color="secondary" 
                  size="small" 
                  fullWidth 
                  onClick={requestTeam}
                  disabled={requestPending || joinLoading}
                  className={classes.requestButton}>
                  { requestPending ? "Request Pending" : (joined ? "Leave Team" : "Request To Join")}
                </Button>

                <Typography variant="body1" component="p">{props.data.team.description}</Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '16px' }}>
                  {
                    "Team created " + formatDate(props.data.team.createdAt)
                  }
                </Typography>
              </div>
            )}
        </CardContent>
      </Card>
    </div>);
}