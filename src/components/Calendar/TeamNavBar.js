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

export const TeamNavBar = props => {
  var _fetchedMe = false

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      margin: '16px 0 16px 0'
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
      paddingRight: 8
    },
    profilePicture: {
      margin: '0 16px 0 16px'
    },
    settings: {
      marginRight: 16
    }
  }));

  const QUERY_ME = gql`
  query {
    me {
      id
      username
      profilePictureURL
    }
  }
`;

  const { history, location } = props;
  const classes = useStyles();
  const { user } = useContext(AuthContext)
  const settingsButtonRef = useRef()
  var _fetchedMe = false
  const [getMe, { loading, data }] = useLazyQuery(QUERY_ME);
  
  if((user? true : false) && !_fetchedMe && (data? false : true) && !loading){
    _fetchedMe = true
    getMe()
  }
  //TODO figure out where we are
  // TODO bold just the one we are on
  const [currentPage, setCurrentPage] = useState('/calendar')
  useEffect(() => {

  })

  const handleChange = (event, newValue) => {
    props.setViewValue(newValue)
  };
  const [currentTeam, setCurrentTeam] = useState(0);

  const handleTeamChange = (event, newValue) => {
    console.log("Team Select", event.target.value)
    setCurrentTeam(event.target.value)
  };

  const [openSettingsMenu, setOpenSettingsMenu] = useState(false)
  const handleSettingsClick = (event, newValue) => {
    setOpenSettingsMenu(!openSettingsMenu)
  }
  const handleSettingsClose = () => {
    setOpenSettingsMenu(false)
  }

  return (
    <div className={classes.root} >
      <Avatar 
        alt='Profile Picture'
        variant='circle' 
        src={props.profile}
        // onClick={navigateToProfile}
        className={classes.profilePicture}
      />
     <FormControl className={classes.teamSelect}>
        {/* <InputLabel id="user-calendar-select-label">Team</InputLabel> */}
        <Select
          IconComponent={() => (
            <ExpandMoreIcon />
          )}
          labelId="user-calendar-select-label"
          id="user-calendar-select"
          value={currentTeam}
          onChange={handleTeamChange}
          disableUnderline={true}
        >
          {/* TODO map all user's teams to drop down */}
          <MenuItem className={classes.select} disableGutters={true} value={0}>My Calendar</MenuItem>
          <MenuItem value={1}>Team 2</MenuItem>
          <MenuItem value={2}>Team 3</MenuItem>
        </Select>
      </FormControl>
      <div className={classes.spacer}></div>
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
      <div className={classes.spacer}></div>
      <div className={classes.settings} ref={settingsButtonRef}>
      <IconButton 
        aria-label='settings'
        onClick={handleSettingsClick}
      >
        <SettingsIcon />
      </IconButton>
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
          <MenuItem onClick={() => {console.log("Settings Menu Item 1 clicked")}}>Settings Item 1</MenuItem>
          <MenuItem onClick={() => console.log("Settings Menu Item 2 clicked")} >Settings Item 2</MenuItem>
        </Menu>
        </div>
    </div>);

}