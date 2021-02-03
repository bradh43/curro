import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../auth';
import { NewActivityModal } from '../../components/Modal/NewActivityModal';
import { ToolBar } from './ToolBar';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { WelcomeModal } from '../../components/Modal/WelcomeModal';
import { UserNavBar } from '../../components/Calendar/UserNavBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TodayIcon from '@material-ui/icons/Today';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import { ActivityTile } from './ActivityTile';
import moment from 'moment';
import { GET_POST_BY_ID_QUERY } from '../../utils/graphql';
import ShowMoreText from 'react-show-more-text';


const useStyles = makeStyles((theme) => ({
    cell: {
      height: '100%',
      width: '100%',
      border: "1px solid #E8E8E8",
      padding: 8,
      backgroundColor: '#ffffff',
      position: 'relative',
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
      [theme.breakpoints.down('xs')]: {
        backgroundColor: '#F8F2F4',
      },
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
      '&:hover': {
        color: theme.palette.primary.main,
      }
    },
    loading: {
      position: 'absolute',
      top: 16,
    },
    loadingBox: {
      width: 40,
      display: 'block',
      margin: 'auto',
      position: 'relative'
    },
    note: {
      marginTop: 8,
    },
    showButton: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      textDecoration: 'none',
    },
}));

const isToday = (someDate) => {
  return someDate.isSame(moment(), 'day')
}

var moreDetailPost = {}

export const TeamDay = (props) => {
  const classes = useStyles();
  const today = isToday(props.dayDate)

  const post = props.post

  const [getPost, { data, loading }] = useLazyQuery(GET_POST_BY_ID_QUERY, {
    onCompleted: (result) => {
      console.log("done...")
      moreDetailPost[post.id] = result.post
      props.setEditPost(result.post)
      props.setOpenModal(true)
      return 
    },
    onError: (error) => console.log(error)
  })


  const openPostModal = () => {
    if(props.me){
      if(post && post.id){
        // get post data
        getPost({
          variables: {id: post.id},
        })
        // if already seen before
        if(data && data.post){
          props.setEditPost(data.post)
          props.setOpenModal(true)
        }
      } else {
        // create new post
        props.setModalDate(props.dayDate)
        props.setOpenModal(true)
      }
    } else {
      if(post && post.id){
        // TODO View Details of User Post
        console.log("View User Post: ",post.id)
      } 
    }
   
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
    if(props.me || post){
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
      // console.log('width', cellRef.current.offsetWidth-19);
      // console.log("mount")
      setCellWidth(cellRef.current.offsetWidth-19)
    }
  }, [cellRef.current]);
  
  return (
    <Grid item xs={8} sm={8} md key={'week-day-'+props.dayDate.date()}
      className={getCellClass()} 
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
                className={classes.title}
                onClick={openPostModal}
              >
                {post.title}
              </Typography>
            </span>
          }
        </div>
        {loading && 
          <span className={classes.loadingBox}>
            <CircularProgress className={classes.loading}/>
          </span>
        }
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
      {/* <div>
        TODO: Comment Button Like Button
      </div> */}
    </Grid>);
}