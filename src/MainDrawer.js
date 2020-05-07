import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { IconButton,  Drawer, Divider, Typography, useTheme } from '@material-ui/core';


/**
 * 
 * @param { categoryIconsClicked, isOpen, onClosed, accountValues } props 
 */
export default function MainDrawer(props) {
  React.useEffect(
    () => {
      console.log("changed " + props.isOpen);
      setState({ ...state, isOpen: props.isOpen });
    }
  ,[props]);
  const [state, setState] = React.useState({
    isOpen : props.isOpen ,
  });
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    props = {...props, isOpen : false};
    setState({ ...state, isOpen: props.isOpen });
    if(props.onClosed)
    {
      props.onClosed();
    }
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
    
    vspacer: {
      flexGrow: 1
    },
    versionString: {
      textAlign:"center"
    },
    
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },

    list: {
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  }));

  const theme = useTheme();
  const classes = useStyles();
  return (
        <React.Fragment>
          <Drawer variant="persistent" anchor="left" open={state.isOpen} onClose={toggleDrawer(false)} className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}>
            <div className={classes.drawerHeader}>
              <IconButton onClick={toggleDrawer(false)}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <List className={classes.list} subheader={<li />}>
                <li key="section-categories" className={classes.listSection}>
                  <ul className={classes.ul}>
                    <ListSubheader>Categories</ListSubheader>
                    {props.accountValues.categories.map((item) => (
                      <ListItem key={`item-categories-${item}`}>
                        <ListItemText primary={`${item}`} />
                      </ListItem>
                    ))}
                  </ul>
                </li>
            </List>
            <Divider />
            <List className={classes.list} subheader={<li />}>
                <li key="section-remunerators" className={classes.listSection}>
                  <ul className={classes.ul}>
                    <ListSubheader>Remunerators</ListSubheader>
                    {props.accountValues.remunerators.map((item) => (
                      <ListItem key={`item-remunerators-${item}`}>
                        <ListItemText primary={`${item}`} />
                      </ListItem>
                    ))}
                  </ul>
                </li>
            </List>
            <Typography display="block" className={classes.vspacer}></Typography>
            <Typography variant="overline" display="block" gutterBottom className={classes.versionString}>
            version: {process.env.REACT_APP_CURRENT_GIT_SHA}
            </Typography>
          </Drawer>
        </React.Fragment>            
  );
}