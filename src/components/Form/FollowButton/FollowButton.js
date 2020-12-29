import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';

export const FollowButton = props => {
  
  const useStyles = makeStyles((theme) => ({
    requestButton: {
      marginBottom: 16,
    }
  }));

  const [following, setFollowing] = useState(false);
  const [requestPending, setRequestPending] = useState(false);

  const ME_QUERY = gql`
    query {
      me {
        id
        followingList {
          id
        }
        requestedFollowingList {
          id
        }
      }
    }
  `;
  const FOLLOW_USER = gql`
    mutation followUser($input: FollowUserInput!) {
      followUser(input: $input) {
        message
        success
        pending
      }
    }
  `;

  const UNFOLLOW_USER = gql`
    mutation unfollowUser($input: FollowUserInput!) {
      unfollowUser(input: $input) {
        message
        success
      }
    }
  `;

  const { loading: meLoading, error, data } = useQuery(ME_QUERY)

  // Check if the user is following
  if(!meLoading && data && props.followerId){
  
    var foundFollowingUser = false
    var requestedUserFlag = false
    // loop through all of followers and see if following
    for(var i=0; i<data.me.followingList.length; i++){
      if(data.me.followingList[i].id === props.followerId){
        foundFollowingUser = true
        break;
      }
    }
    //if already in team list, don't need to check requestedTeamList as well
    if(!requestedUserFlag) {
      
      for(var i=0; i<data.me.requestedFollowingList.length; i++){
        if(data.me.requestedFollowingList[i].id === props.followerId){
          requestedUserFlag= true
          break;
        }
      }
    }
     // prevent the page from doing too many re-renders
    if(following !== foundFollowingUser){
      setFollowing(foundFollowingUser) 
    }

    if(requestPending !== requestedUserFlag){
      setRequestPending(requestedUserFlag)
    }
  } 
  const [followUserMutation, {loading: followLoading}] = useMutation(FOLLOW_USER, {
    update(store, {data: result}) {
      const data = store.readQuery({
        query: ME_QUERY
      })
      if(result.followUser.success){
        var updatedRequestFollowingList = data.me.requestedFollowingList
        var updatedFollowingList =  data.me.followingList
        // TODO update person's followers count, person is who just got followed 

        if(result.followUser.pending){
          setRequestPending(true)
          updatedRequestFollowingList = [{id: props.followerId}, ...data.me.requestedFollowingList]
        } else {
          // public user
          setFollowing(true)
          updatedFollowingList = [{id: props.followerId}, ...data.me.followingList]

          // const team_data = store.readQuery({
          //   query: TEAM_QUERY,
          //   variables: { id: props.data.team.id }
          // }) 

          // const updatedFollowerCount = team_data.team.memberCount + 1
          // const updatedFollowerList = [data.me, ...team_data.team.memberList]
          store.writeQuery({
            query: ME_QUERY,
            data: {
              me: {
                ...data.me,
                __typename: "User",
                requestedFollowingList: updatedRequestFollowingList,
                followingList: updatedFollowingList
              }
            }
          }) 

        }
      }
    },
    onError(error) {
      console.log(error)
    }
  })
  const [unfollowUserMutation, {loading: unfollowLoading}] = useMutation(UNFOLLOW_USER, {
    update(store, {data: result}) {
      const data = store.readQuery({
        query: ME_QUERY
      })
      if(result.unfollowUser.success){
        const updatedFollowingList = data.me.followingList.filter((user) => {
          if(user.id !== props.followerId){
            return user
          }
        })
        setRequestPending(false)
        setFollowing(false)

        store.writeQuery({
          query: ME_QUERY,
          data: {
            me: {
              ...data.me,
              __typename: "User",
              followingList: updatedFollowingList
            }
          }
        }) 
                
      }
    },
    onError(error) {
      console.log(error)
    }
  })

  const requestFollow = () => {
    const userInput = {
      input: {
        followerId: props.followerId
      }
    }
    console.log(userInput)
    if(following){
      console.log("Todo ARE YOU SURE unfollow???")
      unfollowUserMutation({ variables: userInput })
    } else {
      followUserMutation({ variables: userInput })
    }
  }

  const classes = useStyles();

  return (
    <Button 
      variant={(following || requestPending) ? "outlined" : "contained"} 
      color="secondary" 
      size="small" 
      fullWidth 
      onClick={requestFollow}
      disabled={requestPending || followLoading}
      className={classes.requestButton}>
      { requestPending ? "Request Pending" : (following ? "Following" : "Follow")}
    </Button>
  );   
}