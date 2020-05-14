import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ImagePicker as ReactImagePicker} from 'react-file-picker';
import { Avatar } from '@material-ui/core';
 /**
 * 
 * @param { deleteClicked, src, alt } props 
 */
export default function PImagePicker (props) {
    const useStyles = makeStyles((theme) => ({
        root: {
      
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
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
           
    
                    <ReactImagePicker
    extensions={['jpg', 'jpeg', 'png']}
    onChange={base64 => {props.src = base64}}
    dims={{minWidth: 100, maxWidth: 500, minHeight: 100, maxHeight: 500}}><Avatar
                className={classes.input}
                alt={props.alt}
                src={props.src}
                inputProps={{ 'aria-label': 'invite code' }}
                readOnly
                /></ReactImagePicker>
);
}