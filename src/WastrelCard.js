import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Config from './Config';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';

/**
 * 
 * @param {wastrel,next} props 
 */
export default function WastrelCard(props) {

  const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width:350,
        borderRadius:0
      },
      details: {
        display: 'flex',
        flexDirection: 'column',
      },
      content: {
        flex: '1 0 auto',
        width: 200
      },
      cover: {
        width: 150,
        height:150,
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
        image={Config.getAvatarUrl(props.wastrel.remunerator)}
        title={props.wastrel.remunerator}
      />
    </Card>
                    
                    
    );
}


        