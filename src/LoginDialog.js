import React from 'react';
import GoogleLogin from 'react-google-login';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import axios from 'axios';
import { IconButton, Divider, Typography, useTheme, Snackbar, Button, useMediaQuery, Dialog, DialogTitle, DialogContent, TextField, Paper} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import API from './API';
import Config from './Config';

/**
 * 
 * @param {open, loginComplete } props 
 */
export default function LoginDialog(props) {
    let popup;
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    React.useEffect(() => {
        // Run only once
        window.addEventListener('message', (e) => {
            if (e.data && e.data.token && e.data.userProfile) {
                API.storeAuthToken(e.data.token);
                if(state.loginComplete) {
                    state.loginComplete(e.data.userProfile);
                }
                if (popup) {
                    popup.close();
                }
            }
        });
    });
    React.useEffect(
        () => {
            console.log("changed " + props.open);
            setState(s => ({...s, open: props.open, submittingLogin: false, loginComplete: props.loginComplete}));
            
        }
        ,[props]);
        const [state, setState] = React.useState({
            open : props.open ,
            loginComplete: null,
            info: "",
            infoText: "",
            loginUsername: "",
            loginPassword: "",
            submittingLogin: false,
        });
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
                
                API.storeAuthToken(result.data.token);
                if(state.loginComplete)
                    state.loginComplete(result.data.userProfile);
                
            }).catch(error => {
                console.log(JSON.stringify(error));
                if(error.response)
                    setState({...state, submittingLogin: false, info:"error", infoText:error.response.data.message});
                else
                    setState({...state, submittingLogin: false, info:"error", infoText:error.message});
            });
        }
        const startSso = () => {
            popup = window.open(API.ssoEndpoint, 'ssoauth', 'width=350,height=500');
        }
        const submitLoginDialog = (e) => {
            setState({...state, submittingLogin: true});
            e.preventDefault();
            
            var body = {
              username: state.loginUsername,
              password: state.loginPassword
            };
            axios.post(API.apiEndpoint + '/login',body
            ).then(result => {
                setState({...state, submittingLogin: false, info:"success", infoText:"logged in!"});
                API.storeAuthToken(result.data.token);
                state.loginComplete(result.data.userProfile);
            }).catch(error => {
                console.log(JSON.stringify(error));
                if(error.response)
                    setState({...state, submittingLogin: false, info:"error", infoText:error.response.data.message});
                else
                    setState({...state, submittingLogin: false, info:"error", infoText:error.message});
            });
          }
        const onSignInFailed = (failed) => 
        {
            console.log(JSON.stringify(failed));
            setState({...state, info: "error", infoText: "login failed"});
        }
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
        
        
        const handleInfoClose = (e, reason) => {
            if (reason === 'clickaway') {
              return;
            }
        
            setState({...state, info: ""});
          }
        

        const theme = useTheme();
        const useStyles = makeStyles((theme) => ({
            root : {

            },

            divider : {
                width: "40%",
                marginTop:theme.spacing(1.5),
                marginRight:theme.spacing(1),
                marginLeft:theme.spacing(1),
            }
            ,
            loginForm : {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
                marginTop: theme.spacing(1),
                marginBottom: theme.spacing(3),

                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
            },
            loginButton : {
                marginTop:theme.spacing(3),
                marginBottom:theme.spacing(2)
            },
            googleButton: {
                color: theme.palette.getContrastText("#db4a39"),
                backgroundColor: "#db4a39",
                '&:hover': {
                  backgroundColor: "#e67f73",
                },
              },
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
    <DialogTitle id="responsive-dialog-title">
    Login
    </DialogTitle>
    <DialogContent>
    
<form noValidate>
    <Paper elevation={2} className={classes.loginForm}>
        <TextField
          id="login-username"
          label="Username"
          type="text"
          autoComplete="current-username"
          onChange={(e) =>{setState({...state, loginUsername: e.target.value});}}
          fullWidth
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          onChange={(e) =>{setState({...state, loginPassword: e.target.value});}}
          fullWidth
        />

        <div style={{display:"flex", justifyContent:"flex-end"}}>
        <Button disabled={state.submittingLogin} className={classes.loginButton} onClick={submitLoginDialog} variant="contained" color="primary" >{"Login"}</Button>
        </div>
    </Paper>
            </form>
            <div style={{display:"flex",justifyContent:"center"}}>
            <Divider className={classes.divider} />
            <Typography flexGrow={1}>{"or"}</Typography>
            <Divider className={classes.divider} />
            </div>

            <Button onClick={startSso}>Central Login</Button>

            <div style={{display:"flex",justifyContent:"center"}}>
            <Divider className={classes.divider} />
            <Typography flexGrow={1}>{"or"}</Typography>
            <Divider className={classes.divider} />
            </div>
            
            <div style={{display:"flex",justifyContent:"center",marginTop:theme.spacing(2), marginBottom:theme.spacing(2)}}>
            <GoogleLogin
                clientId={Config.googleClientId}
                
                onSuccess={onSignIn}
                onFailure={onSignInFailed}
                isSignedIn={true}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                    <IconButton className={classes.googleButton} onClick={renderProps.onClick} disabled={renderProps.disabled} >
                        <FontAwesomeIcon fontSize="large" icon={faGoogle} />
                    </IconButton>
                    )}
            />
            </div>
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