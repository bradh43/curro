import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../auth';
import { SearchBar } from '../Search/SearchBar';
import { NotificationBell } from '../Notification/NotificationBell';
import { withRouter } from 'react-router-dom';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
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
var _fetchedUser = false

export const UserNavBar = props => {

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
      }
    }
  `;

  const QUERY_USER = gql`
    query getUser($id: ID!){
      user(id: $id){
        id
        username
        first
        last
        profilePictureURL
      }
    }
  `;

  const { history, location } = props;
  const classes = useStyles();
  const { user } = useContext(AuthContext)
  const settingsButtonRef = useRef()
  const [getUser, { loading, data }] = useLazyQuery(props.me ? QUERY_ME : QUERY_USER);
  
  if(data && props.userid && data.user && data.user.id !== props.userid){
    _fetchedUser = false
  }
  
  const [currentPage, setCurrentPage] = useState('/calendar')
  useEffect(() => {
    if(props.me){
      getUser()
    } else {
      const input = {
        variables: {
          id: props.userid
        }
      }
      getUser(input)
    }
    
  }, [props.me, props.userid])
  
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

  
  return (
    <div className={classes.root} >
      <span className={classes.navbarSide}>
        <Avatar 
          alt='Profile Picture'
          variant='circle' 
          src={props.me ? ((data && data.me) ? data.me.profilePictureURL : "") : ((data && data.user) ? data.user.profilePictureURL : "")}
          className={classes.profilePicture}
        />
        {!props.me && data && data.user && 
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            style={{textTransform: 'none'}}
            onClick={() => props.setViewValue(0)}
            size="large"
          >
            {data.user.first + '\'s Calendar'}
          </Button>}
        {props.me && <TeamSelectDropdown 
            history={history}
            setViewValue={props.setViewValue}
            teamList={(data && data.me && data.me.teamList) ? data.me.teamList: []}
            setSelectedTeamId={0}
            teamName={'My Calendar'}
            user={(data && data.me) ? data.me : ""}
        />}
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
          <Tab label="Profile" />
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
            <MenuItem onClick={handleSundayFirst}>Sundays First</MenuItem>
            <MenuItem onClick={handleMondayFirst}>Mondays First</MenuItem>
          </Menu>
        </div>}
      </span>
    </div>);

}