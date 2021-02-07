import React, { useContext, useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { AuthContext } from '../../auth';
import { ActivityTile } from './ActivityTile';
import { Comments } from './Comments';
import { AddComment } from './AddComment';
import { LikeButton } from './LikeButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItem from '@material-ui/core/ListItem';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import MenuItem from '@material-ui/core/MenuItem';
// import Menu from '@material-ui/core/Menu';
// import ReportIcon from '@material-ui/icons/Report';
import EditIcon from '@material-ui/icons/Edit';
import { GET_POST_QUERY } from '../../utils/graphql';
import produce from 'immer';
import Moment from 'moment';


export const PostCard = props => {
  const useStyles = makeStyles((theme) => ({
    card: {
      margin: 0,
      width: "100%",
    },
    cardContent: {
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    profilePicture: {
      width: '48px',
      height: '48px',
      cursor: 'pointer',
    },
    gridList: {      
      flexWrap: 'nowrap',
    },
    activityGrid: {
      padding: 0,
      margin: '16px 0 16px 0',
      width: '100%',
      flexWrap: 'wrap',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    cardActions: {
      padding: "0 16px 0 16px",
    },
    commentSection: {
      padding: "16px",
      paddingTop: 0,
    },
    postMenu: {
      marginTop: '32px',
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
  
  const [postLikeCount, setPostLikeCount] = useState(props.post.likeList.length)
  const [likePost, setLikePost] = useState(didUserLikePost(props.post.likeList))
  // TODO This is for if we want to have a report button
  // const [openPostMenu, setOpenPostMenu] = useState(false)
  // const postButtonRef = useRef()

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
    setPostLikeCount(event.target.checked ? postLikeCount + 1 : postLikeCount - 1)
    const likeInput = {
      input: {
        postId: props.post.id
      }
    }

    likePostMutation({ variables: likeInput })
    setLikePost(event.target.checked)
  }


  const formatDate = (postDate) => {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var date = Moment(postDate) 

    return date.format("LL")
  }

  const navigateToUserProfile = () => { 
    history.push('user/'+props.post.author.id)
  }

  
  const classes = useStyles();

  return (
    
      <Card className={classes.card}>
        <CardHeader
          avatar={
            props.loading ? <Skeleton animation="wave" variant="circle" width={40} height={40} />
            : <Avatar 
              aria-label="profile-picture" 
              className={classes.profilePicture}
              onClick={navigateToUserProfile}
              alt="User Profile"
              src={props.post.author.profilePictureURL}
            />           
          }
          title={
            props.loading ? (
              <Skeleton animation="wave" width="40%" />
            ) : (
                <span className={classes.profileClick} onClick={navigateToUserProfile}>{props.post.author.first + ' ' + props.post.author.last}</span>
              )
          }
          subheader={props.loading ? 
            <Skeleton animation="wave" width="20%" /> : 
            <span className={classes.profileClick} onClick={navigateToUserProfile}>{props.post.author.username}</span>
          }
          action={
            (!props.loading && user.id === props.post.author.id) && (
              <Tooltip title="Edit" enterDelay={400}>
                <IconButton aria-label="edit" onClick={() => { 
                    // setOpenPostMenu(false); 
                    props.setEditPost(props.post); 
                    props.openEditPostModal()
                }}>
                  <EditIcon/>              
                </IconButton>
              </Tooltip>
            )
          }
        />
        {/* FOR FUTURE WHEN WE WANT A REPORT BUTTON
        <Menu
          id={"post-menu-"+props.post.id}
          className={classes.postMenu}
          anchorEl={postButtonRef.current}
          open={openPostMenu}
          onClose={() => setOpenPostMenu(false)}
        >
          { user.id === props.post.author.id &&
            <MenuItem onClick={() => {setOpenPostMenu(false); props.setEditPost(props.post); props.setEditPostModal(true)}}>
              <ListItemIcon style={{minWidth: 32}}>
                <EditIcon fontSize="small"/>
              </ListItemIcon>
              <Typography variant="inherit" >Edit</Typography>
            </MenuItem>
          }
          <MenuItem onClick={() => console.log("Report")}>
            <ListItemIcon style={{minWidth: 32}}>
              <ReportIcon fontSize="small"/>
            </ListItemIcon>
            <Typography variant="inherit" >Report</Typography>
          </MenuItem>
        </Menu> */}
        <CardContent className={classes.cardContent}>
          {props.loading ? (
            <React.Fragment>
              <Skeleton animation="wave" width="70%" height={40} style={{ marginBottom: 8 }} />
              <Skeleton animation="wave"  width="100%" variant="rect" height={74} style={{ marginBottom: 8 }} />        
              <Skeleton animation="wave" style={{ marginBottom: 8 }} />
              <Skeleton animation="wave" width="90%" style={{ marginBottom: 8 }} />
              <Skeleton animation="wave" style={{ marginBottom: 8 }} />
              <Skeleton animation="wave" width="70%" style={{ marginBottom: 16 }} />
            </React.Fragment>
          ) : (
            <div>
              <Typography variant="h5">{props.post.title}</Typography>
              {props.post.activityList.length > 0 && <div className={classes.activityGrid}>
                <List>
                  {props.post.activityList.map((activity) => (
                    <ActivityTile 
                      key={"activity" + activity.id}
                      activity={activity} 
                      edit={false}
                    />
                  ))}
                </List>
              </div>}
              <Typography variant="body1" component="p">{props.post.note}</Typography>

            </div>
            )}
        </CardContent>
        <CardActions className={classes.cardActions}>
          {props.loading ? 
            <Skeleton animation="wave" height={32} width="30%"/> :
            <LikeButton likeCount={postLikeCount} isLiked={likePost} handleLike={handleLike} loading={likeLoading}/>}
        </CardActions>
        {props.loading ? <div className={classes.commentSection}>
          <Skeleton animation="wave" width="55%" style={{ marginBottom: 8 }} />
          <Skeleton animation="wave" width="45%" style={{ marginBottom: 8 }} />
          <Skeleton animation="wave" width="20%" style={{ marginBottom: 8 }} />
        </div>
        : <div className={classes.commentSection}>
          {(props.post.commentList.length > 0) && <Comments postId={props.post.id} comments={props.post.commentList} history={history}/>}
          <AddComment post={props.post} isCommenting={props.isCommenting}/>
          <Typography variant="body2" color="textSecondary" style={{marginBottom:8, marginTop:8}}>
            {formatDate(props.post.postDate)}
          </Typography>
        </div> }
        
      </Card>
    );
}