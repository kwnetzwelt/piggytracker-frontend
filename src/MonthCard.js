import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Config from './Config';
import { Card, CardHeader, IconButton, CardMedia, CardContent, Typography, LinearProgress, Table, TableBody, TableCell, TableRow, Chip, Avatar } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import API from './API';
import {red,blueGrey} from '@material-ui/core/colors';

/**
 * 
 * @param {catMonth, accountValues, user} props 
 */
export default function MonthCard(props) {
  
  const dateTimeFormatMonthName = Intl.DateTimeFormat(Config.locale,Config.dateTimeFormatMonthName);
  
  const ref = React.createRef();

  const [state,setState] = React.useState({
    monthCategories: {month : ""},
    showWhatsLeft : false,
    critical: false,
    name: "April",
    total: "0",
    totalPercent: 10.34,
    target: "0",
    timePast: 0,
    timeLeft: 0,
    isInFuture: false,
    whatsLeft: "0",
    categories: [{
      critical: false,
      name: "Car",
      total: "0",
      target: "0",
      whatsLeft: "0",
    }],
    
  });

  React.useEffect(
    () => {

      if(props.monthCategories.month === new Date().getMonth())
      {
        console.log("scrolling. ...");
        ref.current.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
      }
      const targetValueMonth = props.accounts.getTargetValueMonth(props.monthCategories);
      const categories = [];
      props.accounts.categories.map((entry) => {
        const targetInCategory = props.accounts.getTargetValue(props.monthCategories.tid ,  entry);
        const status = props.accounts.getTargetStatus(props.monthCategories.tid, entry,props.monthCategories.getValueInCategory(entry) ?? 0);
        const total = props.monthCategories.getValueInCategory(entry) ?? 0;
        const target = props.accounts.getTargetValue(props.monthCategories.tid ,  entry);
        const category = {
          critical : status === "CRIT",
          name: entry,
          icon: API.getCategoryUrl(props.user.groupId, entry),
          target: targetInCategory,
          total: Config.toCurrencyValue(total),
          target: Config.toCurrencyValue(target),
          whatsLeft: Config.toCurrencyValue(target-total)
        }
        categories.push(category);
      });
      setState(s => ({...s, 
        monthCategories : props.monthCategories,
        isInFuture : props.monthCategories.isInFuture(),
        name: dateTimeFormatMonthName.format(new Date(props.monthCategories.year,props.monthCategories.month,1)).split(" ").join("\u00a0"),
        total: Config.toCurrencyValue(props.monthCategories.totalsSum),
        totalPercent: (props.monthCategories.totalsSum / targetValueMonth * 100).toFixed(0),
        whatsLeft: Config.toCurrencyValue(targetValueMonth - props.monthCategories.totalsSum),
        target: Config.toCurrencyValue(targetValueMonth),
        critical: (props.monthCategories.totalsSum / targetValueMonth) > Config.criticalThreshold,
        timePast: Math.round(props.monthCategories.timePast() * 100),
        categories: categories,
      }));
    }
  ,[props]);

  const useStyles = makeStyles((theme) => ({
    root: {
      borderRadius:0
    },
    cardMedia: {
      objectPosition: "50% 66%"

    },
    futureCard:{
      backgroundColor: blueGrey[100],
      borderRadius:0
    },
    spacer : {
      flexGrow:1
    },
    value : {
      textAlign: "right"
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
    tableCells:
    {
      padding: "6px 1px 6px 16px"
    },
    critical: {
      padding: "6px 1px 6px 16px",
      color: red[400],
      fontWeight:"bold"
    },
    
  }));
  const cardClicked = (e) => {
    setState({...state, showWhatsLeft: !state.showWhatsLeft});
  }
  const classes = useStyles();
  return (
    <Card className={state.isInFuture ? classes.futureCard : classes.root} variant="elevation" style={{position: "relative"}}>
    
      <div ref={ref} style={{position: "absolute", top: "-56px", left: 0}}></div>
      <CardHeader title={state.name}
        action={
          <IconButton aria-label="settings" onClick={e => props.menuToggle(e,props.monthCategories)}>
            <MoreVertIcon />
          </IconButton>
        }
      >
      </CardHeader>
      
                       <CardMedia
          component="img"
          alt="nice image here"
          height="140"
          image={Config.getMonthImageUrl(state.monthCategories)}
          className={classes.cardMedia}
          title="nice image here"
        />
                    <CardContent align="left" onClick={cardClicked}>
                      
                      <Typography gutterBottom variant="subtitle2">
                        <Grid container>
                          <Grid item className={classes.spacer} xs={3} sm={3} />
                          <Grid item xs={6} sm={6}>Money {(state.showWhatsLeft ? "left" : "spent")}:</Grid>
                          <Grid item xs={3} sm={3} className={classes.value}>{(state.showWhatsLeft? state.whatsLeft : state.total)}</Grid>
                          
                          <Grid item className={classes.spacer} xs={3} sm={3} />
                          <Grid item xs={6} sm={6}>Percent {(state.showWhatsLeft ? "left" : "spent")}:</Grid>
                          <Grid item xs={3} sm={3} className={classes.value}>{(state.showWhatsLeft ? 100 - state.totalPercent : state.totalPercent)} %</Grid>
                        </Grid>
                        <LinearProgress variant="determinate" name="moneySpent" 
                          value={Math.max(0, Math.min(100, state.totalPercent))} 
                      color={state.critical ? "secondary" : "primary"} />
                        <Grid container>
                          <Grid item className={classes.spacer} xs={3} sm={3} />
                          <Grid item xs={6} sm={6}>Time {(state.showWhatsLeft ? "left" : "past")}:</Grid>
                          <Grid item xs={3} sm={3} className={classes.value}>{(state.showWhatsLeft? 100 - state.timePast : state.timePast)} %</Grid>

                        </Grid>
                      <LinearProgress variant="determinate" name="monthPast" value={state.timePast} />
                      </Typography>
                      <Table size="small" className={classes.table} aria-label="simple table">
                        <TableBody>
                        {state.categories.map((category) =>
                          <TableRow key={category.name}>
                            <TableCell className={classes.tableCells}>
                            <Chip label={category.name} variant="outlined" size="small" avatar={<Avatar src={category.icon} />} /></TableCell>
                            <TableCell className={(category.critical ? classes.critical : classes.tableCells)} align="right">
                            {(state.showWhatsLeft? category.whatsLeft : category.total)}
                            
                            </TableCell>
                            <TableCell align="right">{category.target}</TableCell>
                          </TableRow>
                        )}
                          <TableRow key="tots">
                            <TableCell></TableCell>
                            <TableCell className={state.critical ? classes.critical:classes.root + " " + classes.tableCells} align="right">
                              <strong>{(state.showWhatsLeft? state.whatsLeft : state.total)}</strong></TableCell>
                            <TableCell align="right"><strong>{state.target}</strong></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
  );
}