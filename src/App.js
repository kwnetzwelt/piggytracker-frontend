import React, { useState, useEffect, useRef, createRef} from 'react';
import { makeStyles,withStyles,lighten } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
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
import MaterialTable from 'material-table';
import './App.css';
import axios from 'axios';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Avatar, TextField, Card, CardContent, CardHeader, InputLabel, ThemeProvider, createMuiTheme, Box } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
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
import {Accounts,Target} from './Accounts.js';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';

import {red,dark} from '@material-ui/core/colors';


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
  },
  appBar: {
    position: 'sticky',
    backgroundColor: theme.primary
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
  },
  critical: {
    color: red[400],
    fontWeight:"bold"
  }
}));

function App() {

  Date.prototype.monthDays= function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
  }

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
  const [monthTargetsObject, setMonthTargetsObject] = React.useState(null);
  const [IsMonthTargetsDialogOpen, monthTargetsDialogOpen] = useState(false); // hidden dialogs
  const [catMonthTargets, setCatMonthTargets] = useState([]);
  const [monthTargetsDialogSavingAllowed,setMonthTargetsDialogSavingAllowed] = useState(false);

  const monthTargetsColumns = [{title:'Category',field:'category'},{title:'Target',field:'value', type:"number"}];
  
  const catMonthMoneySpent = (catMonth) => {
    
  }


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
      axios({method: updatedTargetData._id ? "PUT" : "POST",url : apiEndpoint + "/target" + (updatedTargetData._id ? ("/"+updatedTargetData._id) : ("")), headers: getAuthHeader(), data:updatedTargetData}).then( result => {
        
        updatedTargetData._id = result.data._id;
        console.log("done");      
      }).finally(() =>{
        setMonthTargetsDialogSavingAllowed(false);
        hideMonthTargetsDialog();
      });
setMonthTargetsDialogSavingAllowed(false);
        hideMonthTargetsDialog();

  }
  const monthTargetsEditableFunctions = {

    onRowUpdate: (newData, oldData) =>
      new Promise((resolve) => {
        resolve();
        const data = [...catMonthTargets];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          if(element.category === oldData.category){
            data[index] = newData;
            data[index].value = parseFloat(data[index].value);
          }
        }
        setCatMonthTargets(data);
        setMonthTargetsDialogSavingAllowed(false);
      }),
  }

  /* -- data handling --*/
  const dataTableDataColumns = [
      {  header: "Date", name:"date",  cell:(row) => dateTimeFormat.format(new Date(row.date))},
      {  header: "Value", name:"value", alignItems: "right",      cell:(row) => Config.toCurrencyValue(row.value ?? 0)} ,
      {  header: "Remunerator", name: "remunerator" },
      {  header: "Category",    name: "category"    },
      {  header: "Info",        name: "info"        }
    ];
  const [dataEntries,setDataEntries] = useState([]);
  const [accountValues,setAccountValues] = useState(new Accounts());
  const [selectedEntryId,setSelectedEntryId] = useState(null);
  const updateAccounts = (entries,targets) => {
    if(!targets)
      targets = accountValues.targets;

    const newAccountValues = new Accounts(targets);
    entries.forEach(element => {
      newAccountValues.addEntry(element);
    });
    setAccountValues(newAccountValues);
  }

  const beginEditEntry = (entryId, clickedColumn) => {
   // (rowData._id, column.name)
   const entry = dataEntries.find((e) => e._id == entryId);
   setEntryDate({value:new Date(entry.date),error:null});
   setEntryValue({value:entry.value,error:null});
   setEntryRemunerator({value:entry.remunerator,error:null});
   setEntryCategory({value:entry.category,error:null});
   setEntryInfo({value:entry.info,error:null});
   //setEntryDate()
   showAddEntryDialog(entry._id);
  }

  const deleteSelectedEntry = (e) => {
    axios({method:"DELETE",url : apiEndpoint + "/bill" + ("/"+selectedEntryId), headers: getAuthHeader()}).then( result => {
      hideAddEntryDialog();
      var index = dataEntries.findIndex((e) => e._id == selectedEntryId);
      dataEntries.splice(index,1);
      setDataEntries(dataEntries);
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
  const [selectedRemunerator,setSelectedRemunerator] = useState(null);
  const showAddEntryDialog = (id) => {
    
    setSelectedEntryId(id);
    if(!id)
    {
      setEntryDate({value:new Date(),error:null});
      setEntryValue({value:0,error:null});
      setEntryCategory({value:"",error:null});
      setEntryRemunerator({value:"",error:null});
      setEntryInfo({value:"",error:null});
    }
    addEntryDialogOpen(true);
  }
  const hideAddEntryDialog = () => {
    addEntryDialogOpen(false);
  }

  const handleRemuneratorSelectionChange = (e) => {
    setSelectedRemunerator(e.target.value);
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
    if(selectedEntryId)
    {
     entry._id = selectedEntryId;
    }
    axios({method:selectedEntryId ? "PUT" : "POST",url : apiEndpoint + "/bill" + (selectedEntryId ? ("/"+selectedEntryId) : ("")), headers: getAuthHeader(), data:entry}).then( result => {

      hideAddEntryDialog();
      
      if(selectedEntryId)
      {
        //edited entry updated successfully
        const index = dataEntries.findIndex((e) => e._id == selectedEntryId);
        dataEntries[index] = result.data;
      }else
      {
        //entry created successfully
        dataEntries.unshift(result.data);
      }

      setDataEntries(dataEntries);
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
          if(total > (page * pageSize + data.length))
          {
            setTimeout(fetchAllData, 1,pageSize, page+1);
          }else
          {
            
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
      <ThemeProvider theme={theme}>
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
            <Avatar ref={avatarDisplay} aria-controls="avatar-context-menu" aria-haspopup="true" onClick={showAvatarContextMenu} src={Config.staticAssets + userProfile.avatarUrl}>{userProfile.initials}</Avatar>
            
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
      <DialogTitle id="form-dialog-add-entry-title">Monthly Target for {monthTargetsObject ? dateTimeFormatMonthName.format(new Date(monthTargetsObject.year,monthTargetsObject.month,1)) : ""}</DialogTitle>
      <DialogContent>
        <MaterialTable columns={monthTargetsColumns}
          data={catMonthTargets}
          editable={monthTargetsEditableFunctions}
          options={{
            paging: false,
            search:false,
            showTitle:false,
            toolbar:false
          }}

         />
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
          variant="filled"
          value={entryValue.value}
          onChange={(e) => setEntryValue({value:ensureMonetaryValue(e.target.value),error:null})}
        />
        
        <FormControl className={classes.formControl}>
          <InputLabel id="addEntryRemuneratorLabel">Remunerator</InputLabel>
          <Select
           labelId="addEntryRemuneratorLabel"
           value={entryRemunerator.value} onChange={(e) => setEntryRemunerator({value:e.target.value,error:null})}
           fullWidth
           
           >
          {accountValues.remunerators.map( (user) =>
            <MenuItem value={user}>{user}</MenuItem>
          )}
          </Select>
          
        </FormControl>
        <FormControl className={classes.formControl }>
        <InputLabel id="addEntryCategoryLabel">Category</InputLabel>
          <Select
           labelId="addEntryCategoryLabel"
           value={entryCategory.value} onChange={(e) => setEntryCategory({value:e.target.value,error:null})}
           fullWidth
           
           >
          {accountValues.categories.map( (category) =>
            <MenuItem value={category}>{category}</MenuItem>
          )}
          </Select>
          
        </FormControl>
        <FormGroup row>
          <TextField id="entry-remunerator"
            label="Remunerator"
            InputProps={{
              startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment>,
            }}
            className="col-md-2"
            value={entryRemunerator.value}
            onChange={(e) => setEntryRemunerator({value:e.target.value,error:null})}
            />
          <TextField id="entry-category"
            label="Category"
            className="col-md-2"
            InputProps={{
              startAdornment: <InputAdornment position="start"><CheckCircleIcon /></InputAdornment>,
            }}
            
            value={entryCategory.value}
            onChange={(e) => setEntryCategory({value:e.target.value,error:null})}
            />
          
        </FormGroup>

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
              onCellClick={(column, rowData) => beginEditEntry(rowData._id, column.name)}
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
                  
                    <CardHeader title={dateTimeFormatMonthName.format(new Date(catMonth.year,catMonth.month,1))}
                      action={
                        <IconButton aria-label="settings" onClick={e => catMonthOptionsMenuToggle(e,catMonth)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                    </CardHeader>
                    <CardContent align="left">
                      
                      <Typography gutterBottom variant="subtitle1">
                        <Grid container>
                          <Grid item>Percent of Money spent:</Grid>
                          <Grid item className={classes.spacer} />
                          <Grid item>{((catMonth.totalsSum / accountValues.getTargetValueMonth(catMonth)) * 100).toFixed(2)}%</Grid>
                        </Grid>
                      <LinearProgress variant="determinate" name="moneySpent" value={(catMonth.totalsSum / accountValues.getTargetValueMonth(catMonth)) * 100} color={(catMonth.totalsSum / accountValues.getTargetValueMonth(catMonth)) > Config.criticalThreshold ? "secondary" : "primary"} />
                        <Grid container>
                          <Grid item>Percent of Month Past:</Grid>
                          <Grid item className={classes.spacer} />
                          <Grid item>{(catMonth.timePast() * 100).toFixed(2)}%</Grid>
                        </Grid>
                      <LinearProgress variant="determinate" name="monthPast" value={catMonth.timePast() * 100} />
                      </Typography>
                      <Table className={classes.table} aria-label="simple table">
                        <TableBody>
                        {catMonth.totals.map((entry) =>
                          <TableRow key={entry.category}>
                            <TableCell>{entry.category}</TableCell>
                            <TableCell className={accountValues.getTargetStatus(catMonth.tid, entry.category,entry.value ?? 0) == "CRIT" ? classes.critical:classes.root} align="right">{Config.toCurrencyValue(entry.value ?? 0)}</TableCell>
                            <TableCell align="right">{Config.toCurrencyValue(accountValues.getTargetValue(catMonth.tid, entry.category))}</TableCell>
                          </TableRow>
                        )}
                          <TableRow key="tots">
                            <TableCell></TableCell>
                            <TableCell className={(catMonth.totalsSum / accountValues.getTargetValueMonth(catMonth)) > Config.criticalThreshold ? classes.critical:classes.root} align="right"><strong>{Config.toCurrencyValue(catMonth.totalsSum)}</strong></TableCell>
                            <TableCell align="right"><strong>{Config.toCurrencyValue(accountValues.getTargetValueMonth(catMonth))}</strong></TableCell>
                          </TableRow>
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
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={(e) => showAddEntryDialog()}>
          <AddIcon />
        </Fab>
      }
    </ThemeProvider>
    </div>
    

  );
}

export default App;
