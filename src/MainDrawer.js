import React from 'react';

import { FilePicker as ReactImagePicker} from 'react-file-picker';
import { makeStyles } from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { IconButton,  Drawer, Divider, Typography, useTheme, ListItemAvatar, Avatar, ListItemSecondaryAction, Box, Dialog, DialogContent, DialogTitle, DialogActions, MenuItem, Menu } from '@material-ui/core';
import API from './API';
import Axios from 'axios';

/**
 * 
 * @param { categoryIconsClicked, isOpen, onClosed, accountValues, user } props 
 */
export default function MainDrawer(props) {
  React.useEffect(
    () => {
      console.log("changed " + props.isOpen);
      setState({ ...state, isOpen: props.isOpen, user: props.user });
    }
  ,[props]);
  const [state, setState] = React.useState({
    isOpen : props.isOpen ,
    user : props.user,
    elementType : null,
    elementKey: null,
    elementMenuOpen : false
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
  const beginEditingRemuneratorEntry = (e,item) => {
    setState({...state, elementType:"Remunerator", elementKey: item, elementMenuOpen : e.target});
  }
  const beginEditingCategoryEntry = (e,item) => {
    setState({...state, elementType:"Category", elementKey: item, elementMenuOpen: e.target});
  }
  const uploadImage =(fileObject) => {
    
    var data = new FormData();
    data.append(state.elementType.toLowerCase(), API.urlify(state.elementKey));
    data.append('image', fileObject);

    Axios({method:"POST",url : API.apiEndpoint + "/images/" + state.elementType.toLowerCase(), headers: API.getAuthHeader(), data:data}).then( result => {
        
      console.log(JSON.stringify(result));      
    }).finally(() =>{
      
    });


  }
  const hideElementMenu = (e) => {
    setState({...state, elementMenuOpen: null});
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
                        <ListItemAvatar>
                          <Avatar src={API.getCategoryUrl(state.user.groupId,item)}>
                            {API.getUserInitials(item)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`${item}`} />
                        
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="menu" onClick={(e) => beginEditingCategoryEntry(e,item)}>
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </ul>
                </li>
            </List>
            <Divider />
            <List className={classes.list} subheader={<li />}>
                <li key="section-remunerators" className={classes.listSection}>
                  <ul className={classes.ul}>
                    <ListSubheader>
                      Remunerators
                    </ListSubheader>
                    {props.accountValues.remunerators.map((item) => (
                      <ListItem key={`item-remunerators-${item}`}>

                        <ListItemAvatar>
                          <Avatar src={API.getRemuneratorUrl(props.user.groupId,item)}>
                            {API.getUserInitials(item)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={`${item}`} />
                        
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="menu" onClick={(e) => beginEditingRemuneratorEntry(e,item)}>
                            <MoreVertIcon />
                          </IconButton>

                          
                        </ListItemSecondaryAction>
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
          <Menu
            id="MainDrawer-Element-Options-Menu"
            anchorEl={state.elementMenuOpen}
            keepMounted
            open={Boolean(state.elementMenuOpen)}
            onClose={(e) => hideElementMenu()}
          >
            <ReactImagePicker
              extensions={['jpg', 'jpeg', 'png']}
              onChange={FileObject => {uploadImage(FileObject)}}
              dims={{minWidth: 32, maxWidth: 2500, minHeight: 32, maxHeight: 2500}}><MenuItem>Change Icon</MenuItem></ReactImagePicker>
          </Menu>

        </React.Fragment>            
  );
}