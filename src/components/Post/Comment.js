import React, { useContext, useState } from 'react';
import { AuthContext } from '../../auth';
import { useMutation, gql } from '@apollo/client';
import { LikeButton } from './LikeButton';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { GET_POST_QUERY } from '../../utils/graphql';
import produce from "immer";
import Moment from 'moment';

export const Comment = props => {

  const useStyles = makeStyles((theme) => ({
    comment: {
      padding: 0,
    },
    profilePicture: {
      width: 32,
      height: 32,
      cursor: 'pointer',
    },
    avatar: {
      minWidth: 48,
    },
    likeCommentSection: {
      top: 42,
      right: 6,
      width: 56,
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

  const { user } = useContext(AuthContext)
  const { history } = props;

  const didUserLikeComment = (likeList) => {
    var userLiked = false;
    for(var i = 0; i < likeList.length; i++) {
        if (likeList[i].user.id === user.id) {
            userLiked = true;
            break;
        }
    }
    return userLiked
  }

  const [commentLikeCount, setCommentLikeCount] = useState(props.comment.likeList.length)
  const [likeComment, setLikeComment] = useState(didUserLikeComment(props.comment.likeList))

  const LIKE_COMMENT_MUTATION = gql`
    mutation likeComment($input: LikeCommentInput!) {
      likeComment(input: $input) {
        liked
      }
    }
  `;

  const [likeCommentMutation, { loading: likeLoading }] = useMutation(LIKE_COMMENT_MUTATION, {
    update(store, { data: { likeComment } }) {
      
      const data = store.readQuery({
        query: GET_POST_QUERY
      })

      var postIndex = data.postList.posts.findIndex((post) => {
        return post.id === props.postId
      })

      var commentIndex = data.postList.posts[postIndex].commentList.findIndex((postComment) => {
        return postComment.id === props.comment.id
      })

      const updatedPosts = produce(data.postList.posts, x => {
        if(likeComment.liked){
          x[postIndex].commentList[commentIndex].likeList.push({user: user})
        } else {
          x[postIndex].commentList[commentIndex].likeList = x[postIndex].commentList[commentIndex].likeList.filter(commentLike => {
            return commentLike.user.id !== user.id
          })
        }
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


  const handleLike = (event) => {
    setCommentLikeCount(event.target.checked ? commentLikeCount + 1 : commentLikeCount - 1)
    const likeInput = {
      input: {
        commentId: props.comment.id
      }
    }

    likeCommentMutation({ variables: likeInput })
    setLikeComment(event.target.checked)
  }

  const formatComment = (createdAt) => {

    var end = Moment()
    var start = Moment.unix(createdAt/1000)
    var timeSinceComment = Moment.duration(end.diff(start))

    if(timeSinceComment.years()){
      return timeSinceComment.years() + ' year' + (timeSinceComment.years() === 1 ? ' ago' : 's ago')
    }
    if(timeSinceComment.months()){
      return timeSinceComment.months() + ' month' + (timeSinceComment.months() === 1 ? ' ago' : 's ago')
    }
    const daySinceComment = timeSinceComment.days()
    if(daySinceComment){
      if(daySinceComment === 1){
        return daySinceComment + ' day ago'
      } else if(daySinceComment < 7){
        return daySinceComment + ' days ago'
      } else {
        const weekSinceComment = Math.ceil(daySinceComment / 7)
        if(weekSinceComment === 1){
          return weekSinceComment + ' week ago'
        } else {
          return weekSinceComment + ' weeks ago'
        }
      }
    }
    if(timeSinceComment.hours()){
      return timeSinceComment.hours() + ' hour' + (timeSinceComment.hours() === 1 ? ' ago' : 's ago')
    }
    if(timeSinceComment.minutes()){
      return timeSinceComment.minutes() + ' min ago'
    }
    return ''
  }

  const navigateToUserProfile = () => {
    history.push('user/'+props.comment.author.id)
  }

  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start" className={classes.comment}>
      <ListItemAvatar className={classes.avatar}>
        <Avatar alt="Profile Picture" className={classes.profilePicture} src={props.comment.author.profilePictureURL} onClick={navigateToUserProfile}/>
      </ListItemAvatar>
      <ListItemText
        primary={<span className={classes.profileClick} onClick={navigateToUserProfile}>{props.comment.author.username}</span>}
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
            >
              {props.comment.note}
            </Typography>
            {' ' + formatComment(props.comment.createdAt)}
          </React.Fragment>
        }
        
      />
    </ListItem>
  );
}