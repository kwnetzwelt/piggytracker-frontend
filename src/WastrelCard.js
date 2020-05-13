import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Config from './Config';
import API from './API';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';

/**
 * 
 * @param {wastrel,next, user} props 
 */
export default function WastrelCard(props) {

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
  return (
    <Card className={classes.root}>
        <div className={classes.details}>
        <CardContent className={classes.content}>
            
            {props.wastrel.remunerator}
            <Typography className={classes.hugeMoney}>
                {Config.toCurrencyValue(props.wastrel.value)}
            </Typography>
            {props.next && 
            <Typography className={classes.wastrelDeltaText}>
                {Config.toCurrencyValue(props.wastrel.value - props.next.value)} too much!
            </Typography>
            }
        
            </CardContent>
            
      </div>
      <CardMedia
        className={classes.cover}
        image={API.getRemuneratorUrl(props.user.groupId, props.wastrel.remunerator)}
        title={props.wastrel.remunerator}
      />
    </Card>
                    
                    
    );
}


        