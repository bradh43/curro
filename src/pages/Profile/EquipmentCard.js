import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import AddIcon from '@material-ui/icons/Add';
import Equipment from "../../components/Equipment"
import List from '@material-ui/core/List';

export const EquipmentCard = props => {

  const useStyles = makeStyles((theme) => ({
    root: {
      margin: 16,
    },
    card: {
      margin: 16,
      [theme.breakpoints.down('xs')]: {
        marginTop: 0,
      },
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
    equipmentList:{
      width: '100%',
    },
  }));
  
  const handleOpenNewEquipment = () => {
    props.setCreateEquipmentType(props.type)
    props.setOpenCreateEquipmentModal(true);
  };

  const classes = useStyles();

  var equipmentListRender = [];
  var equipmentCount = 0
  if (!props.loading && props.me && props.data && props.data.me && props.data.me.equipmentList) {
    equipmentListRender = (props.me ? props.data.me.equipmentList : props.data.user.equipmentList).map((e) => 
      ((e.type === props.type) && <Equipment 
        key={e.id} data={e} 
        loading={props.loading} 
        name={e.name} 
        edit={props.me}
        progress={e.usage.value} 
        capacity={e.limit.value} 
        setOpenEquipmentModal={props.setOpenEquipmentModal} 
        setEditEquipmentData={props.setEditEquipmentData} 
      />)  
    );
    equipmentCount = (props.me ? props.data.me.equipmentList : props.data.user.equipmentList).filter((e) => e.type === props.type).length;
  }
  if (props.error) return (<div>
    <Typography variant="h5" style={{ margin: '16px' }}>ERROR: {props.error.message}</Typography>
  </div>);
  var titleText = (props.type).toLowerCase() + "s";
  titleText = titleText.charAt(0).toUpperCase() + titleText.slice(1);

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          action={
            (props.loading || !props.me) ? <></> : (
              <IconButton aria-label="edit" onClick={handleOpenNewEquipment}>
                <AddIcon />
              </IconButton>
            )
          }
          title={
            props.loading ? (
              <Skeleton animation="wave" width="80%" />
            ) : (
                titleText
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
            <List className={classes.equipmentList}>
                {equipmentCount === 0 ? "No " + titleText + " Added Yet" : equipmentListRender}
            </List>
            )}
        </CardContent>
      </Card>
    </div>);
}