import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { Footer } from '../../components/Footer/Footer';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Pagination from '@material-ui/lab/Pagination';
import List from '@material-ui/core/List';
import { UserSearchTile } from '../../components/Search/UserSearchTile';
import { TeamSearchTile } from '../../components/Search/TeamSearchTile';
import { NoResults } from '../../components/Search/NoResults';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 512,
    margin: "16px auto 16px auto",
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      width: "100%",
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
    width: 512,
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      width: "100%",
    },
  },
  pagination: {
    width: '100%',
    margin: "16px auto 16px auto",
  },
  paginationControl: {
    width: '348px',
    margin: 'auto',
    userSelect: 'none',
  },
  loadingResults: {
    margin: 'auto',
    marginBottom: 16,
    display: 'block',
  },
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

var firstSearch = false

export const Explore = (props) => {

  const { history } = props;

  const [filters, setFilters] = useState(() => ['Users']);
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
    submitSearch();
  };

  const handleKeypress = event => {
    //check if enter key pressed
    if(validSearch && event.key === 'Enter') {
      submitSearch();
    }
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
  const emptySearch = () => {
    const searchInput = {
      variables: {
        search: 'a'
      }
    }
    if(filters.includes("Users")){
      searchUserQuery(searchInput)
    } else if (filters.includes("Teams")){
      searchTeamQuery(searchInput)
    }
  }

  useEffect(() => {
    if(!firstSearch){
      emptySearch()
      firstSearch = true
    }
  })

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.root} type="form" onSubmit={submitSearch} noValidate autoComplete="off">
        <InputBase
          className={classes.input}
          autoFocus
          value={searchQuery}
          onChange={handleSearch}
          onKeyPress={handleKeypress}
          placeholder={"Search " + filters}
          inputProps={{ 'aria-label': 'search curro' }}
        />
        <IconButton className={classes.iconButton} aria-label="search" onClick={submitSearch} type="submit" disabled={!validSearch}>
          <SearchIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <ToggleButtonGroup value={filters} size="small" onChange={handleFilters} exclusive aria-label="search filters">
          <ToggleButton value="Users" aria-label="bold">
            Users
          </ToggleButton>
          <ToggleButton value="Teams" aria-label="italic">
            Teams
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      <List className={classes.results}> 
        { userSearchLoading  ? <CircularProgress className={classes.loadingResults}/> :
        (filters.includes("Users") && userSearchData && userSearchData.searchUser) && 
        (userSearchData.searchUser.length >= 1 ?
          userSearchData.searchUser.map((user) => (
            <UserSearchTile key={"search-user-" + user.id} user={user} history={history}/>
          )) :
          <NoResults/>)
        }
        { teamSearchLoading ? <CircularProgress className={classes.loadingResults}/> :
        (filters.includes("Teams") && teamSearchData && teamSearchData.searchTeam) && 
        (teamSearchData.searchTeam.length >= 1 ? 
          teamSearchData.searchTeam.map((team) => (
            <TeamSearchTile key={"search-team-" + team.id} team={team} history={history}/>
          )) :
          <NoResults/>)
        }
      </List>
        
      {/* TODO add pagination */}
      {/* <div className={classes.pagination}>
        <Pagination count={10} color="secondary" className={classes.paginationControl}/>
      </div> */}
      <Footer history={history}/>
    </div>);
}