import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ImagePicker as ReactImagePicker} from 'react-file-picker';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
 /**
 * 
 * @param { deleteClicked } props 
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

      const onDeleteClicked = () => {
        if(props.deleteClicked)
            props.deleteClicked();
      }

return (
           
    
         
        <Paper component="form" className={classes.root}>

                    <CloudUploadIcon className={classes.startIcon}/>
                    <ReactImagePicker
    extensions={['jpg', 'jpeg', 'png']}
    dims={{minWidth: 100, maxWidth: 500, minHeight: 100, maxHeight: 500}}><InputBase
                className={classes.input}
                placeholder="codeword1"
                value={""}
                inputProps={{ 'aria-label': 'invite code' }}
                readOnly
                /></ReactImagePicker>
                <IconButton color="primary" type="submit" className={classes.iconButton} aria-label="Delete" onClick={onDeleteClicked}>
                    <DeleteForeverIcon />
                </IconButton>
        </Paper>
);
}