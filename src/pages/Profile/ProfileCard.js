import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import { EditProfileModal } from "../../components/Modal/EditProfileModal"
import { UserListModal } from "../../components/Modal/UserList"
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { FollowButton } from '../../components/Form/FollowButton/FollowButton';
import { useQuery, useLazyQuery, useMutation, gql } from '@apollo/client';

export const ProfileCard = props => {
  
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: '32px',
    },
    card: {
      margin: 16,
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
      cursor: 'pointer'
    },
    requestButton: {
      marginBottom: 16,
    }
  }));
  const formatDate = (createdAt) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    var date = new Date(1970,0,1)
    date.setMilliseconds(createdAt)
    return date.toLocaleDateString("en-US", options)
  }
  const [openModal, setOpenModal] = useState(false);
  const [openFollowerModal, setOpenFollowerModal] = useState(false);
  const [openFollowingModal, setOpenFollowingModal] = useState(false);

  const FOLLOWER_ME_QUERY = gql`
    query ME {
      me {
        id
        followerList{
          id
          username
          first
          last
          profilePictureURL
        }
      }
    }
  `;
  const FOLLOWING_ME_QUERY = gql`
    query ME {
      me {
        id
        followingList{
          id
          username
          first
          last
          profilePictureURL
        }
      }
    }
  `;

  const FOLLOWING_USER_QUERY = gql`
    query USER($id: ID!) {
      user(id: $id) {
        id
        followingList{
          id
          username
          first
          last
          profilePictureURL
        }
      }
    }
  `;
  const FOLLOWER_USER_QUERY = gql`
    query USER($id: ID!) {
      user(id: $id) {
        id
        followerList{
          id
          username
          first
          last
          profilePictureURL
        }
      }
    }
  `;
  const [followerMeQuery, { loading: followerLoading, data: followerData }] = useLazyQuery(FOLLOWER_ME_QUERY)
  const [followingMeQuery, { loading: followingLoading, data: followingData }] = useLazyQuery(FOLLOWING_ME_QUERY)
  const [followerUserQuery, { loading: followerUserLoading, data: followerUserData }] = useLazyQuery(FOLLOWER_USER_QUERY)
  const [followingUserQuery, { loading: followingUserLoading, data: followingUserData }] = useLazyQuery(FOLLOWING_USER_QUERY)

  const handleOpen = () => {
    setOpenModal(true);
  };

  const showFollowers = () => {
    if(props.me){
      followerMeQuery()
    } else {
      const searchInput = {
        variables: {
          id: props.data.user.id
        }
      }
      
      followerUserQuery(searchInput)
    }
    setOpenFollowerModal(true)

  }
  const showFollowing = () => {
    if(props.me){
      followingMeQuery()
    } else {
      const searchInput = {
        variables: {
          id: props.data.user.id
        }
      }
      followingUserQuery(searchInput)
    }
    setOpenFollowingModal(true)

  }
  const classes = useStyles();

  if (props.error) return (<div>
    <Typography variant="h5" style={{ margin: '16px' }}>ERROR: {props.error.message}</Typography>
  </div>);

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          action={
            (props.loading || !props.me) ? <></> : (
              <IconButton aria-label="edit" onClick={handleOpen}>
                <EditIcon />
              </IconButton>
            )
          }
          title={
            props.loading ? (
              <Skeleton animation="wave" width="80%" />
            ) : (
                props.me ? 
                props.data.me.first + ' ' + props.data.me.last :
                props.data.user.first + ' ' + props.data.user.last
              )
          }
          subheader={props.loading ? <Skeleton animation="wave" width="40%" /> : (props.me ? props.data.me.username : props.data.user.username)}
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
                      alt="User Profile"
                      className={classes.largeAvatar}
                      src={props.me ? props.data.me.profilePictureURL : props.data.user.profilePictureURL}
                    />
                  </Box>
                </Box>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <Box className={classes.countBox} onClick={showFollowers}>
                      <Typography variant="body1" color="textSecondary" component="p" style={{ marginTop: '16px' }}>
                        Followers
                      </Typography>
                      <Typography variant="body1" color="textSecondary" component="p">
                        {props.me ? props.data.me.followerList.length : props.data.user.followerList.length}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box className={classes.countBox} onClick={showFollowing} >
                      <Typography variant="body1" color="textSecondary" component="p" style={{ marginTop: '16px' }}>
                        Following
                      </Typography>
                      <Typography variant="body1" color="textSecondary" component="p">
                        {props.me ? props.data.me.followingList.length : props.data.user.followingList.length}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {(!props.me && props.data && props.data.user) &&
                  <FollowButton fullWidth={true} followerId={props.data.user.id}/>
                }
                <Typography variant="body1" component="p">
                  {
                    props.me ? props.data.me.bio : props.data.user.bio
                  }
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '16px' }}>
                  {
                    "Member since " + formatDate(props.me ? props.data.me.createdAt : props.data.user.createdAt)
                  }
                </Typography>
              </div>
            )}
        </CardContent>
      </Card>
      {props.me && <EditProfileModal data={props.data} loading={props.loading} openModal={openModal} handleClose={() => setOpenModal(false)}/>}
      {(props.me || (props.data && props.data.user)) && 
        <UserListModal 
          title={"Followers"} 
          history={props.history} 
          data={followerData} 
          userList={props.me ? (followerData ? followerData.me.followerList : []) 
            : (followerUserData ? followerUserData.user.followerList : [])}
          loading={followerLoading || followerUserLoading} 
          openModal={openFollowerModal} 
          handleClose={() => setOpenFollowerModal(false)}/>
      }
      {(props.me || (props.data && props.data.user)) && 
        <UserListModal 
        title={"Following"} 
        history={props.history} 
        data={followingData} 
        userList={props.me ? (followingData ? followingData.me.followingList : []) 
          : (followingUserData ? followingUserData.user.followingList : [])}
        loading={followingLoading || followingUserLoading} 
        openModal={openFollowingModal} 
        handleClose={() => setOpenFollowingModal(false)}/>
      }

    </div>);
}