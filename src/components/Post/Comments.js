import React, { useState } from 'react';
import { Comment } from './Comment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';


export const Comments = props => {

  var _fetchedAllComments = false

  const useStyles = makeStyles((theme) => ({
    comments: {
      padding: 0,
      margin: 0,
    },
   
  }));

  const classes = useStyles();
  const { history } = props;
  const [showComments, setShowComments] = useState(props.comments.length === 1)

  const showAllComments = () => {
    if(!_fetchedAllComments){
      _fetchedAllComments = true
    }
    setShowComments(!showComments)
  }

  return (
    <div>
      {(props.comments.length > 1) && <Button size="small" onClick={showAllComments}>{showComments ? "Hide Comments" : "View All " + props.comments.length + " Comments"}</Button>}
      {showComments && <React.Fragment>
        <Divider/>
        <Typography variant="subtitle1" >{props.comments.length + " Comment" + (props.comments.length === 1 ? "" : "s")}</Typography>
        <List className={classes.comments}>
          {props.comments.map((comment, index) => (
            <Comment key={"comment" + comment.id} comment={comment} postId={props.postId} history={history}/>
          ))}
        </List>
      </React.Fragment>}
    </div>
  );
}