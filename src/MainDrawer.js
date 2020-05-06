import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MenuIcon from '@material-ui/icons/Menu';


import { IconButton,  Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';


/**
 * 
 * @param { categoryIconsClicked } props 
 */
export default function MainDrawer(props) {
  const [state, setState] = React.useState({
    isOpen : false ,
  });
  
  const toggleDrawer = ( open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, isOpen: open });
  }
  const onActionClicked =  (event, target) => {
      event.preventDefault();
      if(target == "category" && props.categoryIconsClicked)
      {
        props.categoryIconsClicked();
      }
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
    vspacer: {
      flexGrow: 1
    },
    versionString: {
      textAlign:"center"
    }
    
  }));


  const classes = useStyles();
  return (
        <React.Fragment>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
            <Drawer anchor="left" open={state.isOpen} onClose={toggleDrawer(false)} className={classes.drawer}>
            <List>
              <ListItem button key="Category Icons" onClick={e => onActionClicked(e,"category")}>
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
            <Typography display="block" className={classes.vspacer}></Typography>
            <Typography variant="overline" display="block" gutterBottom className={classes.versionString}>
            version: {process.env.REACT_APP_CURRENT_GIT_SHA}
            </Typography>
          </Drawer>
        </React.Fragment>            
  );
}