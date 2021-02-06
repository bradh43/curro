import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GET_POST_QUERY } from '../../utils/graphql';
import produce from "immer";


export const AddComment = props => {
  
  const useStyles = makeStyles((theme) => ({
    textField: {
      margin: '8px 0 0 0',
      '& label.Mui-focused': {
        color: theme.palette.secondary.main,
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: theme.palette.secondary.main,
        },
      },
    },
    buttonProgress: {
      position: 'absolute',
      right: 16,
    },
  }));

  const [comment, setComment] = React.useState('');
  const [validComment, setValidComment] = React.useState(false);

  const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($input: CreateCommentInput!){
      createComment(input: $input){
        id
        note
        author{
          id
          profilePictureURL
          first
          last
          username
        }
        likeList{
          user{
            id
          }
        }
        createdAt
      }
    }
  `;

  const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT_MUTATION, {
    update(store, { data: { createComment } }) {

      const data = store.readQuery({
        query: GET_POST_QUERY
      })

      var postIndex = data.postList.posts.findIndex((post) => {
        return post.id === props.postId
      })

      const updatedPosts = produce(data.postList.posts, x => {
        x[postIndex].commentList.push(createComment)
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


    },
    onError(error) {
      console.log(error)
    }
  })


  const handleChange = (event) => {
    const commentString = String(event.target.value)
    setComment(commentString)
    setValidComment(commentString ? true : false)
    
  };

  const handleMouseDownSend = (event) => {
    event.preventDefault();
  };


  const handlePostComment = () => {
    if(comment){
      const userInput = {
        input: {
          note: comment,
          postId: props.postId
        }
      }
      createCommentMutation({variables: userInput})

      setComment('')
      setValidComment(false)
      //TODO disable focus from add comment
    }
  }

  const submitForm = (event) => {
    event.preventDefault()
    handlePostComment()
  }

  const classes = useStyles();

  return (
    <form noValidate autoComplete="off" onSubmit={submitForm}>
      <FormControl fullWidth className={classes.textField} variant="outlined">
        <OutlinedInput
          id={"outlined-post-comment"+props.postId}
          value={comment}
          onChange={handleChange}
          label="Add Comment"
          multiline
          autoFocus={props.isCommenting}
          rowsMax={3}
          endAdornment={
            <React.Fragment>
              <InputAdornment position="end">
                <IconButton
                  aria-label="post-comment-button"
                  onClick={handlePostComment}
                  edge="end"
                  disabled={!validComment || loading}
                  onMouseDown={handleMouseDownSend}
                  type="submit"
                >
                  {(!validComment || loading) ? <SendIcon/> : <SendIcon color="secondary"/>}
                </IconButton>
              </InputAdornment>
              {loading  && <CircularProgress size={24} className={classes.buttonProgress} />}
            </React.Fragment>
          }
          labelwidth={70}
        />
        <InputLabel htmlFor={"outlined-post-comment"+props.postId}>Add Comment</InputLabel>
      </FormControl>
    </form>
    );
}