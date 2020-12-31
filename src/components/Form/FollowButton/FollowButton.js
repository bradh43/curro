import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation, gql } from '@apollo/client';
import { USER_QUERY, FOLLOWER_STATUS_QUERY } from '../../../utils/graphql';
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
  const { loading: followStatusLoading, data: followStatusData } = useQuery(FOLLOWER_STATUS_QUERY, {
    variables: { userId: props.followerId }
  })
  
  useEffect(() => {
    if(!followStatusLoading && followStatusData){
      setFollowing(followStatusData.getFollowStatus.following) 
      setRequestPending(followStatusData.getFollowStatus.pending)
    }
  })

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
          //private user
          setRequestPending(true)
          updatedRequestFollowingList = [{id: props.followerId}, ...data.me.requestedFollowingList]

          // update follow status cache
          store.writeQuery({
            query: FOLLOWER_STATUS_QUERY,
            variables: { userId: props.followerId },
            data: {
              getFollowStatus: {
                ...followStatusData.getFollowStatus,
                __typename: "FollowStatus",
                pending: true,
              }
            }
          }) 
        } else {
          // public user
          setFollowing(true)

          const user_data = store.readQuery({
            query: USER_QUERY,
            variables: { id: props.followerId },
          }) 

          // my following list
          updatedFollowingList = [{id: props.followerId}, ...data.me.followingList]
          
          // update me cache for requests and following
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

          // user's follower list
          const updatedFollowerList = [data.me, ...user_data.user.followerList]

          // update user cache to include me in following list
          store.writeQuery({
            query: USER_QUERY,
            variables: { id: props.followerId },
            data: {
              user: {
                ...user_data.user,
                __typename: "User",
                followerList: updatedFollowerList,
              }
            }
          }) 

          // update follow status cache
          store.writeQuery({
            query: FOLLOWER_STATUS_QUERY,
            variables: { userId: props.followerId },
            data: {
              getFollowStatus: {
                ...followStatusData.getFollowStatus,
                __typename: "FollowStatus",
                following: true,
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

        const user_data = store.readQuery({
          query: USER_QUERY,
          variables: { id: props.followerId },
        }) 

        // user's follower list
        const updatedFollowerList = user_data.user.followerList.filter((user) => {
          if(user.id !== data.me.id){
            return user
          }
        })

        // update user cache to remove me from following list
        store.writeQuery({
          query: USER_QUERY,
          variables: { id: props.followerId },
          data: {
            user: {
              ...user_data.user,
              __typename: "User",
              followerList: updatedFollowerList,
            }
          }
        }) 

        // update follow status cache
        store.writeQuery({
          query: FOLLOWER_STATUS_QUERY,
          variables: { userId: props.followerId },
          data: {
            getFollowStatus: {
              ...followStatusData.getFollowStatus,
              __typename: "FollowStatus",
              following: false,
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