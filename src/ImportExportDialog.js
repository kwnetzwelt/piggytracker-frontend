import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { FilePicker } from 'react-file-picker';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { IconButton,  Drawer, Divider, Typography, useTheme, ListItemAvatar, Avatar, ListItemSecondaryAction, MenuItem, Menu, Snackbar, Button, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControlLabel, Checkbox } from '@material-ui/core';
import API from './API';
import Axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';



/**
 * 
 * @param {open, onClosed, user } props 
 */
export default function ImportExportDialog(props) {
    
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    
    React.useEffect(
        () => {
            console.log("changed " + props.open);
            setState({ ...state, open: props.open, user: props.user });
        }
        ,[props]);
        const [state, setState] = React.useState({
            open : props.open ,
            user : props.user,
            info: "",
            infoText: "",
            deleteExistingOnImport: false,
            deleteExistingOnExport: false,
        });
        
        const handleDeleteExistingOnImport = (value) => {
            setState({...state, deleteExistingOnImport : value.currentTarget.checked});
        };

        const handleDeleteExistingOnExport = (value) => {
            setState({...state, deleteExistingOnExport : value.currentTarget.checked});
        };
        const handleClose = (event) => {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }
                props = {...props, open : false};
                setState({ ...state, open: props.open });
                if(props.onClosed)
                {
                    props.onClosed();
                }
            
        }
        
        const handleImport = (FileObject) => {
            var data = new FormData();
            data.append('csv', FileObject);
            data.append('clear', state.deleteExistingOnImport);

            Axios({method:"POST",url : API.apiEndpoint + "/bills/import", headers: {...API.getAuthHeader(),
                'content-type': 'multipart/form-data'}, data:data}).then( result => {
        
                setState({...state, uploadInfo: "success", uploadInfoText:"Upload succeeded!", elementMenuOpen: null});
                console.log(JSON.stringify(result));
            }).catch((e) => {
                setState({...state, uploadInfo: "error", uploadInfoText:"Upload failed!",elementMenuOpen: null});
            }).finally(() =>{
            
            });
        }

        const handleExport = () => {
            Axios({method:"GET",url : API.apiEndpoint + "/bills/export", headers: API.getAuthHeader(), responseType:'blob'}).then( result => {
                
                setState({...state, info: "success", infoText:"export succeeded!", elementMenuOpen: null});
                
                
                const url = window.URL.createObjectURL(new Blob([result.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'export.csv');
                document.body.appendChild(link);
                link.click();

            }).catch((e) => {
                setState({...state, info: "error", infoText:"Upload failed!",elementMenuOpen: null});
            }).finally(() =>{
                
            });
        }

        const uploadImage = () => {
            Axios({method:"POST",url : API.apiEndpoint + "/images/" + state.elementType.toLowerCase(), headers: API.getAuthHeader()}).then( result => {
                
                setState({...state, info: "success", infoText:"Upload succeeded!", elementMenuOpen: null});
                console.log(JSON.stringify(result));
            }).catch((e) => {
                setState({...state, uploadInfo: "error", uploadInfoText:"Upload failed!",elementMenuOpen: null});
            }).finally(() =>{
                
            });
            
            
        }
        
        const handleInfoClose = (e, reason) => {
            if (reason === 'clickaway') {
              return;
            }
        
            setState({...state, info: ""});
          }
        

        const theme = useTheme();
        const useStyles = makeStyles((theme) => ({
            dialogCloseButton: {
                position: 'absolute',
                right: theme.spacing(1),
                top: theme.spacing(1),
                color: theme.palette.grey[500],
              },
              source: {
                  backgroundColor: theme.palette.grey[300],
                  paddingLeft: theme.spacing(1),
                  paddingRight: theme.spacing(1),
                  marginTop:theme.spacing(1),
                  marginBottom:theme.spacing(1),
                  fontFamily: "mono",
                  display:"block"
              },
              importantNote: {
                  textTransform:"uppercase",
                  fontSize:"0.875rem",
                  fontWeight:500,
                  display:"block"
              },

              importantNoteSelected: {
                textTransform:"uppercase",
                fontSize:"0.875rem",
                fontWeight:500,
                color: theme.palette.secondary.main,
                display:"block"
            }
        }));
        
        const classes = useStyles();
        const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
        return (
            <Dialog
            fullScreen={fullScreen}
            open={state.open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            >
    <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}
    <IconButton aria-label="close" className={classes.dialogCloseButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
          <Typography variant="h6" style={{display:"block"}} component="span">Import</Typography>
            You can import Entries from an existing .csv-file, which you can upload. Please make sure the file is formatted using comma-delimiter. In general the format should look like follows:
            <Typography variant="subtitle2" component="span" className={classes.source}>date,value,category,remunerator,info<br />
2020-05-16T12:19:27.938Z,4.99,children,Max Mustermann,Flummies</Typography>
            <Typography component="span" className={state.deleteExistingOnImport ? classes.importantNoteSelected : classes.importantNote}> If you select "Delete existing", all entries associated with your account will be <u>replaced</u> by the entries you provide with your .csv-file. </Typography>
      </DialogContentText>
    <DialogActions>
        <FormControlLabel
        control={<Checkbox checked={state.deleteExistingOnImport} onChange={handleDeleteExistingOnImport} name="checkedDeleteExistingOnImport" />}
        label="Delete existing"
        />
        <FilePicker
              extensions={['csv']}
              onChange={FileObject => {handleImport(FileObject)}}
              >
                  <Button   autoFocus variant="contained" id="btn-import"
              startIcon={<CloudUploadIcon />}>
        Import
      </Button>
      </FilePicker>
      
    </DialogActions>
      <Divider />
      <DialogContentText>
          <Typography variant="h6" style={{display:"block"}} component="span">Export</Typography>
            You can export all Entries associated with your account as a .csv-file. Targets and Icons are not exported. The resulting format will look like this:
            <Typography variant="subtitle2" component="span" className={classes.source}>date,value,category,remunerator,info<br />
2020-05-16T12:19:27.938Z,4.99,children,Max Mustermann,Flummies</Typography>
     </DialogContentText>
    <DialogActions>
      <Button onClick={handleExport} autoFocus variant="contained" id="btn-export"
              startIcon={<CloudDownloadIcon />}>
        Export
      </Button>
    </DialogActions>
    </DialogContent>

    <Snackbar
            autoHideDuration={2000}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={Boolean(state.info)}
            onClose={handleInfoClose}>
            <Alert onClose={handleInfoClose} severity={state.info}>
              {state.infoText}
            </Alert>
          </Snackbar>
  </Dialog>           
  );
}