import React, { useState, useEffect, createRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GoogleLogin from 'react-google-login';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './App.css';
import axios from 'axios';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton, Avatar, TextField, InputLabel, ThemeProvider, createMuiTheme, Box, withStyles, Badge, Chip, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Container } from '@material-ui/core';

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

import MuiVirtualizedTable from 'mui-virtualized-table';
import {AutoSizer} from 'react-virtualized';
import Config from './Config.js';
import {Accounts, MonthCategories} from './Accounts.js';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {red,blueGrey} from '@material-ui/core/colors';
import MonthCard from './MonthCard';
import InviteCode from './InviteCode';

import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import WastrelCard from './WastrelCard';
import MainDrawer from './MainDrawer';

const theme = createMuiTheme({
  palette: {
    criticalColor: {main:red[700]}
    ,
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#01579b',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: red[700],
      // dark: will be calculated from palette.secondary.main,
      //contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  dialogCloseButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  cardMedia: {
    objectPosition: "50% 66%"

  },
  futureCard:{
    backgroundColor: blueGrey[100]
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

  deleteButton: {
  }
  ,
  spacer : {
    flexGrow:1
  },
  dialogActions : {
    flexGrow: 1,
    justifyContent:"flex-start"
  },
  radioGroup: {
    marginTop:theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    display:'block'
  },
  
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  bottomNavigation: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    backgroundColor:blueGrey[50]
  },
  appBar: {
    position: 'sticky',
    backgroundColor: theme.primary
  },
  table : {
  },
  
  fab: {
    position: 'fixed',
    bottom: theme.spacing(9),
    right: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
  },
  accountsGrid : {
    flexGrow: 1,
    marginBottom:64
  },
  critical: {
    color: red[400],
    fontWeight:"bold"
  },
  versionString: {
    textAlign:"center"
  }
}));

const EntriesTable = withStyles((theme) => ({
    cellContents:{
      overflow :"visible"
    },
}))(MuiVirtualizedTable);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 18,
    height: 18,
    border: `1px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

function App() {


  const apiEndpoint = Config.apiEndpoint + Config.apiEndpointPrefixRoute;
  const classes = useStyles();
  
  useEffect(() => {
    restoreLoginState();
    return () => {
    }
  },[]);

  /* -- bottom navigation --*/
  
  const [value, setValue] = React.useState('recents');

  const dateTimeFormat = Intl.DateTimeFormat(Config.locale,Config.dateTimeFormat);
  const dateTimeFormatMonthName = Intl.DateTimeFormat(Config.locale,Config.dateTimeFormatMonthName);

  /* -- accounts view --*/
  const [catMonthOptionsMenuTarget, setCatMonthOptionsMenuTarget] = React.useState(null);
  const [monthTargetsObject, setMonthTargetsObject] = React.useState(null);
  const [IsMonthTargetsDialogOpen, monthTargetsDialogOpen] = useState(false); // hidden dialogs
  const [catMonthTargets, setCatMonthTargets] = useState([]);
  const [monthTargetsDialogSavingAllowed,setMonthTargetsDialogSavingAllowed] = useState(false);

  
  
  const catMonthOptionsMenuToggle = (event,tid) => {
    
    
    const target = accountValues.getTargetForEditing(tid.tid);
    setMonthTargetsObject(target);
    setCatMonthOptionsMenuTarget(event.currentTarget);

    setCatMonthTargets(target.totals);
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
    setMonthTargetsDialogSavingAllowed(true);
      const updatedTargetData = accountValues.setTargets(monthTargetsObject.tid,catMonthTargets);
      axios({method: updatedTargetData._id ? "PUT" : "POST",url : apiEndpoint + "/targets" + (updatedTargetData._id ? ("/"+updatedTargetData._id) : ("")), headers: getAuthHeader(), data:updatedTargetData}).then( result => {
        
        updatedTargetData._id = result.data._id;
        console.log("done");      
      }).finally(() =>{
        setMonthTargetsDialogSavingAllowed(false);
        hideMonthTargetsDialog();
      });
setMonthTargetsDialogSavingAllowed(false);
        hideMonthTargetsDialog();

  }
  const setCatMonthTargetValue = (target,value) => {
    
    const data = [...catMonthTargets];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if(element.category === target.category){
        data[index].value = parseFloat(value);
        break;
      }
    }
    setCatMonthTargets(data);
  }
  

  /* -- data handling --*/

  const dataTableDataColumns = (width) => {
    const arr = [
      {  width:60, header: "", name: "remunerator", cell:row => (
        <div className={classes.root}> <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={
          <SmallAvatar alt={row.category} 
        src={Config.getCategoryUrl(row.category)}
        />}
      >
        <Avatar alt={row.remunerator} src={Config.getAvatarUrl(row.remunerator)} />
        </Badge>
        </div>) },
      {   header: "Date", width: 91 , name:"date",  cell:(row) => dateTimeFormat.format(new Date(row.date))},
      {   header: "Value",  name:"value", alignItems: "right",      cell:(row) => Config.toCurrencyValue(row.value ?? 0)} ,
      {   header: "Category", name: "category", cell:row => (
      <Chip label={row.category} variant="outlined" size="small" avatar={<Avatar src={Config.getCategoryUrl(row.category)} />} />) }
      
      
    ];
    if(window.matchMedia("(orientation: landscape)").matches)
    {
      arr.push({  header: "Info",        name: "info"   , cell:(row) => {return (row.info.length > 10) ? row.info.substr(0,10)+"..." : row.info}     });
    }
    return arr;
  };
  const [dataEntries,setDataEntries] = useState([]);
  const [accountValues,setAccountValues] = useState(new Accounts());
  const [selectedEntryId,setSelectedEntryId] = useState(null);
  const selectedEntryIdRef = React.useRef(selectedEntryId);
  
  const updateAccounts = (entries,targets) => {
    if(!targets)
      targets = accountValues.targets;

    const newAccountValues = new Accounts(targets);
    entries.forEach(element => {
      newAccountValues.addEntry(element);
    });

    // Do we have a CatMonth Object for next month?
    // We want to be able to edit targets for next/upcoming month prior to having stent anything. 
    // We are thus making sure a CatMonth Object exists for the next month
    
    try
    {
      var d = new Date();
      d = new Date(d.getFullYear(),d.getMonth() +1,1);
      var tid = Accounts.getTidOfDate(d);
      var mc = new MonthCategories(tid);
      // this will throw an error if the MonthCategory already exists, we ignore it then. 
      newAccountValues.addCatMonth(mc);
    }catch
    {
      console.log("all is fine. future MonthCategory already in place. ");
    }
    console.log(JSON.stringify(newAccountValues));
    setAccountValues(newAccountValues);
  }

  const beginEditEntry = (entryId, clickedColumn) => {
   // (rowData._id, column.name)
   const entry = dataEntries.find((e) => e._id === entryId);
   setEntryDate({value:new Date(entry.date),error:null});
   setEntryValue({value:entry.value,error:null});
   setEntryRemunerator({value:entry.remunerator,error:null});
   setEntryCategory({value:entry.category,error:null});
   setEntryInfo({value:entry.info,error:null});
   //setEntryDate()
   showAddEntryDialog(entry._id);
  }

  const deleteSelectedEntry = (e) => {
    axios({method:"DELETE",url : apiEndpoint + "/bills/"+selectedEntryId, headers: getAuthHeader()}).then( result => {
      hideAddEntryDialog();
      var index = dataEntries.findIndex((e) => e._id === selectedEntryId);
      dataEntries.splice(index,1);
      sortDataEntries();
      updateAccounts(dataEntries);
    }).catch(e => {
      hideAddEntryDialog();
      console.error(e);
    });
  }

  /* -- add Entry --*/
  const [entryDate,setEntryDate] = useState({value:new Date(),error:null});
  const [entryValue,setEntryValue] = useState({value:0,error:null});
  const [entryCategory,setEntryCategory] = useState({value:"",error:null});
  const [entryRemunerator,setEntryRemunerator] = useState({value:"",error:null});
  const [entryInfo,setEntryInfo] = useState({value:"",error:null});
  
  const [IsAddEntryDialogOpen, addEntryDialogOpen] = useState(false); // hidden dialogs
  const [expandAddEntryDialog, setExpandAddEntryDialog] = useState(false);
    const showAddEntryDialog = (id) => {
    selectedEntryIdRef.current = id;
    setSelectedEntryId(id);
    if(!id)
    {
      setEntryDate({value:new Date(),error:null});
      setEntryValue({value:0,error:null});
      setEntryCategory({value:"",error:null});
      setEntryRemunerator({value:userProfile.fullname,error:null});
      setEntryInfo({value:"",error:null});
    }
    addEntryDialogOpen(true);
  }
  const hideAddEntryDialog = () => {
    selectedEntryIdRef.current = null;
    addEntryDialogOpen(false);
  }

  const submitAddEntryDialog = () => {
    var entry= 
    {
      date : entryDate.value.toISOString().substr(0,10),
      value : entryValue.value,
      category:entryCategory.value.toString(),
      remunerator:entryRemunerator.value.toString(),
      info:entryInfo.value.toString()
    }
    if(selectedEntryId)
    {
     entry._id = selectedEntryId;
    }
    axios({method:selectedEntryId ? "PUT" : "POST",url : apiEndpoint + "/bills" + (selectedEntryId ? ("/"+selectedEntryId) : ("")), headers: getAuthHeader(), data:entry}).then( result => {

      hideAddEntryDialog();
      
      if(selectedEntryId)
      {
        //edited entry updated successfully
        const index = dataEntries.findIndex((e) => e._id === selectedEntryId);
        dataEntries[index] = result.data;
      }else
      {
        //entry created successfully
        dataEntries.unshift(result.data);
      }
      selectedEntryIdRef.current = null;
      sortDataEntries();
      updateAccounts(dataEntries);

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

  const [userProfile,setUserProfile] = useState({groupName:""});
  const [IsLoginDialogOpen, loginDialogOpen] = useState(false); // hidden dialogs

  const [loggedIn, setLoggedIn] = useState(false);
  const loggedInRef = React.useRef(loggedIn);
  const views = ["entries","accounts","wastrel"];
  const [currentView, setCurrentView] = useState("entries");
  const avatarDisplay = createRef();
  
  const sortDataEntries = () => {
    dataEntries.sort( (e1,e2) => {
      const v1 = (e1.date - e2.date) 
      return v1 !== 0 ? v1 : e1.createdAt - e2.createdAt ;
    });
    setDataEntries(dataEntries);
  }
  const restoreUserProfile = () => {
    axios({method:"GET",url : apiEndpoint + "/login", headers: getAuthHeader()}).then( result => {
      var receivedUserProfile = transformUserProfile(result.data);
      loginComplete(receivedUserProfile, getStoredAuthToken());    
    }).catch((err) => {
      console.log("restoreUserProfile failed");
      setLoggedIn(false);
    });
  }


  const onSignIn = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    const id_token = googleUser.getAuthResponse().id_token;
    axios({method: "POST", url: Config.apiEndpoint + "/google/tokensignin", data:{idtoken:id_token,avatarUrl:profile.getImageUrl()}, headers:{
      contentType: 'application/x-www-form-urlencoded'
    }}).then(result =>{
      var receivedUserProfile = transformUserProfile(result.data.userProfile);
      
      storeAuthToken(result.data.token);
      loginComplete(receivedUserProfile, );
      
    });
  }

  const loginComplete = (receivedUserProfile, token) => {
    hideLoginDialog();
    setUserProfile (receivedUserProfile);
    setLoggedIn(true);
    fetchAllData(250,0);
  }

  const updateRate = 2500;
  let lastUpdateRun = 0;
  const runDataUpdate = () => {
    
    if(selectedEntryIdRef.current)
    {
      scheduleDataUpdate();
      return;
    }

    axios({method:"GET",url : apiEndpoint + "/targets", headers:getAuthHeader()}).then( targetsResults => {
      const targetsData = targetsResults.data.data; // data
      axios({method:"GET",url : apiEndpoint + "/updates",params: {updatedMillisecondsAgo:lastUpdateRun+500}, headers: getAuthHeader()}).then( result => {
        const changedEntries = result.data.data;
        for (let index = 0; index < changedEntries.length; index++) {
          const element = changedEntries[index];
          const e = dataEntries.findIndex((e) => e._id === element._id);
          if(e === -1)
          {
            if(element.deleted)
            {
              // we already deleted that locally
            }else
            {
              // new entry
              dataEntries.push(element);
            }
          }
          else
          {
            if(element.deleted)
              dataEntries.splice(e,1);
            else
              dataEntries.splice(e,1,element);
          }
          console.log(JSON.stringify(element));
        }
        sortDataEntries();
        updateAccounts(dataEntries,targetsData);
        lastUpdateRun = 0;
        scheduleDataUpdate();
      }).catch((error) => {
        if(error.response.status === 401)
          return;
        scheduleDataUpdate();

      });
    }).catch((error) => {
      
      if(error.response.status === 401)
        return;
      scheduleDataUpdate();
    });


  }

  const scheduleDataUpdate = () => {
    lastUpdateRun+= updateRate;
    setTimeout(runDataUpdate,updateRate);
  }

  const tempInsertData = [];
  const fetchAllData = (pageSize,page) => {
      axios({method:"GET",url : apiEndpoint + "/targets", headers:getAuthHeader()}).then( targetsResults => {
        var targetsData = targetsResults.data.data; // data
        axios({method:"GET",url : apiEndpoint + "/bills",params: {perPage:pageSize,page:page+1}, headers: getAuthHeader()}).then( result => {
          var data = result.data.data;
          var total = result.data.total;

          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            dataEntries.push(element);
          }
          if(total > (page * pageSize + data.length))
          {
            setTimeout(fetchAllData, 1,pageSize, page+1);
          }else
          {
            
            sortDataEntries();
            updateAccounts(dataEntries,targetsData);
            scheduleDataUpdate();
          }
        });
      });
  }

  const logout = () => {
    setDataEntries([]);
    setUserProfile(null);
    setLoggedIn(false);
    storeAuthToken(null);
  }
  
  const getStoredAuthToken = () => {
    return localStorage.getItem('id_token');
  }
  const getAuthHeader = () => {
    return {'Authorization' : "Bearer " + getStoredAuthToken()};
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
    setLoginError("");
    setLoginUsername({value:loginUsername,error:null});
    setLoginPassword({value:loginPassword,error:null});
  }
  const hideLoginDialog = () => {
    loginDialogOpen(false);
  }
  const hideAvatarContextMenu = (event) => {
    if(event.currentTarget.id === "avatar-context-menu-settings")
    {
      setIsUserProfileSettingsDialogOpen(true);
    }
    else if(event.currentTarget.id === "avatar-context-menu-logout")
    {
      logout();
    }
  }
  const getUserInitials = (fullname) => {
    
    var initials = fullname.split(' ');
    if(initials.length >= 2)
      return initials[0].charAt(0).toUpperCase() + initials[initials.length-1].charAt(0).toUpperCase();
    else
      return fullname.charAt(0).toUpperCase();
  }

  const transformUserProfile = (profileData) => {
    profileData.initials = getUserInitials(profileData.fullname);
    return profileData;
  }
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const submitLoginDialog = (e) => {
    setSubmittingLogin(true);
    setLoginError("");
    e.preventDefault();
    setLoginUsername({value:loginUsername.value,error:null});
    setLoginPassword({value:loginPassword.value,error:null});
    var body = {
      username: loginUsername.value,
      password: loginPassword.value
    };
    axios.post(apiEndpoint + '/login',body
    ).then(result => {
      setSubmittingLogin(false);
      setLoginError("");
      storeAuthToken(result.data.token);
      restoreUserProfile(); 
    }).catch(error => {
      setSubmittingLogin(false);
      console.error(error);
      if(error.response)
      {
        if(error.response.data.message === "user not found")
        {
          setLoginError("Invalid Username");
          setLoginUsername({value:loginUsername.value,error:"Invalid Username"});
        }else
        {
          setLoginError("Invalid Password");
          setLoginPassword({value:loginPassword.value,error:"Invalid Password"});
        }
      }else
      {
        setLoginError(error.message);
      }
    });
  }
  const restoreLoginState = () => {
    if(restoreAuthToken())
    {
      restoreUserProfile();
    }
  }


  /* User Profile Dialog */
  const inviteCodeElement = React.useRef();
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [IsUserProfileSettingsDialogOpen, setIsUserProfileSettingsDialogOpen] = useState(false);
  const submitUserProfileDialog = () => {
    setIsUserProfileSettingsDialogOpen(false);
  }
  const hideUserProfileSettingsDialog = () => {
    setIsUserProfileSettingsDialogOpen(false);
  }
  const getNewInviteCode = (inviteCodeElement) => {

    axios({method:"GET",url:apiEndpoint + '/invites', headers:getAuthHeader()}
    ).then(result => {
      setGeneratedInviteCode(result.data.code);
      inviteCodeElement.current.setCodeValue(result.data.code);
    }).catch(error => {
    });
  }

  const storeInviteCode = (inviteCodeElement) => {
    axios({method:"POST",url:apiEndpoint + '/invites', headers:getAuthHeader(), data:{code:inviteCodeElement.substr(0,9)}, }
    ).then(result => {
      
      var receivedUserProfile = transformUserProfile(result.data);
      setUserProfile (receivedUserProfile);
      
    }).catch(error => {
    });
  }
  
  const leaveGroup = (inviteCodeElement) => {
    axios({method:"DELETE",url:apiEndpoint + '/invites', headers:getAuthHeader()} ).then(result => {
      
      var receivedUserProfile = transformUserProfile(result.data);
      setUserProfile (receivedUserProfile);
      
    }).catch(error => {
    });
    
  }


  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <AppBar className={classes.appBar}>
        <Toolbar>

          {loggedIn && 
            <MainDrawer />
          }
        
          <Typography variant="h6" className={classes.title}>
            piggytracker
          </Typography>
          {!loggedIn ?
            <Button onClick={showLoginDialog} color="inherit">Login</Button>
            :
            <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Avatar ref={avatarDisplay} 
                  aria-controls="avatar-context-menu" 
                  aria-haspopup="true" 
                  {...bindTrigger(popupState)}
                  src={userProfile.avatarUrl}
                  style={{cursor:"pointer"}}
                  >{userProfile.initials}</Avatar>
                <Menu {...bindMenu(popupState)} anchorOrigin={{horizontal:"right", vertical:"left"}}>
                  <MenuItem id="avatar-context-menu-fullname">{userProfile.fullname}</MenuItem>
                  <MenuItem id="avatar-context-menu-settings" onClick={hideAvatarContextMenu}>Settings</MenuItem>
                  <MenuItem onClick={hideAvatarContextMenu} id="avatar-context-menu-logout">Logout</MenuItem>

                  
                </Menu>
              </React.Fragment>
            )}
            </PopupState>
          }
        </Toolbar>
      </AppBar>
      
      
      {/* User Profile Settings */}
      {userProfile && 
      <Dialog open={IsUserProfileSettingsDialogOpen} onClose={hideUserProfileSettingsDialog} aria-labelledby="form-dialog-add-entry-title">
        <DialogTitle id="form-dialog-add-entry-title">Profile Settings
          <IconButton aria-label="close" className={classes.dialogCloseButton} onClick={hideUserProfileSettingsDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
         <InviteCode ref={inviteCodeElement} refreshClicked={getNewInviteCode} 
         saveClicked={storeInviteCode}
         length
         setValue={setGeneratedInviteCode}
         value={generatedInviteCode} leaveClicked={leaveGroup} user={userProfile} />
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
      }
      {/* MONTHLY TARGET DIALOG */}
      <Dialog open={IsMonthTargetsDialogOpen} onClose={hideMonthTargetsDialog} aria-labelledby="form-dialog-add-entry-title">
      <DialogTitle id="form-dialog-add-entry-title">Monthly Target for {monthTargetsObject ? dateTimeFormatMonthName.format(new Date(monthTargetsObject.year,monthTargetsObject.month,1)) : ""}</DialogTitle>
      <DialogContent>
        {catMonthTargets.map(target => 
        <Box>
            <TextField id={target.category}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SmallAvatar src={Config.getCategoryUrl(target.category)} /></InputAdornment>,
              }}
              type="number"
              label={target.category}
              value={target.value}
              onChange={(e) => (setCatMonthTargetValue(target,e.target.value))} />
        </Box>
         )}
      </DialogContent>
      <DialogActions>
        <Button onClick={hideMonthTargetsDialog} color="primary">
          Cancel
        </Button>
        <div className={classes.wrapper}>
        <Button variant="contained" disabled={monthTargetsDialogSavingAllowed} onClick={submitMonthTargetsDialog} color="primary" disableElevation>
          Save
        </Button>
        {monthTargetsDialogSavingAllowed && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </DialogActions>
      </Dialog>

      {/* ADD ENTRY DIALOG */}


      <Dialog open={IsAddEntryDialogOpen} onClose={hideAddEntryDialog} aria-labelledby="form-dialog-add-entry-title">
      <DialogTitle id="form-dialog-add-entry-title">{selectedEntryId ? "Edit" : "Add"} Entry</DialogTitle>
      <DialogContent>
        <DialogContentText>
          
        </DialogContentText>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant="inline"
            format={Config.pickerDateTimeFormat}
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
          variant="filled"
          value={entryValue.value}
          onChange={(e) => setEntryValue({value:ensureMonetaryValue(e.target.value),error:null})}
        />
        
        <FormControl className={classes.formControl }>
        <InputLabel id="addEntryCategoryLabel">Category</InputLabel>
          <Select
           labelId="addEntryCategoryLabel"
           value={entryCategory.value} onChange={(e) => setEntryCategory({value:e.target.value,error:null})}
           fullWidth
           
           >
          {accountValues.categories.map( (category) =>
            <MenuItem value={category}>
              <Chip label={category} variant="outlined" size="small" avatar={<Avatar src={Config.getCategoryUrl(category)} />} />
              </MenuItem>
          )}
          </Select>
          
        </FormControl>
        <FormControl className={classes.formControl }>
        
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
        </FormControl>

        <ExpansionPanel expanded={expandAddEntryDialog} onChange={e => setExpandAddEntryDialog(!expandAddEntryDialog)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
          >
              More
            </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.form}>
            <FormControl className={classes.formControl}>
              <InputLabel id="addEntryRemuneratorLabel">Remunerator</InputLabel>
              <Select
              labelId="addEntryRemuneratorLabel"
              value={entryRemunerator.value} onChange={(e) => setEntryRemunerator({value:e.target.value,error:null})}
              fullWidth
              
              >
              {accountValues.remunerators.map( (user) =>
                <MenuItem value={user}>
                  <Chip label={user} variant="outlined" size="small" avatar={<Avatar src={Config.getAvatarUrl(user)} />} />
                </MenuItem>
              )}
              </Select>
              
            </FormControl>

            <FormControl className={classes.formControl}>
              <Grid container spacing={1}>
                <Grid item>
                  <TextField id="entry-remunerator"
                    label="Remunerator"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
                    }}
                    value={entryRemunerator.value}
                    onChange={(e) => setEntryRemunerator({value:e.target.value,error:null})}
                    fullWidth
                    />

                </Grid>
                <Grid item>
                  <TextField id="entry-category"
                    label="Category"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><CheckCircleIcon /></InputAdornment>,
                    }}
                    fullWidth
                    value={entryCategory.value}
                    onChange={(e) => setEntryCategory({value:e.target.value,error:null})}
                    />

                </Grid>
              </Grid>
              
            </FormControl>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        

      </DialogContent>
      <DialogActions  className={classes.dialogActions}>
      

        {selectedEntryId && <Button variant="contained" onClick={deleteSelectedEntry} color="secondary" disableElevation align="left" className={classes.deleteButton}>
          Delete
        </Button>}
        <Box className={classes.spacer} />
        <Button onClick={hideAddEntryDialog} color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={submitAddEntryDialog} color="primary" disableElevation>
          {selectedEntryId ? "Save" : "Add"}
        </Button>
      </DialogActions>
      </Dialog>

      {/* LOGIN DIALOG */}
      <Dialog open={IsLoginDialogOpen} onClose={hideLoginDialog} aria-labelledby="form-dialog-title">
      <GoogleLogin
        clientId="483535558510-vhcru5umuiitnjiknlnc8g62s4v6p876.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={onSignIn}
        onFailure={onSignIn}
        isSignedIn={true}
        cookiePolicy={'single_host_origin'}
      />
    
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
        <Typography color="error" style={{fontWeight:"bold",flexGrow:1,paddingLeft:theme.spacing(2)}}>
          {loginError}
        </Typography>
        {submittingLogin && 
          <CircularProgress  size={12}></CircularProgress>
        }
        <Button onClick={hideLoginDialog} color="primary">
          Cancel
        </Button>
        <Button disabled={submittingLogin} variant="contained" onClick={submitLoginDialog} color="primary">
        Login
        </Button>
      </DialogActions>
      </form>
      </Dialog>
      {!loggedIn &&
        <Container style={{ height: 'calc(70vh)', lineHeight:'calc(70vh)' }}>
        
              <picture>
                <source srcSet="icon.webp" type="image/webp" />
                <source srcSet="icon.jpg" type="image/jpeg" />
                <img alt="icon" style={{ width: "40vmin", height:"40vmin",
                verticalAlign:"middle",
                marginLeft:"auto",marginRight:"auto"
                }}/>             
                 </picture>
                <Typography variant="overline" display="block" gutterBottom className={classes.versionString}>
                version: {process.env.REACT_APP_CURRENT_GIT_SHA}
                </Typography>
            
        </Container>
      }   
      {loggedIn && currentView === "wastrel" && 
        
        <div style={{ height: 'calc(90vh-56px)',paddingLeft: 20, paddingRight: 20,paddingTop: 20 }}>
              <Grid container justify="center" spacing={2} className={classes.accountsGrid}>
          {accountValues.remuneratorSpendings.map((wastrel,i,all) =>
              <Grid item>
                <WastrelCard wastrel={wastrel} next={(all.length > (i+1))?all[i+1]:undefined} item />
              </Grid>
              
          )}
          </Grid>
        </div>
      } 
      {loggedIn && (currentView === "entries") && 
        <div style={{ height: 'calc(90vh-56px)' }}>
          <AutoSizer>
            {({height, width}) => (

              <EntriesTable className={classes.table}
              width={width}
              height={height}
              fixedRowCount={0}
              columns={dataTableDataColumns(width)}
              rowHeight={48}
              data={dataEntries}
              includeHeaders={true}
              cellProps={{ style: { overflow:"hidden", paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1),paddingBottom:0,paddingTop:0 } }}
              onCellClick={(column, rowData) => beginEditEntry(rowData._id, column.name)}
              >
              </EntriesTable>
            )}
          </AutoSizer>
    
        </div>
      }
      {loggedIn && (currentView === "accounts") && 
       
        <div style={{ height: 'calc(100vh)',paddingLeft: 20, paddingRight: 20,paddingTop: 20 }}>
          
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
                <Grid key={catMonth.month} item xs>
                  <MonthCard monthCategories={catMonth} accounts={accountValues} menuToggle={(e,tid) =>{catMonthOptionsMenuToggle(e,tid);}} />
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
  <BottomNavigationAction label="Months" icon={<AccountBalanceIcon />} />
  <BottomNavigationAction label="Wastrel" icon={<EmojiEventsIcon />} />
</BottomNavigation>
      {loggedIn &&
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={(e) => showAddEntryDialog()}>
          <AddIcon />
        </Fab>
      }
    </ThemeProvider>
    </div>
    

  );
}

export default App;
