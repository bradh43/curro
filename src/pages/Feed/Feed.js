import React, { useState }  from 'react';
import { AllCaughtUp } from '../../components/Post/AllCaughtUp'
import { useQuery } from '@apollo/client';
import { Waypoint } from 'react-waypoint';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { makeStyles } from '@material-ui/core/styles';
import { PostCard } from '../../components/Post/PostCard';
import { RecommendedUsers } from '../../components/RecommendedUsers/RecommendedUsers';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { GET_POST_QUERY } from '../../utils/graphql';

const useStyles = makeStyles((theme) => ({
  mainContent: {
    display: "block",
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    overflowY: 'hidden'
  },
  list: {
    width: "40%",
    display: "block",
    margin: "auto",
    [theme.breakpoints.down('sm')]: {
      width: '70%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: 0,
      marginRight: 0,
    },
    paddingBottom: 32,
  },
  listItem: {
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,

  },
  loadingPostProgress: {
    width: 40,
    padding: 16,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 'auto',
  },
  addFab: {
    position: 'fixed',
    bottom: 16,
    right: 16,
  },
  noPost: {
    padding: 16,
    margin: 16,
    textAlign: 'center',
  },
  
}));

var allCaughtUp = false

export const Feed = (props) => {

  const [openModal, setOpenModal] = useState(false)
  const [seenAllPost, setSeenAllPost] = useState(allCaughtUp)
  const [editPost, setEditPost] = useState(null)
  
  const sample_user_post = {
    id: "1",
    title: "My first log",
    note: "Woke up feeling really tired and sore from rock climbing last night, so hit snooze and slept in. Going to run after class in the evening. // Ran after 4.5 hours of back to back class with Brad - felt really sleepy and unmotivated and absolutely did not want to get out the door, but once we got started I felt alright! Out and back along Escarpment which I actually don't mind at all despite my intense hatred of out and backs. \"Will it loop?\" has become the motto of nearly every run I've done here. In other news, I reached out to Stiles and we're talking half training on Friday yay! I feel like I'm betraying my MD self and maybe setting myself up for something too ambitious given that I have not run over 12 miles in a single run in like 3 years but hoping muscle memory of bigger mileage days kicks in.",
    author: {
      id: "5f8d1b4e66ebae0038491572",
      username: "bradh43",
      first: "Brad",
      last: "Hodkinson",
      profilePictureURL: "https://avatars1.githubusercontent.com/u/39724942?s=460&u=3140403237128bbe7f1daba46e28bb09bec4b2c0&v=4"
    },
    tagList: [],
    activityList: [
      {
        id: "5f95c69cef639bc2f5ccc69f",
        type: "RUN",
        distance: {
          value: 10.4,
          unit: "KM"
        },
        // duration: 3060000
        duration: null

      }
    ],
    likeList: [],
    commentList: [],
    createdAt: "1603683112465",
  }

  const getPostSettings = {pageSize: 10, after: null}
  const { data, fetchMore, networkStatus } = useQuery(GET_POST_QUERY, {variables: getPostSettings, notifyOnNetworkStatusChange: true});

  const fetchMorePosts = () => {
    if(data.postList.hasMore) {
      fetchMore({variables: {pageSize: 10, after: data.postList.cursor}})
    } else {
      if(!allCaughtUp){
        allCaughtUp = true
        setSeenAllPost(true)
      }
    }
  }
  const openNewPost = () => {
    console.log("TODO: Check if user already has a post for today")
    setOpenModal(true)
  }
  const classes = useStyles();
  const { history } = props;


  if(!data ||  !data.postList.posts){
    return (<div className={classes.mainContent}>
        <List className={classes.list}>
          <ListItem key={1} className={classes.listItem}>
            <PostCard post={sample_user_post} loading={true}/>
          </ListItem>
          <ListItem key={2} className={classes.listItem}>
            <PostCard post={sample_user_post} loading={true}/>
          </ListItem>
          <ListItem key={3} className={classes.listItem}>
            <PostCard post={sample_user_post} loading={true}/>
          </ListItem>
          <div className={classes.loadingPostProgress}><CircularProgress/></div>
      </List>
    </div>
    
    )
  }

  return (
  <div>
    <div className={classes.mainContent}>
      {
      <List className={classes.list}>
        {data.postList.posts.length === 0 && 
          <React.Fragment key={"no-posts"}>
          <ListItem className={classes.listItem}>
            <Typography variant={'h5'} className={classes.noPost}>Looks like there are no posts yet. Try making a new post or following users.</Typography>
          </ListItem>
          <ListItem className={classes.listItem}>
            <RecommendedUsers history={history}/>
          </ListItem>
        </React.Fragment>
        }
        {data.postList.posts.map((post, index) => (
          <React.Fragment key={"post" + post.id}>
            <ListItem className={classes.listItem}>
            <PostCard post={post} openEditPostModal={() => setOpenModal(true)} setEditPost={setEditPost} history={history}/>
            </ListItem>
            { (index === data.postList.posts.length - 4) && (
              <Waypoint onEnter={fetchMorePosts}/>
            )}
          </React.Fragment>
        ))}
        { seenAllPost && <AllCaughtUp/>}

        {(networkStatus === 3) && <div className={classes.loadingPostProgress}><CircularProgress/></div>}
      </List>
       
      
    }
     
    </div>
    <NewActivityModal openModal={openModal} handleClose={() => setOpenModal(false)} editPost={editPost} setEditPost={setEditPost}/>
    <span className={classes.addFab}>
        <Fab color="primary" aria-label="add" onClick={openNewPost}>
            <AddIcon />
        </Fab>
    </span>
  </div>);
}