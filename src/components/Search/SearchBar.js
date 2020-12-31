import React, { useState, useRef, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import List from '@material-ui/core/List';
import { UserSearchTile } from './UserSearchTile';
import { TeamSearchTile } from './TeamSearchTile';
import { NoResults } from './NoResults';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 512,
    margin: 0,
    background: theme.palette.background.main,
    [theme.breakpoints.down('sm')]: {
      width: 256,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  iconButton: {
    padding: 10,
  },
  results: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
    maxHeight: "60vh",
    overflowY: 'scroll',
  },
  pagination: {
    width: '100%',
    margin: "16px auto 16px auto",
  },
  loadingResults: {
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    display: 'block',
  },
  searchArea: {
    width: 512,
    position: 'absolute',
    right: 160,
    top: 56,
    background: 'white',
    [theme.breakpoints.down('sm')]: {
      width: 256,
    },
  },
  filterButtons: {
    flex: 1,
    height: 24,
  },
  filterButton: {
    borderRadius: 0,
    width: 256,
    [theme.breakpoints.down('sm')]: {
      width: 128,
    },
  }
}));

const USER_SEARCH_QUERY = gql`
  query searchUser($search: String!){
    searchUser(search: $search){
      id
      first
      last
      profilePictureURL
      username
      bio
    }
  }
`;

const TEAM_SEARCH_QUERY = gql`
  query searchTeam($search: String!){
    searchTeam(search: $search){
      id
      name
      description
      profilePictureURL
      memberCount
      createdAt
    }
  }
`;


export const SearchBar = (props) => {

  const { history } = props;

  const searchBarRef = useRef()

  const [filters, setFilters] = useState(() => ['']);
  const [searchQuery, setSearchQuery] = useState('');
  const [validSearch, setValidSearch] = useState(false);

  const handleFilters = (event, newFilters) => {
    // Make sure there is always a filter selected
    if(newFilters){
      setFilters(newFilters);
      submitSearch(searchQuery, newFilters === "Users")
    }
  };


  const handleSearch = (event) => {
    const searchString = String(event.target.value)
    setSearchQuery(searchString);
    if(!validSearch && searchString.length >= 1){
      setValidSearch(true)
    } else if(searchString.length === 0) {
      setValidSearch(false)
    }
    submitSearch(searchString, filters.includes("Users"))
  };


  const handleKeypress = event => {
    //check if enter key pressed
    if(validSearch && event.key === 'Enter') {
      submitSearch(searchQuery, filters.includes("Users"));
    }
  }

  const openSearchArea = () => {
    // setSearchActive(true)
    props.handleSearchOpen()
    if(filters == ''){
      setFilters('Users')
    }
  }
  const closeSearchArea = () => {
    props.handleDrawerClose()
    setFilters('')
    setSearchQuery('')
    setValidSearch(false)
  }

  const [searchUserQuery, {data: userSearchData, loading: userSearchLoading, error}] = useLazyQuery(USER_SEARCH_QUERY)
  const [searchTeamQuery, {data: teamSearchData, loading: teamSearchLoading}] = useLazyQuery(TEAM_SEARCH_QUERY)

  const submitSearch = (searchString, userSearch) => {
    const searchInput = {
      variables: {
        search: searchString
      }
    }
    if(searchString){
      if(userSearch){
        searchUserQuery(searchInput)
      } else {
        searchTeamQuery(searchInput)
      }
    }
  }
  const classes = useStyles();

  return (
    <Hidden xsDown>
      <div className={classes.root} type="form" noValidate autoComplete="off">
        <InputBase
          className={classes.input}
          value={searchQuery}
          onChange={handleSearch}
          ref={searchBarRef}
          onFocus={openSearchArea}
          onKeyPress={handleKeypress}
          placeholder={"Search " + filters}
          inputProps={{ 'aria-label': 'search curro' }}
        />
        <IconButton className={classes.iconButton} aria-label="search" disabled={!validSearch}>
          <SearchIcon />
        </IconButton>
      </div>
      {props.openSearch &&
        <Box className={classes.searchArea} onFocus={openSearchArea}>
          <ToggleButtonGroup className={classes.filterButtons} value={filters} size="small" onChange={handleFilters} exclusive aria-label="search filters">
            <ToggleButton value="Users" className={classes.filterButton}>
              Users
            </ToggleButton>
            <ToggleButton value="Teams" className={classes.filterButton}>
              Teams
            </ToggleButton>
          </ToggleButtonGroup>
          <List className={classes.results}> 
            { userSearchLoading  ? <CircularProgress className={classes.loadingResults}/> :
            (filters.includes("Users") && userSearchData && userSearchData.searchUser) && 
            (userSearchData.searchUser.length >= 1 ?
              userSearchData.searchUser.map((user) => (
                <UserSearchTile key={"search-user-" + user.id} user={user} history={history} handleDrawerClose={closeSearchArea}/>
              )) :
              <NoResults/>)
            }
            { teamSearchLoading ? <CircularProgress className={classes.loadingResults}/> :
            (filters.includes("Teams") && teamSearchData && teamSearchData.searchTeam) && 
            (teamSearchData.searchTeam.length >= 1 ? 
              teamSearchData.searchTeam.map((team) => (
                <TeamSearchTile key={"search-team-" + team.id} team={team} history={history} handleDrawerClose={closeSearchArea}/>
              )) :
              <NoResults/>)
            }
            {/* TODO replace <NoResults/> here with suggested users and suggeseted team */}
            {(searchQuery.length === 0 && (!teamSearchData || !userSearchData)) && <NoResults/>}
          </List>
        </Box> }
    </Hidden>);
}