import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import API from './API';
import GitHubIcon from '@material-ui/icons/GitHub';
import { DialogActions, Dialog, Typography, useTheme, useMediaQuery, DialogContent, DialogTitle, Button, FormControlLabel, Checkbox, IconButton, ListItem, List } from '@material-ui/core';


/**
 * 
 * @param {releaseNotes} props 
 */
export default function ReleaseNotes(props) {
    
  useEffect(
    () => {
        console.log(JSON.stringify( props));
        if(props.releaseNotes.versions !== undefined && props.releaseNotes.versions[0].version !== getLastReadVersion())
        {
            setState({ ...state, releaseNotes: props.releaseNotes, dialogOpen: true});
        }else
        {
            setState({ ...state, releaseNotes: props.releaseNotes, dialogOpen: false});
        }
    }
  ,[props]);

    const [state, setState] = React.useState({
        dialogOpen: false,
        releaseNotes: props.releaseNotes
    });
   
    
    const markRead = () => {
        localStorage.setItem("releaseNotesRead",state.releaseNotes.versions[0].version);
    };
    const getLastReadVersion = () => {
        return localStorage.getItem("releaseNotesRead");
    }

  const useStyles = makeStyles((theme) => ({
    root: {
      },
      dialogCloseButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
      },
    dtitle : {
    }
  }));

  const handleClose = () => {
    if(state.markRead)
    {
        markRead();
    }  
    setState({...state, dialogOpen: false});
  };
  const handleMarkReadChange = (value) => {
    setState({...state, markRead : !state.markRead});
  };

  const handleGotoGithub = () => {
    window.open("https://github.com/kwnetzwelt/piggytracker/", "_blank");
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  return (<Dialog open={state.dialogOpen} className={classes.root} fullScreen={fullScreen}>
      <DialogTitle id="responsive-dialog-title" className={classes.dtitle}>Release Notes
        <IconButton aria-label="close" className={classes.dialogCloseButton} onClick={handleGotoGithub}>
            <GitHubIcon />
          </IconButton>
        </DialogTitle>
      <DialogContent>
         
        <List>
        {state.releaseNotes.versions !== undefined && state.releaseNotes.versions.map(version => 
            <ListItem key={version.version} style={{display:"block",paddingLeft:0,paddingRight:0}}>
                <Typography variant="h6" component="div">{version.version}</Typography>
                <Typography variant="body1" component="pre">{version.content}</Typography>
            </ListItem>
        )} 
        </List>
         </DialogContent>
        <DialogActions>
            <FormControlLabel
            control={<Checkbox checked={state.markRead} onChange={handleMarkReadChange} name="checkedA" />}
            label="Mark read"
            />
          <Button onClick={handleClose} color="primary" autoFocus variant="contained">
            Ok
          </Button>
        </DialogActions>
    </Dialog>);
}


        