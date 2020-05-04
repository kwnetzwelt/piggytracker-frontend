import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MenuIcon from '@material-ui/icons/Menu';


import { IconButton,  Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

/**
 * 
 * @param {user, refreshClicked, saveClicked, leaveClicked,value } props 
 */
export default function MainDrawer(props) {
    
  const [state, setState] = React.useState({
    isOpen : false });
  
  const toggleDrawer = ( open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, isOpen: open });
  }
  const onActionClicked = (action) => (event) => {
      event.preventDefault();
      if(props.leaveClicked)
          props.leaveClicked(this);
  }
  
  const drawerWidth = 320;
  const useStyles = makeStyles((theme) => ({
    root: {
      
        
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    
  }));


  const classes = useStyles();
  return (
        <React.Fragment>

          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
            <Drawer anchor="left" open={state.isOpen} onClose={toggleDrawer(false)} className={classes.drawer}>
            <List>
              <ListItem button key="Edit Categories" disabled>
                <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                <ListItemText primary="Edit Categories" />
              </ListItem>
              <ListItem button key="Edit Remunerators" disabled>
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary="Edit Remunerators" />
              </ListItem>
              <Divider />
              <ListItem button key="Import CSV" disabled>
                <ListItemIcon><CloudUploadIcon /></ListItemIcon>
                <ListItemText primary="Import CSV" />
              </ListItem>
              <ListItem button key="Export CSV" disabled>
                <ListItemIcon><CloudDownloadIcon /></ListItemIcon>
                <ListItemText primary="Export CSV" />
              </ListItem>
            </List>
          </Drawer>

        </React.Fragment>            
  );
}