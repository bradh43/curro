import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { ActivityTile } from './Activity/ActivityTile';
import { ActivityDetail } from './Activity/ActivityDetail';
import { AllowedActivity } from './Activity/AllowedActivity';
import { AddActivityButton } from './Activity/AddActivityButton';
import { makeStyles } from '@material-ui/core/styles';
import { SelectActivity } from './Activity/SelectActivity';
import { ConfirmDelete } from './ConfirmDelete';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Toolbar from '@material-ui/core/Toolbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { GET_POST_QUERY } from '../utils/graphql';
import { UPDATE_POST_MUTATION } from '../utils/graphql';
import { CREATE_POST_MUTATION } from '../utils/graphql';


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
      color: theme.palette.secondary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary.main,
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
  }
}));

var _previousPostId = ''


export const NewActivityModal = (props) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [activityData, setActivityData] = React.useState([]);
  const [openSelectActivityModal, setOpenSelectActivityModal] = useState(false)
  const [openActivityDetailModal, setOpenActivityDetailModal] = useState(false)
  const [editActivityId, setEditActivityId] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState(AllowedActivity[0])
  const [editActivity, setEditActivity] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);

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
    dateError: false,
    titleErrorMessage: '',
    dateErrorMessage: '',
    errorMessage: ''
  }
  const [post, setPost] = React.useState(defaultPost);

  const handlePostChange = (prop) => (event) => {

    if(prop ==='title'){

      if(post.titleError && event.target.value.length > 0){
        setPost({...post, titleError: false, [prop]: String(event.target.value)})
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
  }

  const [editActivityValues, setEditActivityValues] = React.useState(defaultActivityValues);

  const editPost = props.editPost ? true : false
  
  if(editPost && _previousPostId !== props.editPost.id){
    _previousPostId = props.editPost.id
    setPost({
      ...post,
      id: props.editPost.id,
      title: props.editPost.title,
      note: props.editPost.note,
    })
    setSelectedDate(new Date(props.editPost.postDate))
    var activityList = props.editPost.activityList.map((activity)=>{
      var formatActivity = {
        ...activity,
        activityId: 1
      }
      return formatActivity
    })
    setActivityData(activityList)
  }


  const handleEditActivityChange = (prop) => (event) => {
    if(prop === 'duration'){
      var onlyNumbersRegex = /[^\.\d\:]/g
      event.target.value = event.target.value.replace(onlyNumbersRegex, '')
    }
    setEditActivityValues({ ...editActivityValues, [prop]: event.target.value });
    
  };

  const setEditActivityDefaultValues = () => {
    setEditActivityValues(defaultActivityValues)
  }

  const handleDateChange = (date) => {
    if(date !== ''){
      setPost({ ...post, 
        dateError: false,
      });
    }
    setSelectedDate(date);
  };
  const clearState = () => {
    if(editPost){
      props.setEditPost(null)
    }
    setActivityData([])
    setSelectedDate(new Date())
    setPost(defaultPost)
    _previousPostId = ''
  }
  const cancelPost = () => {
    clearState()
    props.handleClose()
    
  }

  const formatDate = (postDate) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'};
    var date = new Date(postDate) 
    return date.toLocaleDateString("en-US", options)
  }

  const [createPostMutation, {loading}] = useMutation(CREATE_POST_MUTATION, {
    update(store, result) {
      const data = store.readQuery({
        query: GET_POST_QUERY
      })
      const updatedPosts = [result.data.createPost, ...data.postList.posts]
      
      store.writeQuery({
        query: GET_POST_QUERY,
        data: {
          postList: {
            __typename: "CreatePost",
            posts: updatedPosts,
            hasMore: data.postList.hasMore,
            cursor: data.postList.cursor
          },
        }
      })

      clearState()
      props.handleClose()

    },
    onError(error) {
      console.log(error)
      console.log(error.message)
      // TODO, don't close and tell user what happened
      props.handleClose()
    }
  })

const [updatePostMutation, {loading: editLoading}] = useMutation(UPDATE_POST_MUTATION, {
  update(store, result) {
    const data = store.readQuery({
      query: GET_POST_QUERY
    })

    const updatedPosts = data.postList.posts.filter((post) => {
      if(post.id === props.editPost.id){
        return result.data.updatePost
      }
      return post
    })
    
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

    clearState()
    props.handleClose()

  },
  onError(error) {
    console.log(error)
    console.log(error.message)
    // TODO, don't close and tell user what happened
    props.handleClose()
  }
})

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
      const data = store.readQuery({
        query: GET_POST_QUERY
      })

      const updatedPosts = data.postList.posts.filter((post) => {
        if(post.id !== props.editPost.id){
          return post
        }
      })

      store.writeQuery({
        query: GET_POST_QUERY,
        data: {
          postList: {
            __typename: "DeletePost",
            posts: updatedPosts,
            hasMore: data.postList.hasMore,
            cursor: data.postList.cursor
          },
        }
      })
      clearState()
      props.handleClose()
    },
    onError(error) {
      console.log(error)
      console.log(error.message)
      // TODO, don't close and tell user what happened
      props.handleClose()
    }
  })

  const validatePost = (callback) => {
    var postDate = selectedDate.toISOString()

    const postTitleValid = post.title.length > 0
    const selectedDateValid = selectedDate !== null

    var titleErrorMessage = 'Title is required'
    var dateErrorMessage = 'Date is required'

    setPost({ ...post, 
      titleError: !postTitleValid, titleErrorMessage: titleErrorMessage,
      dateError: !selectedDateValid, dateErrorMessage: dateErrorMessage
    });

    if(postTitleValid && selectedDateValid) {
      callback()
    } 
  }
  const postActivity = () => {
    validatePost(() => {
      var activityList = activityData.map((activity)=>{
        var formatActivity = {
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
        }
        // Check if the activity already has an existing mongodb id
        if(editPost && String(activity.id).match(/^[0-9a-fA-F]{24}$/)){
          // add the existing id so API can update activty
          formatActivity = {
            ...formatActivity,
            activityId: activity.id
          }
        }
        return formatActivity
      })

      const postInput = {
        input: {
          title: post.title,
          activityList: activityList,
          note: post.note,
          // TODO change this to tagList of users
          tagIdList: []  
        }
      }
      
      if(editPost){
        const editPostInput = {
          ...postInput,
          input: {
            ...postInput.input,
            postId: props.editPost.id,
          }
        }
        updatePostMutation({ variables: editPostInput })
      } else {
        const creatPostInput = {
          ...postInput,
          input: {
            ...postInput.input,
            postDate: selectedDate.toISOString(),
          }
        }
        

        createPostMutation({ variables: creatPostInput })
      }
      
    })
  }

  const deletePost = () => {
    const deleteInput = {
      postId: props.editPost.id
    }
    console.log("Delete Post")
    console.log(deleteInput)
    deletePostMutation({variables: deleteInput})
    handleConfirmDeleteClose()
  }

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
          {editPost ? <Typography variant="subtitle1" className={classes.postDate}>{formatDate(props.editPost.postDate)}</Typography>
          : <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              fullWidth
              required
              className={classes.textField}
              margin="normal"
              id="date-picker-dialog"
              label="Activity Date"
              format="MM/dd/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              helperText={post.dateError ? post.dateErrorMessage : ''}
              error={post.dateError}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>}
          <div className={classes.activityGrid}>
            <GridList className={classes.gridList} cols={1.5} >
              {activityData.map((activity) => (
                <GridListTile key={activity.id} style={{boxShadow: 'none'}}>
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
              <GridListTile key="add-activity-button">
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
        editActivityValues={editActivityValues}
        setEditActivityDefaultValues={setEditActivityDefaultValues}
      />
    </div>
  );
}