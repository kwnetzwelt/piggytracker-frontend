import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import axios from 'axios';
import Config from './Config';
import API from './API';
import { Card, CardMedia, CardContent, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Button, DialogActions } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
/**
 * 
 * @param {wastrel, next, user} props 
 */
export default function WastrelCard(props) {

  const [state, setState] = React.useState({
    wastrel: props.wastrel,
    next: props.next,
    user: props.user,
    wastrelMenuOpen: null,
    wastrelOffsetDialogOpen: false,
    offset: 0
  })
  const beginEditingWastrel = (e, wastrel) => {
    
    setState({...state, wastrelMenuOpen: e.target, offset: state.wastrel.offset});
  }
  const hideWastrelMenu = () => {
    setState({...state, wastrelMenuOpen: null});
  }
  const editWastrelOffset = () => {
    setState({...state, wastrelMenuOpen: false, wastrelOffsetDialogOpen: true});
  }
  const endEditingWastrel = (save) => {
    setState({...state, wastrelOffsetDialogOpen: false});
    if(save)
    {
      const updatedData = {remunerator : {name: state.wastrel.remunerator, offset: state.offset}};
      axios({method: "POST", url : API.apiEndpoint + "/remunerator" , headers: API.getAuthHeader(), data:updatedData}).then( result => {
        console.log(JSON.stringify(result));
      });
    }
  }

  const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        borderRadius:0
      },
      details: {
        display: 'flex',
        width:"66%",
        flexDirection: 'column',
      },
      content: {
        flexGrow:1,
      },
      cover: {
        width:"34%",
        height:"auto",
        flexGrow:0,
        backgroundSize:"cover"
      },
      controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
      },
      hugeMoney: {
          fontSize:50,
          fontWeight:"bolder"
      },
      wastrelDeltaText: {
        fontSize:12
      },
  }));

  const classes = useStyles();

  React.useEffect(
    () => {

      setState(s => ({...s, wastrel: props.wastrel, next: props.next, user:props.user}));
    },
[props]
  );
  return (
    <Card className={classes.root}>
        
        <div className={classes.details}>
        <CardContent className={classes.content}>
            
            {state.wastrel.remunerator}
            <Typography className={classes.hugeMoney}>
                {Config.toCurrencyValue(parseFloat(state.wastrel.value) + parseFloat(state.wastrel.offset))}
            </Typography>
            {state.next && 
            <Typography className={classes.wastrelDeltaText}>
                {Config.toCurrencyValue(parseFloat(state.wastrel.value) + parseFloat(state.wastrel.offset) - (parseFloat(state.next.value) + parseFloat(state.next.offset)))} too much!
            </Typography>
            }
        
            </CardContent>
            
      </div>
      <CardMedia
        className={classes.cover}
        image={API.getRemuneratorUrl(state.user.groupId, state.wastrel.remunerator)}
        title={state.wastrel.remunerator}
      />
      <IconButton size="small" aria-label="settings" onClick={(e) => beginEditingWastrel(e,state.wastrel)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="Wastrel-Options-Menu"
            anchorEl={state.wastrelMenuOpen}
            keepMounted
            open={Boolean(state.wastrelMenuOpen)}
            onClose={(e) => hideWastrelMenu()}
          >
            <MenuItem onClick={editWastrelOffset}>Set Offset</MenuItem>
          </Menu>
          <Dialog open={state.wastrelOffsetDialogOpen} onClose={() => endEditingWastrel(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Set Offset</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Each remunerator can have their own offset applied to their wastrel value. This way you can weight a remunerator depending on their spending prior to tracking in Piggytracker.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Offset"
                type="number"
                value={state.offset}
                onChange={(e) => setState({...state, offset: e.target.value})}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => endEditingWastrel(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => endEditingWastrel(true)} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
    </Card>
                    
                    
    );
}


        