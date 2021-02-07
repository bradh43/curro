import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import TeamListItem from "../../components/TeamListItem"

export const TeamListCard = props => {
  const { history } = props;
  const useStyles = makeStyles((theme) => ({
    root: {
      margin: 16,
    },
    card: {
      margin: 16,
    },
    cardContent: {
      paddingTop: '0px'
    },
    largeAvatar: {
      width: '128px',
      height: '128px',
    },
    media: {
      height: 190,
    },
    teamList:{
      width: '100%',
    },
  }));
  
  const handleOpenNewTeam = () => {
    props.setOpenCreateTeamModal(true);
  };

  const classes = useStyles();

  var teamListRender = [];
  var teamCount = 0
  if (!props.loading && props.data && (props.data.me || props.data.user)) {
    teamListRender = (props.me ? props.data.me.teamList : props.data.user.teamList).map((e) => 
      ((e.type === props.type) && <TeamListItem 
        key={"profile-team-"+e.id} 
        data={e} 
        loading={props.loading} 
        history={history}
      />)  
    );
    teamCount = (props.me ? props.data.me.teamList : props.data.user.teamList).filter((e) => e.type === props.type).length;
  }
  if (props.error) return (<div>
    <Typography variant="h5" style={{ margin: '16px' }}>ERROR: {props.error.message}</Typography>
  </div>);

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          action={
            (props.loading || !props.me) ? <></> : (
              <IconButton aria-label="edit" onClick={handleOpenNewTeam}>
                <AddIcon />
              </IconButton>
            )
          }
          title={
            props.loading ? (
              <Skeleton animation="wave" width="80%" />
            ) : (
                "Teams"
              )
          }
        />

        <CardContent className={classes.cardContent}>
          {props.loading ? (
            <React.Fragment>
              <Skeleton animation="wave" style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" width="90%" style={{ marginBottom: 16 }} />
              <Skeleton animation="wave" height={16} width="70%" />
            </React.Fragment>
          ) : (
            <List className={classes.teamList}>
                {teamCount === 0 ? "No Teams Added Yet" : teamListRender}
            </List>
            )}
        </CardContent>
      </Card>
    </div>);
}