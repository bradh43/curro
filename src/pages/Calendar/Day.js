import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import { ActivityTile } from './ActivityTile';
import moment from 'moment';

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
      opacity: 0.7
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
      color: '#1a1a1a',
      fontWeight: '600',
      width: 'calc(((100vw - 32px) / 8) - 50px)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&:hover': {
        color: theme.palette.primary.main,
      }
    },
    todayTitle: {
      marginLeft: 32,
      width: 'calc(((100vw - 32px) / 8) - 58px)',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      color: '#1a1a1a',
      fontWeight: '600',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&:hover': {
        color: theme.palette.primary.main,
      }
    },
}));



export const Day = (props) => {

  const post = props.post

  const openPostModal = () => {
    if(props.me){
      if(post && post.id){
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

  const isToday = (someDate) => { 
    return someDate.isSame(moment(), 'day')
  }

  const classes = useStyles();
  const today = isToday(props.dayDate)

  useEffect(() => {
    if(today){
      if(!props.todayPost){
        console.log("Setting callback function")

        props.setTodayPost(post)
      }
      
    }
  })

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
  
  return (
    <Box 
      className={getCellClass()} 
      onClick={openPostModal}
    >
      <div style={{width: '100%', height: '24px'}}>
        <div style={{width: '100%', height: '24px'}}>
          <span className={classes.date}>
            {today ? <Avatar className={classes.today}>{props.dayDate.date()}</Avatar> : props.dayDate.date()}
          </span>
          {post && 
            <Hidden xsDown>
              <span style={{width: '24px', height: '24px'}}>
                <Typography display={'inline'} variant={'body2'} className={today ? classes.todayTitle : classes.title}>{post.title}</Typography>
              </span>
            </Hidden>
            }
        </div>
        <div>
          {post && post.activityList.map(activity => (
            <ActivityTile activity={activity} key={'day-activity-'+activity.id}/>
          ))}
        </div>
      </div>
    </Box>);
}