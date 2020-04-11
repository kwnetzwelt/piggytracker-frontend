import React, { useState, useEffect, useRef, createRef} from 'react';
import { makeStyles,withStyles,lighten } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './App.css';
import axios from 'axios';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Avatar, TextField, Card, CardContent, CardHeader } from '@material-ui/core';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider ,DatePicker} from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from "@material-ui/icons/AccountCircle";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ScheduleIcon from '@material-ui/icons/Schedule';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MuiVirtualizedTable from 'mui-virtualized-table';
import {AutoSizer} from 'react-virtualized';
import Config from './Config.js';
import Accounts from './Accounts.js';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bottomNavigation: {
    width: '100%',
  position: 'fixed',
  bottom: 0,
  },
  appBar: {
    position: 'sticky'
  },
  table : {
    
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  
  fab: {
    position: 'fixed',
    bottom: theme.spacing(11),
    right: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
  },
  accountsGrid : {
    flexGrow: 1
  }
}));

function App() {
  const apiEndpoint = Config.apiEndpoint;
  const classes = useStyles();
  
  useEffect(() => {
    restoreLoginState();
    return () => {
    }
  },[]);

  /* -- bottom navigation --*/
  
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dateTimeFormat = Intl.DateTimeFormat(Config.locale,Config.dateTimeFormat);
  const dateTimeFormatMonthName = Intl.DateTimeFormat(Config.locale,Config.dateTimeFormatMonthName);

  /* -- accounts view --*/
  const [catMonthOptionsMenuTarget, setCatMonthOptionsMenuTarget] = React.useState(null);
  const [catMonthOptionsMenuEntry, setCatMonthOptionsMenuEntry] = React.useState(null);
  const [IsMonthTargetsDialogOpen, monthTargetsDialogOpen] = useState(false); // hidden dialogs
  const [catMonthTargets, setCatMonthTargets] = useState([]);

  const catMonthOptionsMenuToggle = (event,tid) => {
    
    setCatMonthOptionsMenuEntry(tid);
    setCatMonthOptionsMenuTarget(event.currentTarget);

    const targets = accountValues.getTargetsForEditing(tid.month);

    setCatMonthTargets(targets);
  };

  const catMonthOptionsMenuHandleClose = () => {
    setCatMonthOptionsMenuTarget(null);
  };
  const catMonthOptionsMenuHandleClick = (e) => {
    showMonthTargetsDialog();
  }

  const showMonthTargetsDialog = () => {
    monthTargetsDialogOpen(true);
  }
  const hideMonthTargetsDialog = () => {
    monthTargetsDialogOpen(false);
    setCatMonthOptionsMenuTarget(null);
  }

  const submitMonthTargetsDialog = () => {
    hideMonthTargetsDialog();
  }
  /* -- data handling --*/
  const dataTableDataColumns = [
      {  header: "Date", name:"date",  cell:(row) => dateTimeFormat.format(new Date(row.date))},
      {  header: "Value", name:"value", alignItems: "right",      cell:(row) => Config.toCurrencyValue(row.value)} ,
      {  header: "Remunerator", name: "remunerator" },
      {  header: "Category",    name: "category"    },
      {  header: "Info",        name: "info"        }
    ];
  
  const [dataEntries,setDataEntries] = useState([]);
  const [accountValues,setAccountValues] = useState(new Accounts);
  const updateAccounts = (entries,targets) => {
    const newAccountValues = new Accounts(targets);
    entries.forEach(element => {
      newAccountValues.addEntry(element);
    });
    setAccountValues(newAccountValues);
    console.log(newAccountValues);
  }
  /* -- add Entry --*/
  const [entryDate,setEntryDate] = useState({value:new Date(),error:null});
  const [entryValue,setEntryValue] = useState({value:0,error:null});
  const [entryCategory,setEntryCategory] = useState({value:[],error:null});
  const [entryRemunerator,setEntryRemunerator] = useState({value:[],error:null});
  const [entryInfo,setEntryInfo] = useState({value:"",error:null});
  
  const [IsAddEntryDialogOpen, addEntryDialogOpen] = useState(false); // hidden dialogs
  const showAddEntryDialog = () => {
    addEntryDialogOpen(true);
  }
  const hideAddEntryDialog = () => {
    addEntryDialogOpen(false);
  }

  const submitAddEntryDialog = () => {
    var entry= 
    {
      date : entryDate.value,
      value : entryValue.value,
      category:entryCategory.value.toString(),
      remunerator:entryRemunerator.value.toString(),
      info:entryInfo.value.toString()
    }
    console.log(entry);
    axios({method:"POST",url : apiEndpoint + "/bill", headers: getAuthHeader(), data:entry}).then( result => {

      hideAddEntryDialog();
      //dataTable.current && dataTable.current.onQueryChange();
    }).catch(e => {
      console.error(e);
    });
  }

  const ensureMonetaryValue = (v) => {
    return parseFloat( parseInt(v * 100)) / 100;
  }
  /* -- auth --*/
  //const loginUsername = useRef(null);
  //const loginPassword = useRef(null);
  const loginUsernameInput = createRef();
  const loginPasswordInput = createRef();
  const [loginUsername,setLoginUsername] = useState({value:"JohnDoe",error:null});
  const [loginPassword,setLoginPassword] = useState({value:"123456",error:null});

  const [userProfile,setUserProfile] = useState(null);
  const [IsLoginDialogOpen, loginDialogOpen] = useState(false); // hidden dialogs
  const [loggedIn, setLoggedIn] = useState(false);
  const views = ["entries","accounts"];
  const [currentView, setCurrentView] = useState("entries");
  const [avatarContextMenuAnchor, setAvatarContextMenuAnchor] = useState(null);
  const avatarDisplay = createRef();
  
  const getAuthHeader = () => {
    return {'Authorization' : 'Bearer ' + localStorage.getItem('id_token')};
  }
  const restoreUserProfile = () => {
    axios({method:"GET",url : apiEndpoint + "/login", headers: getAuthHeader()}).then( result => {
      var receivedUserProfile = transformUserProfile(result.data);
      setUserProfile (receivedUserProfile);
      setLoggedIn(true);

      fetchAllData(250,0); // fetch 15 at a time
    });
  }

  const tempInsertData = [];
  const fetchAllData = (pageSize,page) => {
      axios({method:"GET",url : apiEndpoint + "/targets", headers:getAuthHeader()}).then( targetsResults => {
        var targetsData = targetsResults.data.data;
        axios({method:"GET",url : apiEndpoint + "/bills",params: {perPage:pageSize,page:page+1}, headers: getAuthHeader()}).then( result => {
          var data = result.data.data;
          var total = result.data.total;

          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            tempInsertData.push(element);
          }
          console.log(dataEntries.length);
          if(total > (page * pageSize + data.length))
          {
            setTimeout(fetchAllData, 1,pageSize, page+1);
          }else
          {
            console.log("done");
            
            setDataEntries(entries => tempInsertData);
            updateAccounts(tempInsertData,targetsData);
          }
        });
      });
  }

  const logout = () => {
    setUserProfile(null);
    setLoggedIn(false);
    storeAuthToken(null);
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
    if(token)
      localStorage.setItem("id_token", token);
    else
      localStorage.removeItem("id_token");
  }
  const showLoginDialog = () => {
    loginDialogOpen(true);
  }
  const hideLoginDialog = () => {
    loginDialogOpen(false);
  }
  const showAvatarContextMenu = () => {
    setAvatarContextMenuAnchor(avatarDisplay.current);
  }
  const hideAvatarContextMenu = (event) => {
    if(event.currentTarget.id === "avatar-context-menu-logout")
    {
      logout();
    }
    setAvatarContextMenuAnchor(null);
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
    setLoginUsername({value:loginUsername.value,error:null});
    setLoginPassword({value:loginPassword.value,error:null});
    var body = {
      username: loginUsername.value,
      password: loginPassword.value
    };
    console.log(JSON.stringify(body));
    axios.post(apiEndpoint + '/login',body
    ).then(result => {
      storeAuthToken(result.data.token);
      hideLoginDialog();
      // tryout token now to get userProfile and begin using the app
      restoreUserProfile(); 
    }).catch(error => {
      console.error(error);
      if(error.response.data.message === "user not found")
      {
        setLoginUsername({value:loginUsername.value,error:"Invalid Username"});
      }else
      {
        setLoginPassword({value:loginPassword.value,error:"Invalid Password"});
      }
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
      <AppBar position="static" className={classes.appBar}>
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
            <Avatar ref={avatarDisplay} aria-controls="avatar-context-menu" aria-haspopup="true" onClick={showAvatarContextMenu}>{userProfile.initials}</Avatar>
          }
        </Toolbar>
      </AppBar>
      
    
      {/* AVATAR CONTEXT MENU */}
      <Menu
        id="avatar-context-menu"
        anchorEl={avatarContextMenuAnchor}
        keepMounted
        open={Boolean(avatarContextMenuAnchor)}
        onClose={hideAvatarContextMenu}
      >
        {!loggedIn ?
          <MenuItem id="avatar-context-menu-fullname">ee</MenuItem>
          :
          <MenuItem id="avatar-context-menu-fullname">{userProfile.fullname}</MenuItem>
        }
        <MenuItem onClick={hideAvatarContextMenu} id="avatar-context-menu-logout">Logout</MenuItem>
      </Menu>

      {/* MONTHLY TARGET DIALOG */}
      <Dialog open={IsMonthTargetsDialogOpen} onClose={hideMonthTargetsDialog} aria-labelledby="form-dialog-add-entry-title">
      <DialogTitle id="form-dialog-add-entry-title">Monthly Target for {catMonthOptionsMenuEntry ? dateTimeFormatMonthName.format(new Date(catMonthOptionsMenuEntry.year,catMonthOptionsMenuEntry.actualMonth,1)) : ""}</DialogTitle>
      <DialogContent>
        {catMonthTargets.map(catTotal =>
          <p>{catTotal.category}-{catTotal.value}
          </p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={hideMonthTargetsDialog} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={submitMonthTargetsDialog} color="primary" disableElevation>
          Add
        </Button>
      </DialogActions>
      </Dialog>

      {/* ADD ENTRY DIALOG */}


      <Dialog open={IsAddEntryDialogOpen} onClose={hideAddEntryDialog} aria-labelledby="form-dialog-add-entry-title">
      <DialogTitle id="form-dialog-add-entry-title">Add Entry</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="entry-date"
            label="Date of purchase"
            value={entryDate.value}
            onChange={(e) =>setEntryDate({value:e,error:null})}
            InputProps={{
              startAdornment: <InputAdornment position="start"><ScheduleIcon /></InputAdornment>,
            }}
            fullWidth
          />
        </MuiPickersUtilsProvider>
        <TextField id="entry-value"
          label="Spending"
          InputProps={{
            startAdornment: <InputAdornment position="start"><MonetizationOnIcon /></InputAdornment>,
          }}
          fullWidth
          type="number"
          value={entryValue.value}
          onChange={(e) => setEntryValue({value:ensureMonetaryValue(e.target.value),error:null})}
        />

        <TextField id="entry-renumerator"
          label="Remunerator"
          InputProps={{
            startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
          }}
          fullWidth
          value={entryRemunerator.value}
          onChange={(e) => setEntryRemunerator({value:e.target.value,error:null})}
        />
          <TextField id="entry-category"
            label="Category"
            InputProps={{
              startAdornment: <InputAdornment position="start"><CheckCircleIcon /></InputAdornment>,
            }}
            fullWidth
            value={entryCategory.value}
            onChange={(e) => setEntryCategory({value:e.target.value,error:null})}
          />
        

        <TextField id="entry-info"
            label="Info"
            InputProps={{
              startAdornment: <InputAdornment position="start"><InfoIcon /></InputAdornment>,
            }}
            fullWidth
            multiline
            value={entryInfo.value}
            onChange={(e) => setEntryInfo({value:e.target.value,error:null})}
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
      <form className={classes.root} noValidate>
    
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        
        
        <TextField
          id="login-username"
          label="Username"
          type="text"
          autoComplete="current-username"
          onChange={(e) =>{setLoginUsername({value:e.target.value,error:null});}}
          ref={loginUsernameInput}
          error={loginUsername.error}
          helperText={loginUsername.error}
          fullWidth
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) => {setLoginPassword({value:e.target.value,error:null});}}
          ref={loginPasswordInput}
          error={loginPassword.error}
          helperText={loginPassword.error}
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
      </form>
      </Dialog>
              
      {loggedIn && (currentView === "entries") && 
        <div style={{ height: 'calc(90vh)' }}>
          <AutoSizer>
            {({height, width}) => (

              <MuiVirtualizedTable className={classes.table}
              width={width}
              height={height}
              fixedRowCount={1}
              columns={dataTableDataColumns}
              rowHeight={56}
              data={dataEntries}
              includeHeaders={true}
              >
              </MuiVirtualizedTable>
            )}
          </AutoSizer>
    
        </div>
      }
      {loggedIn && (currentView === "accounts") && 
       
        <div style={{ height: 'calc(90vh)',paddingLeft: 20, paddingRight: 20,paddingTop: 20 }}>
          
                <Menu
                  id="Month-Options-Menu"
                  anchorEl={catMonthOptionsMenuTarget}
                  keepMounted
                  open={Boolean(catMonthOptionsMenuTarget)}
                  onClose={catMonthOptionsMenuHandleClose}
                >
                  <MenuItem onClick={e => catMonthOptionsMenuHandleClick("targets")}>Targets</MenuItem>
                </Menu>

              <Grid container justify="center" spacing={1} className={classes.accountsGrid}>
                    {accountValues.categoryMonths.map((catMonth) => 
                <Grid key={catMonth.month} item  xs>
                  <Card className={classes.root}>
                  
                    <CardHeader title={dateTimeFormatMonthName.format(new Date(catMonth.year,catMonth.actualMonth,1))}
                      action={
                        <IconButton aria-label="settings" onClick={e => catMonthOptionsMenuToggle(e,catMonth)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                    </CardHeader>
                    <CardContent align="left">
                      
                      <Typography gutterBottom variant="subtitle1">
                        <span>Percent of Money spent vs. Percent of Month: </span>
                        <span justify="flex-end">12% - 50%</span>
                      </Typography>
                      <LinearProgress variant="determinate" name="moneySpent" value={50} />
                      <LinearProgress variant="determinate" name="monthPast" value={55} />
                      <Table className={classes.table} aria-label="simple table">
                        <TableBody>
                        {catMonth.totals.map((entry) =>
                          <TableRow key={entry.category}>
                            <TableCell>{entry.category}</TableCell>
                            <TableCell align="right">{entry.value}</TableCell>
                            <TableCell align="right">{accountValues.getTargetValue(catMonth.month, entry.category)}</TableCell>
                          </TableRow>
                        )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
                    )}
          </Grid>
        </div>
      }
      
      
<BottomNavigation
  value={value}
  onChange={(event, newValue) => {
    setValue(newValue);
    setCurrentView(views[newValue]);
  }}
  showLabels
  className={classes.bottomNavigation}
>



  <BottomNavigationAction label="Entries" icon={<ReceiptIcon />} />
  <BottomNavigationAction label="Accounts" icon={<AccountBalanceIcon />} />
</BottomNavigation>
      {loggedIn &&
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={showAddEntryDialog}>
          <AddIcon />
        </Fab>
      }

    </div>
    


  );
}

export default App;
