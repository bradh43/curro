import React, { useState, useRef } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Footer } from '../../components/Footer';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Pagination from '@material-ui/lab/Pagination';
import List from '@material-ui/core/List';
import { UserSearchTile } from './UserSearchTile';
import { TeamSearchTile } from './TeamSearchTile';
import Collapse from '@material-ui/core/Collapse';
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
    marginBottom: 16,
    display: 'block',
  },
  searchArea: {
    width: 512,
    position: 'absolute',
    right: 80,
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
    }
  };


  const handleSearch = (event) => {
    const searchString = String(event.target.value)
    if(!validSearch && searchString.length >= 1){
      setValidSearch(true)
    } else if(searchString.length === 0){
      setValidSearch(false)
    }
    setSearchQuery(searchString);
    if(searchString !== ""){
      submitSearch()
    }
    
  };

  const handleKeypress = event => {
    //check if enter key pressed
    if(validSearch && event.key === 'Enter') {
      submitSearch();
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

  const submitSearch = () => {
    const searchInput = {
      variables: {
        search: searchQuery
      }
    }
    if(filters.includes("Users")){
      searchUserQuery(searchInput)
    } else if (filters.includes("Teams")){
      searchTeamQuery(searchInput)
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
          </List>
        </Box> }
    </Hidden>);
}