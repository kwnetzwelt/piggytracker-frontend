import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';
import GroupIcon from '@material-ui/icons/Group';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';




import Config from './Config';
import { Paper, Button, InputBase, IconButton, Divider, Typography, Container, Input } from '@material-ui/core';

/**
 * 
 * @param {user,groupName, refreshClicked, saveClicked, leaveClicked,value } props 
 */
export default function InviteCode(props) {
    
    var codeInput = undefined;
    
    const onRefreshClicked = (e) => {
        if(props.refreshClicked)
        props.refreshClicked(this);
    }
    const onSaveClicked = (e) => {
        console.log(props.value);
        e.preventDefault();
        if(props.saveClicked)
            props.saveClicked(props.value);
    }
    const onLeaveClicked = (e) => {
        e.preventDefault();
        if(props.leaveClicked)
            props.leaveClicked(this);
    }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        marginTop:theme.spacing(2),
        marginLeft:"auto",
        marginRight:"auto"
    },
    startIcon: {
        
        marginLeft: theme.spacing(1),
    },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontFamily:"monospace",
    fontWeight:"bold"

  },
  
  divider: {
    height: 28,
    margin: 4,
  },
  }));

  

  const classes = useStyles();
  return (
        <React.Fragment>
            {props.groupName && <Typography>
                You are part of a group already. To leave hit the <DeleteForeverIcon fontSize="small" /> button.
            </Typography> }
            {!props.groupName && <Typography>
                You can join a group by <RefreshIcon fontSize="small" /> creating an invite code and handing this code to another user, who might then enter it into their code-field and hit <SaveIcon fontSize="small" />. 
            </Typography> }
            <Paper component="form" className={classes.root}>
            {props.groupName && <React.Fragment>
                <GroupIcon className={classes.startIcon}/>
                <InputBase
                className={classes.input}
                placeholder="codeword1"
                value={props.groupName}
                inputProps={{ 'aria-label': 'invite code' }}
                disabled
                />
                <IconButton color="primary" type="submit" className={classes.iconButton} aria-label="Delete" onClick={onLeaveClicked}>
                    <DeleteForeverIcon />
                </IconButton>
            </React.Fragment> }
            
            {!props.groupName && <React.Fragment>
                
                <GroupIcon className={classes.startIcon}/>
                <InputBase
                className={classes.input}
                placeholder="abc123def"
                disableUnderline
                value={props.value}
                onChange={(e) => {props.setValue(e.target.value);}}
                inputProps={{ 'aria-label': 'invite code' }}
                />
                <IconButton color="primary" type="submit" className={classes.iconButton} aria-label="save" onClick={onSaveClicked}>
                    <SaveIcon />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
      
                <IconButton className={classes.iconButton} aria-label="refresh" onClick={onRefreshClicked}>
                    <RefreshIcon />
                </IconButton>
                
            </React.Fragment>}
            </Paper>     
            
        </React.Fragment>            
  );
}