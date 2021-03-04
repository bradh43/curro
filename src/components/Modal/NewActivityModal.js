import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../auth';
import {gql, useMutation} from '@apollo/client';
import {ActivityTile} from '../Activity/ActivityTile';
import {ActivityDetail} from '../Activity/ActivityDetail';
import {AllowedActivity} from '../Activity/AllowedActivity';
import {AddActivityButton} from '../Activity/AddActivityButton';
import {makeStyles} from '@material-ui/core/styles';
import {SelectActivity} from '../Activity/SelectActivity';
import {ConfirmDelete} from './ConfirmDelete';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import {CREATE_POST_MUTATION, GET_POST_QUERY, UPDATE_POST_MUTATION} from '../../utils/graphql';
import Moment from 'moment';


const useStyles = makeStyles((theme) => ({
  modal: {
    top: 48,
  },
  paper: {
    position: 'absolute',
    width: '40%',
    height: '98%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    padding: '0 16px 16px 16px',
    margin: 0,
    overflow: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: '100%', 
      width: '100%',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: '16px 0 0 0',
    '& label.Mui-focused': {
      color: theme.palette.text.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.text.main,
      },
    },
  },
  spacer: {
    flexGrow: 1,
    textAlign: 'center',
  },
  gridList: {      
    flexWrap: 'nowrap',
  },
  activityGrid: {
    padding: 0,
    margin: '16px 0 0 0',
    width: '100%',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  postDate: {
    paddingTop: 16,
  },
  activityTile: {
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '40%',
    },
  }
}));

let _previousPostId = '';


export const NewActivityModal = (props) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(props.modalDate ? props.modalDate : Moment());
  const [activityData, setActivityData] = React.useState([]);
  const [openSelectActivityModal, setOpenSelectActivityModal] = useState(false);
  const [openActivityDetailModal, setOpenActivityDetailModal] = useState(false);
  const [editActivityId, setEditActivityId] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(AllowedActivity[0]);
  const [editActivity, setEditActivity] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);

  const { user } = useContext(AuthContext);

  // const getUserCalendarDateFormat = () => {
  //   return Moment(selectedDate).format('YYYY-MM-DD')
  // };

  useEffect(() => {
    if(props.modalDate){
      setSelectedDate(props.modalDate)
    }
  }, [props.modalDate]);

  const handleConfirmDeleteOpen = () => {
    setOpenConfirmDelete(true);
  };

  const handleConfirmDeleteClose = () => {
    setOpenConfirmDelete(false);
  };

  const defaultPost = {
    title: '',
    note: '',
    titleError: false,
    titleErrorMessage: '',
    errorMessage: ''
  };
  const [post, setPost] = React.useState(defaultPost);

  const handlePostChange = (prop) => (event) => {

    if(prop ==='title'){

      if(post.titleError && event.target.value.length > 0){
        setPost({...post, titleError: false, [prop]: String(event.target.value)});
        return
      } 
    } 
    setPost({ ...post, [prop]: String(event.target.value) });
    
  };

  const defaultActivityValues = {
    distanceValue: '',
    distanceUnit: 'mi',
    duration: '',
    durationMs: 0,
    equipmentId: '',
    heartRate: '',
    elevationGain: '',
    calories: '',
  };

  const [editActivityValues, setEditActivityValues] = React.useState(defaultActivityValues);

  const editPost = !!props.editPost;
  
  if(editPost && _previousPostId !== props.editPost.id){
    _previousPostId = props.editPost.id;
    setPost({
      ...post,
      id: props.editPost.id,
      title: props.editPost.title,
      note: props.editPost.note,
    });
    setSelectedDate(Moment(props.editPost.postDate));
    const activityList = props.editPost.activityList.map((activity)=>{
      return {
        ...activity,
        activityId: 1
      }
    });
    setActivityData(activityList)
  }


  const handleEditActivityChange = (prop) => (event) => {
    if(prop === 'duration'){
      const onlyNumbersRegex = /[^\.\d\:]/g;
      event.target.value = event.target.value.replace(onlyNumbersRegex, '')
    }
    setEditActivityValues({ ...editActivityValues, [prop]: event.target.value });
    
  };

  const setEditActivityDefaultValues = () => {
    setEditActivityValues(defaultActivityValues)
  };

  const clearState = () => {
    if(editPost){
      props.setEditPost(null)
    }
    setActivityData([]);
    setSelectedDate(Moment());
    setPost(defaultPost);
    _previousPostId = ''
  };
  const cancelPost = () => {
    clearState();
    props.handleClose()
    
  };

  const formatDate = () => {
    // const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'};
    const date = props.editPost ? Moment(props.editPost.postDate) : Moment(selectedDate);
    return date.format('dddd, LL')
  };

  const [createPostMutation, {loading}] = useMutation(CREATE_POST_MUTATION, {
    update(store, result) {

      const cacheId = store.identify(result.data.createPost);

      store.modify({
        fields: {
          postList: (existingFieldData, { toReference }) => {
            return {
              __typename: "CreatePost",
              posts: [toReference(cacheId), ...existingFieldData.posts],
              hasMore: existingFieldData.hasMore,
              cursor: existingFieldData.cursor,
            }
          },
          getProfileCalendar: (existingFieldData, { toReference }) => {
            return [toReference(cacheId), ...existingFieldData]
          },
          getTeamCalendar: (existingFieldData, { readField, toReference }) => {
            return existingFieldData.map((userPostMapRef) => {
              if(readField('id', userPostMapRef['user']) === user.id) {
                return {
                  ...userPostMapRef,
                  posts: [toReference(cacheId), ...userPostMapRef['posts']]
                }
              } else {
                return userPostMapRef
              }
            })
          },
        }
      });

      clearState();
      props.handleClose()
    },
    onError(error) {
      console.log(error);
      console.log(error.message);
      // TODO, don't close and tell user what happened
      props.handleClose()
    }
  });

const [updatePostMutation, {loading: editLoading}] = useMutation(UPDATE_POST_MUTATION, {
  update(store, result) {
    try {
      const data = store.readQuery({
        query: GET_POST_QUERY
      });

      const updatedPosts = data.postList.posts.filter((post) => {
        if(post.id === props.editPost.id){
          return result.data.updatePost
        }
        return post
      });
      
      // TODO update using immer look at Comment.js
      store.writeQuery({
        query: GET_POST_QUERY,
        data: {
          postList: {
            __typename: "UpdatePost",
            posts: updatedPosts,
            hasMore: data.postList.hasMore,
            cursor: data.postList.cursor
          },
        }
      })
    } catch (_) {
      // newsfeed Cache isn't populated yet
    }

    clearState();
    props.handleClose()

  },
  onError(error) {
    console.log(error);
    console.log(error.message);
    // TODO, don't close and tell user what happened
    props.handleClose();
  }
});

  const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
      deletePost(postId: $postId) {
        message
        success
      }
    }
  `;

  const [deletePostMutation, {loading: deleteLoading}] = useMutation(DELETE_POST_MUTATION, {
    update(store, _) {
      
      const cacheId = store.identify(props.editPost);

      store.modify({
        fields: {
          postList: (existingFieldData, { toReference }) => {
            return {
              __typename: "DeletePost",
              posts: existingFieldData.posts.filter((postRef) => {
                return toReference(cacheId)['__ref'] !== postRef['__ref']
              }),
              hasMore: existingFieldData.hasMore,
              cursor: existingFieldData.cursor,
            }            
          },
          getProfileCalendar: (existingFieldData, { toReference }) => {
            return existingFieldData.filter((postRef) => {
              return toReference(cacheId)['__ref'] !== postRef['__ref']
            })
          },
          getTeamCalendar: (existingFieldData, { readField, toReference }) => {
            return existingFieldData.map((userPostMapRef) => {
              if(readField('id', userPostMapRef['user']) === user.id) {
                return {
                  ...userPostMapRef,
                  posts: userPostMapRef['posts'].filter(postRef => {
                    return toReference(cacheId)['__ref'] !== postRef['__ref']
                  })
                }
              } else {
                return userPostMapRef
              }
            })
          },
        }
      });

      clearState();
      props.handleClose()
    },
    onError(error) {
      console.log(error);
      console.log(error.message);
      // TODO, don't close and tell user what happened
      props.handleClose()
    }
  });

  const validatePost = (callback) => {
    // const postDate = Moment(selectedDate).format("YYYY-MM-DD");

    const postTitleValid = post.title.length > 0;
    const selectedDateValid = selectedDate !== null;

    const titleErrorMessage = 'Title is required';

    setPost({ ...post, 
      titleError: !postTitleValid, titleErrorMessage: titleErrorMessage,
    });

    if(postTitleValid && selectedDateValid) {
      callback()
    } 
  };
  const postActivity = () => {
    validatePost(() => {
      const activityList = activityData.map((activity)=>{
        let formatActivity = {
          type: activity.type.replace(/\s+/g, '_').toUpperCase(),
          duration: activity.duration,
          distance: {
            value: parseFloat(activity.distance.value),
            unit: activity.distance.unit
          },
          equipmentId: activity.equipmentId === "" ? undefined : activity.equipmentId,
          additionalInfo: {
            averageHeartRate: activity.averageHeartRate,
            elevationGain: activity.elevationGain,
            calories: activity.calories
          }
        };
        // Check if the activity already has an existing mongodb id
        if(editPost && String(activity.id).match(/^[0-9a-fA-F]{24}$/)){
          // add the existing id so API can update activty
          formatActivity = {
            ...formatActivity,
            activityId: activity.id
          }
        }
        return formatActivity
      });

      const postInput = {
        input: {
          title: post.title,
          activityList: activityList,
          note: post.note,
          // TODO change this to tagList of users
          tagIdList: []  
        }
      };
      
      if(editPost){
        const editPostInput = {
          ...postInput,
          input: {
            ...postInput.input,
            postId: props.editPost.id,
          }
        };
        updatePostMutation({ variables: editPostInput })
      } else {
        const creatPostInput = {
          ...postInput,
          input: {
            ...postInput.input,
            postDate: selectedDate.format("YYYY-MM-DD"),
          }
        };
        console.log(selectedDate.format("YYYY-MM-DD"));
        createPostMutation({ variables: creatPostInput })
      }
      
    })
  };

  const deletePost = () => {
    const deleteInput = {
      postId: props.editPost.id
    };
    deletePostMutation({variables: deleteInput});
    handleConfirmDeleteClose()
  };

  return (
    <div>
      <Modal
        style={{display:'flex', alignItems:'center', justifyContent:'center'}}
        open={props.openModal}
        onClose={props.handleClose}
        disableBackdropClick
      >
      <div style={classes.modalStyle} className={classes.paper}>
        <Toolbar disableGutters>
          <Button onClick={cancelPost} >Cancel</Button>
          {editPost && (
            <Tooltip title="Delete" enterDelay={400}>
              <span>
                <IconButton onClick={handleConfirmDeleteOpen} disabled={deleteLoading}>
                  <DeleteForeverIcon/>
                  {deleteLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </IconButton>
              </span>
            </Tooltip>
          ) }
          <Typography variant="h6" className={classes.spacer}>{editPost ? "Edit" : "New"} Post</Typography>
          <Button onClick={postActivity} color="primary" disabled={loading}>
            {editPost ? "SAVE" : "POST"}
            {(loading || editLoading) && <CircularProgress size={24} className={classes.buttonProgress} />}
          </Button>

        </Toolbar>
        <form noValidate autoComplete="off">
          <TextField 
            className={classes.textField} 
            value={post.title} 
            onChange={handlePostChange('title')} 
            helperText={post.titleError ? post.titleErrorMessage : ''}
            error={post.titleError}
            label="Title" 
            fullWidth 
            variant="outlined" 
            required
          />
          <Typography variant="subtitle1" className={classes.postDate}>{formatDate()}</Typography>
          <div className={classes.activityGrid}>
            <GridList className={classes.gridList} cols={1.5} >
              {activityData.map((activity) => (
                <GridListTile key={activity.id} className={classes.activityTile}>
                    <ActivityTile 
                      activity={activity} 
                      edit={true}
                      setOpenActivityDetailModal={setOpenActivityDetailModal}
                      setEditActivityId={setEditActivityId}
                      setEditActivity={setEditActivity}
                      setEditActivityValues={setEditActivityValues}
                      setSelectedActivity={setSelectedActivity}
                    />
                </GridListTile>
              ))}
              <GridListTile key="add-activity-button" className={classes.activityTile}>
                <AddActivityButton openSelectActivity={() => setOpenSelectActivityModal(true)}/>
              </GridListTile>
            </GridList>
          </div>
          <TextField className={classes.textField} label="Note" value={post.note} onChange={handlePostChange('note')} fullWidth multiline rows={7} variant="outlined" />
          {/* TODO add TAG list, look into select -> Multiple Select Chip */}
        </form>
        <ConfirmDelete
        open={openConfirmDelete}
        handleClose={handleConfirmDeleteClose}
        action={deletePost}
        actionLabel={"Delete"}
        title={"Delete Post?"}
        description={"Are you sure you wish to delete this post. This can not be undone."}
      />
      </div>
      
      </Modal>
      <SelectActivity 
        openModal={openSelectActivityModal} 
        handleClose={() => setOpenSelectActivityModal(false)} 
        setActivityData={setActivityData}
        activityData={activityData} 
        setSelectedActivity={setSelectedActivity}
        setOpenActivityDetailModal={setOpenActivityDetailModal}
        setEditActivity={setEditActivity}
        setEditActivityValues={setEditActivityValues}
        editActivityValues={editActivityValues}
      />
      <ActivityDetail 
        activityData={activityData}
        setActivityData={setActivityData}
        activity={selectedActivity} 
        openModal={openActivityDetailModal} 
        handleClose={() => setOpenActivityDetailModal(false)}
        editActivity={editActivity}
        editActivityId={editActivityId}
        handleCloseSelect={() => setOpenSelectActivityModal(false)}
        handleEditActivityChange={handleEditActivityChange}
        handleEditActivityChangeSelect={handleEditActivityChange}
        editActivityValues={editActivityValues}
        setEditActivityDefaultValues={setEditActivityDefaultValues}
      />
    </div>
  );
};