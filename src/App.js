import React, { useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Input from '@material-ui/core/Input';
//import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './App.css';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider ,DatePicker} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  
  const classes = useStyles();
  
  useEffect(() => {
    restoreLoginState();
    return () => {
    }
  },[]);

  /* -- add Entry --*/
  const [entryDate,setEntryDate] = useState(null);
  const [IsAddEntryDialogOpen, addEntryDialogOpen] = useState(false); // hidden dialogs
  const showAddEntryDialog = () => {
    addEntryDialogOpen(true);
  }
  const hideAddEntryDialog = () => {
    addEntryDialogOpen(false);
  }

  const submitAddEntryDialog = () => {

  }
  const handleEntryDateChange = (date) => {
    setEntryDate(date);
  }
  /* -- auth --*/
  const loginUsername = useRef(null);
  const loginPassword = useRef(null);
  const [userProfile,setUserProfile] = useState(null);
  const [IsLoginDialogOpen, loginDialogOpen] = useState(false); // hidden dialogs
  const [loggedIn, setLoggedIn] = useState(false);
  const getAuthHeader = () => {
    return {'Authorization' : 'Bearer ' + localStorage.getItem('id_token')};
  }
  const restoreUserProfile = () => {
    axios({method:"GET",url :"http://192.168.0.173:3000/login", headers: getAuthHeader()}).then( result => {
      var receivedUserProfile = transformUserProfile(result.data);
      setUserProfile (receivedUserProfile);
      setLoggedIn(true);
    });
  }
  const restoreAuthToken = () => {
    var authToken = localStorage.getItem("id_token");
    if(authToken)
    {
      return true;
    }
    return false;
  }
  const storeAuthToken = (token) =>
  {
    localStorage.setItem("id_token", token);
  }
  const showLoginDialog = () => {
    loginDialogOpen(true);
  }
  const hideLoginDialog = () => {
    loginDialogOpen(false);
  }


  const transformUserProfile = (profileData) => {
    var initials = profileData.fullname.split(' ');
    if(initials.length >= 2)
      profileData.initials = initials[0].charAt(0).toUpperCase() + initials[initials.length-1].charAt(0).toUpperCase();
    else
      profileData.initials = profileData.fullname.charAt(0).toUpperCase()
    return profileData;
  }
  const submitLoginDialog = (e) => {
    e.preventDefault();
    hideLoginDialog();
    var body = {
      username: loginUsername.current.value,
      password: loginPassword.current.value

    };
    console.log(JSON.stringify(body));
    axios.post('http://192.168.0.173:3000/login',body
    ).then(result => {
      storeAuthToken(result.data.token);
      // tryout token now to get userProfile and begin using the app
      restoreUserProfile();
     
    }).catch(error => {
      alert("failed!");
      console.error(JSON.stringify(error));
    });
  }
  const restoreLoginState = () => {
    if(restoreAuthToken())
    {
      restoreUserProfile();
    }
    
  }
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Haushalt
          </Typography>
          {!loggedIn ?
            <Button onClick={showLoginDialog} color="inherit">Login</Button>
            :
            <Avatar>{userProfile.initials}</Avatar>
          }
        </Toolbar>
      </AppBar>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={showAddEntryDialog}>
        <AddIcon />
      </Fab>

      {/* ADD ENTRY DIALOG */}


      <Dialog open={IsAddEntryDialogOpen} onClose={hideAddEntryDialog} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Entry</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={entryDate}
            onChange={handleEntryDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <Input
          autoFocus
          margin="dense"
          id="login-username"
          label="Username"
          type="text"
          fullWidth
          inputRef={loginUsername}
        />
        <Input inputRef={loginPassword}
          margin="dense"
          id="login-password"
          label="Password"
          type="password"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={hideAddEntryDialog} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={submitAddEntryDialog} color="primary" disableElevation>
          Add
        </Button>
      </DialogActions>
      </Dialog>

      {/* LOGIN DIALOG */}
      <Dialog open={IsLoginDialogOpen} onClose={hideLoginDialog} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        <Input
          autoFocus
          margin="dense"
          id="login-username"
          label="Username"
          type="text"
          fullWidth
          inputRef={loginUsername}
        />
        <Input inputRef={loginPassword}
          margin="dense"
          id="login-password"
          label="Password"
          type="password"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={hideLoginDialog} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={submitLoginDialog} color="primary">
          Login
        </Button>
      </DialogActions>
      </Dialog>
    </div>
    


  );
}

export default App;
