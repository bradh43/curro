import React, { useState, useEffect, useStyles } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import { Avatar } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);



export default function TeamSelectDropdown({ teamList, user, setViewValue, history, teamName }) {

    const TeamMenuItem = ({ teamName, teamId, teamImageURL }) => {
        const handleTeamClick = (e) => {
            // setView("team");
            //setSelectedTeamId(teamId);
            if(teamName === 'My Calendar'){
                history.push({
                    pathname: '/',
                    state: { 
                      welcome: false,
                      calendar: true,
                    }
                  })
            } else {
                history.push({
                    pathname: '/team/'+teamId,
                    state: { 
                      welcome: false,
                      calendar: true,
                    }
                  })
            }
            setCurrentTeam(teamName)
            handleClose();
        }
        return (
            <StyledMenuItem value={"" + teamId} onClick={handleTeamClick}>
                <ListItemIcon>
                    <Avatar
                        aria-label="team-picture"
                        // onClick={navigateToUserProfile}      Clicking the image doesn't take you to the team page
                        alt="User Profile"
                        src={teamImageURL}
                        variant={teamName === 'My Calendar' ? 'circle' : 'square'}
                    />
                </ListItemIcon>
                <ListItemText primary={teamName} />
            </StyledMenuItem>
        )
    }
    // const classes = useStyles();
    // const useStyles = makeStyles((theme) => ({

    // }));
    

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [currentTeam, setCurrentTeam] = useState(teamName);

    useEffect(()=> {
        if(teamName !== currentTeam){
            setCurrentTeam(teamName)
        }
    })

    return (
        <div>
            <Button
                onClick={handleClick}
                size="large"
                style={{height: 48, textTransform: 'none'}}
            >
              {currentTeam}
               <ExpandMoreIcon />
            </Button>

            <StyledMenu
                id={"customized-menu"}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
              <TeamMenuItem 
                  teamName={'My Calendar'}
                  teamImageURL={user ? user.profilePictureURL : ''}
                  key={'dropdown-My-Calendar'}
              />
                {teamList.map(team => {
                    return (
                        <TeamMenuItem 
                            teamName={team.name} 
                            teamId={team.id}
                            teamImageURL={team ? team.profilePictureURL : ''}
                            key={`dropdown-${team.id}-${team.name}`}
                        />
                    )
                })}
            </StyledMenu>
        </div>
    );
}