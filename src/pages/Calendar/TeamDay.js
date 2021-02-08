import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../auth';
import { makeStyles } from '@material-ui/core/styles';
import { gql, useMutation } from '@apollo/client';
import { CalendarComments } from '../../components/Calendar/CalendarComments';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { ActivityTile } from './ActivityTile';
import moment from 'moment';
import ShowMoreText from 'react-show-more-text';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Checkbox from '@material-ui/core/Checkbox';
import AddCommentIcon from '@material-ui/icons/AddComment';

const useStyles = makeStyles((theme) => ({
    cell: {
      height: '100%',
      width: '100%',
      border: "1px solid #E8E8E8",
      padding: 8,
      backgroundColor: '#ffffff',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    },
    previousCell: {
      backgroundColor: '#fbfbfb',
    },
    hoverCell: {
      cursor: 'pointer',
      color: '#1a1a1a',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      }
    },
    postCell: {
      
    },
    date: {
      color: '#8C8C8C',
      position: 'absolute',
      top: 8,
      left: 8,
      width: 24,
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    today: {
      backgroundColor: theme.palette.primary.main,
      height: 24,
      width: 24,
      marginRight: 8,
      fontSize: '0.875rem',
      display: 'inline-block',
      lineHeight: '24px',
      textAlign: 'center',
      position: 'absolute',
      top: -2,
      left: -2,
    },
    title: {
      whiteSpace: 'nowrap',
      display: 'inline-block',
      marginLeft: 24,
      width: 'calc(((100vw - 32px) / 8) - 50px)',
      [theme.breakpoints.down('sm')]: {
        width: 'calc(((100vw - 32px) * 2 / 3) - 50px)',
      },
      color: '#1a1a1a',
      fontWeight: '600',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.primary.main,
      }
    },
    todayTitle: {
      marginLeft: 32,
      width: 'calc(((100vw - 32px) / 8) - 58px)',
      [theme.breakpoints.down('sm')]: {
        width: 'calc(((100vw - 32px) * 2 / 3) - 58px)',
      },
      whiteSpace: 'nowrap',
      display: 'inline-block',
      color: '#1a1a1a',
      fontWeight: '600',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.primary.main,
      }
    },
    note: {
      marginTop: 8,
    },
    showButton: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      textDecoration: 'none',
    },
    postActionBox:{
      // backgroundColor: 'red',
      marginTop: 8,
    },
    likeButton: {
      padding: 2,
      margin: 0,
    },
    icon: {
      height: 16,
      width: 16,
    },
    spacer: {
      flexGrow: 1
    },
    commentSection: {

    },
}));

const isToday = (someDate) => {
  return someDate.isSame(moment(), 'day')
}

export const TeamDay = (props) => {
  const classes = useStyles();
  const today = isToday(props.dayDate)

  const { history } = props;
  const post = props.post

  const { user } = useContext(AuthContext)

  const didUserLikePost = (likeList) => {
    var userLiked = false;
    for(var i = 0; i < likeList.length; i++) {
        if (likeList[i].user.id === user.id) {
            userLiked = true;
            break;
        }
    }
    return userLiked
  }

  const [likePost, setLikePost] = useState(didUserLikePost((props.post && props.post.likeList) ? props.post.likeList : []))

  const LIKE_POST_MUTATION = gql`
    mutation likePost($input: LikePostInput!) {
      likePost(input: $input) {
        liked
      }
    }
  `;

  const [likePostMutation, { loading: likeLoading }] = useMutation(LIKE_POST_MUTATION, {
    update(store, { data: { likePost } }) {
      store.modify({
        id: store.identify(props.post),
        fields: {
          likeList(cachedLikeList, { readField }) {
            if(likePost.liked){
              return [...cachedLikeList, {user: user}]
            } else {
              return cachedLikeList.filter(
                likeRef => user.id !== readField('user', likeRef).id
              );
            }
          },
        },
      });
    },
    onError(error) {
      console.log(error)
    }
  })

  const handleLike = (event) => {
    const likeInput = {
      input: {
        postId: props.post.id
      }
    }
    likePostMutation({ variables: likeInput })
    setLikePost(event.target.checked)
  }

  const openPostModal = () => {

    if(props.me){
      if(post && post.id){
        //View Own Post
        props.openModalPost(post, false)
      } else {
        // create new post
        props.setModalDate(props.dayDate)
        props.setOpenModal(true)
      }
    } else {
      if(post && post.id){
        props.openModalPost(post, false)
      } 
    }
   
  }
  
  const handleComment = () => {
    props.openModalPost(post, true)
  }
  const getCellClass = () => {
    var cellClass = `${classes.cell}`
    if(props.viewMonth !== props.dayDate.month()){
      cellClass = `${cellClass} ${classes.previousCell}`
    }
    // var cellClass = props.viewMonth !== props.dayDate.month() ? `${classes.cell} ${classes.previousCell}` : `${classes.cell}`
    // if(props.me || post){
    //   cellClass = props.viewMonth !== props.dayDate.month() ? `${classes.cell} ${classes.previousCell} ${classes.hoverCell}` : `${classes.cell} ${classes.hoverCell}`
    // }
    if(props.me && !post){
      cellClass =  `${cellClass} ${classes.hoverCell}`
    }
    if(post){
      cellClass =  `${cellClass} ${classes.postCell}`
    }
    return cellClass
  }

  const handleShowMore = (isExpanded) => {
    console.log(isExpanded)
    console.log("TODO show more API call")
  }

  function showMore() {
    return (
      <Typography component="span" className={classes.showButton} variant={'body2'}>Show all</Typography>
    );
  }

  function showLess() {
    return (
      <Typography component="span" className={classes.showButton} variant={'body2'}>Show less</Typography>
    );
  }

  const cellRef = useRef(null);
  const [cellWidth, setCellWidth] = useState(null)
  useEffect(() => {
    if(!cellWidth && cellRef.current){
      setCellWidth(cellRef.current.offsetWidth-20)
    }
    if(today && props.me){
      if(!props.todayPost){
        props.setTodayPost(post)
      }
      
    }
  }, [cellWidth]);

  return (
    <Grid item xs={8} sm={8} md key={'week-day-'+props.dayDate.date()}
      className={getCellClass()} 
      onClick={props.me && !post ? openPostModal : () => {}}
      zeroMinWidth
      ref={cellRef}
    >
      <div style={{width: '100%', height: '24px'}}>
        <div style={{width: '100%', height: '24px'}}>
          <span className={classes.date}>
            {today ? <Avatar className={classes.today}>{props.dayDate.date()}</Avatar> : props.dayDate.date()}
          </span>
          {post && 
            <span style={{width: '24px', height: '24px'}}>
              <Typography 
                display={'inline'} 
                variant={'body2'} 
                className={today ? classes.todayTitle : classes.title}
                onClick={openPostModal}
              >
                {post.title}
              </Typography>
            </span>
          }
        </div>
      </div>
      <div>
        {post && post.activityList.map(activity => (
          <ActivityTile activity={activity} key={'day-activity-'+activity.id} team={true}/>
        ))}
      </div>
      <div>
      {post && post.note && cellWidth &&
          <ShowMoreText
            lines={12}
            more={showMore()}
            less={showLess()}
            className='show-more-content'
            anchorClass='show-more-anchor'
            onClick={handleShowMore}
            expanded={false}
            width={cellWidth}
          >
            <Typography className={classes.note} variant={'body2'}>{post.note}</Typography>
          </ShowMoreText>
        }
      </div>
      <div className={classes.spacer}/>
      {post && <>
        <Grid container direction='row' justify="space-between" className={classes.postActionBox}>
          <Grid item>
            <IconButton aria-label="add-comment" className={classes.likeButton} onClick={handleComment}>
              <AddCommentIcon fontSize="small"/>
            </IconButton>
          </Grid>
          <Grid item>
            <Checkbox 
              icon={<FavoriteBorder fontSize="small"/>} 
              checkedIcon={<Favorite fontSize="small"/>} 
              name="like"  
              className={classes.likeButton}
              checked={likePost} 
              onChange={handleLike} 
              disabled={likeLoading}
            />
          </Grid>
        </Grid>
        <div className={classes.commentSection}>
          {(post.commentList.length > 0) && <CalendarComments postId={props.post.id} comments={props.post.commentList} history={history}/>}
        </div>
      </>}
    </Grid>);
}