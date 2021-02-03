import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../auth';
import { SearchBar } from '../Search/SearchBar';
import { NotificationBell } from '../Notification/NotificationBell';
import { withRouter } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import TodayIcon from '@material-ui/icons/Today';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InfoIcon from '@material-ui/icons/Info';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import TeamSelectDropdown from './TeamSelectDropdown';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

const CALENDAR_VIEW_VALUE = 0

export const TeamNavBar = props => {

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      padding: '16px 0 0 0'
    },
    spacer: {
      flexGrow: 1,
    },
    tabs: {
      backgroundColor: theme.palette.background.main,
      boxShadow: 'none',
      opacity: 1, 
    },
    teamSelect: {
      minWidth: 120,
      
    },
    select: {
      paddingRight: 8,
    },
    profilePicture: {
      margin: '4px 16px 0 16px',
    },
    settings: {
      marginRight: 16,
      position: 'absolute',
      right: 0,
    },
    addFab: {
      position: 'absolute',
      top: 8,
      right: 72,
    },
    addButton: {
      padding: '0 16px !important',
      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2)',
    },
    addIcon: {
      fontSize: 18,
    },
    navbarSide: {
      whiteSpace: 'nowrap',
      width: 248,
      display: 'flex',
      position: 'relative',
    }
  }));

  const QUERY_ME = gql`
    query {
      me {
        id
        username
        first
        last
        profilePictureURL
        teamList {
          id
          name
          profilePictureURL
        }
        requestedTeamList {
          id
        }
      }
    }
  `;

const TEAM_MEMBER_QUERY = gql`
  query getTeam($id: ID!){
    team(id: $id) {
      id
      name
      profilePictureURL
    }
  }
`;

const JOIN_TEAM = gql`
  mutation joinTeam($input: UserTeamInput!) {
    joinTeam(input: $input) {
      message
      success
      pending
    }
  }
`;

const LEAVE_TEAM = gql`
  mutation leaveTeam($input: UserTeamInput!) {
    leaveTeam(input: $input) {
      message
      success
    }
  }
`;


  const { history, location } = props;
  const classes = useStyles();
  const { user } = useContext(AuthContext)
  const settingsButtonRef = useRef()
  const {data, loading, error} = useQuery(QUERY_ME);
  const {data: teamData} = useQuery(TEAM_MEMBER_QUERY, {variables: {id: props.teamid}});

  const [joined, setJoined] = useState(false);
  const [requestPending, setRequestPending] = useState(false);

  // Check if the user is a part of the team
  if(!loading && data && props.teamid){
    
    var foundTeamFlag = false
    var requestedTeamFlag = false
    // loop through all of their teams and check for team id
    for(var i=0; i<data.me.teamList.length; i++){
      if(data.me.teamList[i].id === props.teamid){
        foundTeamFlag = true

        break;
      }
    }
    //if already in team list, don't need to check requestedTeamList as well
    if(!foundTeamFlag) {
      for(var i=0; i<data.me.requestedTeamList.length; i++){
        if(data.me.requestedTeamList[i].id === props.teamid){
          requestedTeamFlag = true
          break;
        }
      }
    }


    // prevent the page from doing too many re-renders
    if(joined !== foundTeamFlag){
      setJoined(foundTeamFlag) 
    }

    if(requestPending !== requestedTeamFlag){
      setRequestPending(requestedTeamFlag)
    }
  } 

  const [currentPage, setCurrentPage] = useState('/calendar')
  
  const handleChange = (event, newValue) => {
    props.setViewValue(newValue)
  };
  const [currentTeam, setCurrentTeam] = useState(0);

  const handleTeamChange = (event, newValue) => {
    setCurrentTeam(event.target.value)
  };

  const [openSettingsMenu, setOpenSettingsMenu] = useState(false)
  const handleSettingsClick = (event, newValue) => {
    setOpenSettingsMenu(!openSettingsMenu)
  }
  const handleSettingsClose = () => {
    setOpenSettingsMenu(false)
  }
  const handleSundayFirst = () => {
    props.setMondayFirst(false)
    setOpenSettingsMenu(false)
  }
  const handleMondayFirst = () => {
    props.setMondayFirst(true)
    setOpenSettingsMenu(false)
  }

  // const joinTeam = () => {
  //   const userInput = {
  //     input: {
  //       teamId: props.data.team.id
  //     }
  //   }
  //   joinTeamMutation({ variables: userInput })

  //   setOpenSettingsMenu(false)
  // }

  // const leaveTeam = () => {
  //   const userInput = {
  //     input: {
  //       teamId: props.data.team.id
  //     }
  //   }
  //   leaveTeamMutation({ variables: userInput })

  //   setOpenSettingsMenu(false)
  // }

  

  
  return (
    <div className={classes.root} >
      <span className={classes.navbarSide}>
        <Avatar 
          alt='Team Picture'
          variant='square' 
          src={(teamData && teamData.team && teamData.team.profilePictureURL) ? teamData.team.profilePictureURL : ""}
          className={classes.profilePicture}
        />
        <TeamSelectDropdown 
            history={history}
            setViewValue={props.setViewValue}
            teamList={(data && data.me && data.me.teamList) ? data.me.teamList: []}
            setSelectedTeamId={props.teamid}
            teamName={(teamData && teamData.team && teamData.team.name) ? teamData.team.name : ''}
            user={(data && data.me) ? data.me : ""}
        />
      </span>
      <div className={classes.spacer}></div>
      <Hidden xsDown>
        <Tabs
          value={props.viewValue}
          className={classes.tabs}
          indicatorColor="primary"
          centered
          onChange={handleChange}
        >
          <Tab label="Calendar" />
          <Tab label="Overview" />
        </Tabs>
      </Hidden>
      <div className={classes.spacer}></div>
      <span className={classes.navbarSide}>
        {props.viewValue === CALENDAR_VIEW_VALUE && 
          <Hidden xsDown>
            <span className={classes.addFab}>
              <Tooltip title="Post Today" enterDelay={400}>
                <Fab color="primary" aria-label="add" size="small" variant="extended" className={classes.addButton} onClick={() => {
                    props.setModalDate(new Date())
                    props.setOpenModal(true)
                  }
                }>
                  <AddIcon className={classes.addIcon}/>
                  Post
                </Fab>
              </Tooltip>
            </span>
            </Hidden>}
        {props.viewValue === CALENDAR_VIEW_VALUE && <div className={classes.settings} ref={settingsButtonRef}>
          <Tooltip title="Settings" enterDelay={400}>
            <IconButton 
              aria-label='settings'
              onClick={handleSettingsClick}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-settings"
            className={classes.settingsMenu}
            anchorEl={settingsButtonRef.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openSettingsMenu}
            onClose={handleSettingsClose}
          >
            {/* {!joined && !requestPending && <MenuItem onClick={joinTeam}>Join Team</MenuItem>}
            {joined && !requestPending && <MenuItem onClick={leaveTeam}>Leave Team</MenuItem>}
            {requestPending && <MenuItem>Request Pending</MenuItem>} */}
            <MenuItem onClick={handleSundayFirst}>Sundays First</MenuItem>
            <MenuItem onClick={handleMondayFirst}>Mondays First</MenuItem>
          </Menu>
        </div>}
      </span>
    </div>);

}